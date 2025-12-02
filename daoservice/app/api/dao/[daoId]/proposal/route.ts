import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/db/db';
import DAO from '@/db/models/DAO';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ daoId: string }> }
) {
  try {
    await connectDB();

    // In Next.js 16, params is a Promise and must be awaited
    const { daoId } = await params;
    
    if (!daoId) {
      console.error('DAO ID is missing from params');
      return NextResponse.json(
        { error: 'DAO ID is required' },
        { status: 400 }
      );
    }
    
    console.log('Processing proposal for DAO:', daoId);
    const body = await request.json();
    const {
      proposalId,
      description,
      descriptionHash,
      actionType,
      targets,
      values,
      calldatas,
      state,
    } = body;

    // Validate required fields - proposalId is always required
    if (!proposalId) {
      return NextResponse.json(
        { error: 'Missing required field: proposalId' },
        { status: 400 }
      );
    }

    // Validate state
    if (state !== undefined && (state < 0 || state > 7)) {
      return NextResponse.json(
        { error: 'State must be between 0 and 7' },
        { status: 400 }
      );
    }

    // Find DAO by ID
    const dao = await DAO.findById(daoId);
    if (!dao) {
      return NextResponse.json({ error: 'DAO not found' }, { status: 404 });
    }

    // Convert proposalId to string if it's a BigInt
    const proposalIdString = typeof proposalId === 'bigint' ? proposalId.toString() : proposalId;

    // Check if proposal already exists
    const existingProposalIndex = dao.proposals.findIndex(
      (p) => p.proposalId === proposalIdString
    );

    const isUpdate = existingProposalIndex >= 0;

    // If updating existing proposal, only require proposalId and state
    // If creating new proposal, require all fields
    if (!isUpdate && (!description || !descriptionHash || !targets || !values || !calldatas)) {
      return NextResponse.json(
        {
          error:
            'Missing required fields for new proposal: description, descriptionHash, targets, values, calldatas',
        },
        { status: 400 }
      );
    }

    // Validate arrays have same length (only for new proposals)
    if (
      !isUpdate &&
      targets &&
      values &&
      calldatas &&
      (targets.length !== values.length || targets.length !== calldatas.length)
    ) {
      return NextResponse.json(
        {
          error: 'targets, values, and calldatas arrays must have the same length',
        },
        { status: 400 }
      );
    }

    if (isUpdate) {
      // Update existing proposal - only update provided fields
      const existingProposal = dao.proposals[existingProposalIndex].toObject();
      dao.proposals[existingProposalIndex] = {
        ...existingProposal,
        ...(description && { description }),
        ...(descriptionHash && { descriptionHash }),
        ...(actionType && { actionType }),
        ...(targets && { targets }),
        ...(values && { values: values.map((v: any) => String(v)) }),
        ...(calldatas && { calldatas }),
        ...(state !== undefined && { state }),
        updatedAt: new Date(),
      };
    } else {
      // Create new proposal - require all fields
      const proposalData = {
        proposalId: proposalIdString,
        description: description!,
        descriptionHash: descriptionHash!,
        actionType: actionType || undefined,
        targets: targets!,
        values: values!.map((v: any) => String(v)),
        calldatas: calldatas!,
        state: state !== undefined ? state : 0, // Default to Pending
      };
      // Add new proposal (only one active at a time - remove others if state is Active)
      if (state === 1) {
        // Remove other active proposals (state 1)
        dao.proposals = dao.proposals.filter((p) => p.state !== 1);
      }
      dao.proposals.push(proposalData as any);
    }

    await dao.save();

    const savedProposal =
      existingProposalIndex >= 0
        ? dao.proposals[existingProposalIndex]
        : dao.proposals[dao.proposals.length - 1];

    return NextResponse.json(
      {
        success: true,
        proposal: {
          proposalId: savedProposal.proposalId,
          description: savedProposal.description,
          descriptionHash: savedProposal.descriptionHash,
          actionType: savedProposal.actionType,
          targets: savedProposal.targets,
          values: savedProposal.values,
          calldatas: savedProposal.calldatas,
          state: savedProposal.state,
          createdAt: savedProposal.createdAt,
          updatedAt: savedProposal.updatedAt,
        },
      },
      { status: existingProposalIndex >= 0 ? 200 : 201 }
    );
  } catch (error: any) {
    console.error('Error saving proposal:', error);
    return NextResponse.json(
      { error: 'Failed to save proposal', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ daoId: string }> }
) {
  try {
    await connectDB();

    // In Next.js 16, params is a Promise and must be awaited
    const { daoId } = await params;
    const dao = await DAO.findById(daoId).select('proposals');

    if (!dao) {
      return NextResponse.json({ error: 'DAO not found' }, { status: 404 });
    }

    // Sort proposals by createdAt descending (newest first)
    const sortedProposals = [...dao.proposals].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Descending order
    });

    return NextResponse.json(
      {
        success: true,
        proposals: sortedProposals.map((p) => ({
          proposalId: p.proposalId,
          description: p.description,
          descriptionHash: p.descriptionHash,
          actionType: p.actionType,
          targets: p.targets,
          values: p.values,
          calldatas: p.calldatas,
          state: p.state,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposals', message: error.message },
      { status: 500 }
    );
  }
}

