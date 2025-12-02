import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/db/db';
import DAO from '@/db/models/DAO';

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse request body
    const body = await request.json();
    const { name, description, creator, governorAddress, tokenAddress, treasury, metadata } = body;

    // Validate required fields
    if (!name || !description || !creator || !governorAddress || !tokenAddress || !treasury) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, creator, governorAddress, tokenAddress, treasury' },
        { status: 400 }
      );
    }

    // Validate Ethereum address format
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    const addresses = { creator, governorAddress, tokenAddress, treasury };
    
    for (const [field, address] of Object.entries(addresses)) {
      if (!addressRegex.test(address)) {
        return NextResponse.json(
          { error: `Invalid Ethereum address format for ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if DAO with this governor address already exists
    const existingDAO = await DAO.findOne({ governorAddress });
    if (existingDAO) {
      return NextResponse.json(
        { error: 'DAO with this governor address already exists', dao: existingDAO },
        { status: 409 }
      );
    }

    // Create new DAO document
    const dao = new DAO({
      name,
      description,
      creator,
      governorAddress,
      tokenAddress,
      treasury,
      metadata: metadata || {},
    });

    // Save to database
    const savedDAO = await dao.save();

    return NextResponse.json(
      {
        success: true,
        dao: {
          _id: savedDAO._id,
          name: savedDAO.name,
          description: savedDAO.description,
          creator: savedDAO.creator,
          governorAddress: savedDAO.governorAddress,
          tokenAddress: savedDAO.tokenAddress,
          treasury: savedDAO.treasury,
          metadata: savedDAO.metadata,
          createdAt: savedDAO.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error saving DAO to database:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'DAO with this governor address already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save DAO', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const governorAddress = searchParams.get('governorAddress');
    const creator = searchParams.get('creator');

    let query: any = {};
    
    if (governorAddress) {
      query.governorAddress = governorAddress;
    }
    
    if (creator) {
      query.creator = creator;
    }

    const daos = await DAO.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: daos.length,
        daos: daos.map(dao => ({
          _id: dao._id,
          name: dao.name,
          description: dao.description,
          creator: dao.creator,
          governorAddress: dao.governorAddress,
          tokenAddress: dao.tokenAddress,
          treasury: dao.treasury,
          metadata: dao.metadata,
          createdAt: dao.createdAt,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching DAOs from database:', error);
    return NextResponse.json(
      { error: 'Failed to fetch DAOs', message: error.message },
      { status: 500 }
    );
  }
}

