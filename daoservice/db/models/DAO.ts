import mongoose, { Schema, Document } from 'mongoose';

export interface IProposal {
  proposalId: string; // BigInt as string
  description: string;
  descriptionHash: string;
  actionType?: string; // e.g., "TRANSFER_TO_TREASURY"
  targets: string[];
  values: string[];
  calldatas: string[];
  state: number; // ProposalState enum: 0=Pending, 1=Active, 2=Canceled, 3=Defeated, 4=Succeeded, 5=Queued, 6=Expired, 7=Executed
  createdAt: Date;
  updatedAt: Date;
}

export interface IDAO extends Document {
  name: string;
  description: string;
  creator: string; // Ethereum address
  governorAddress: string; // Ethereum address
  tokenAddress: string; // Ethereum address
  treasury: string; // Ethereum address
  proposals: IProposal[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Proposal subdocument schema
const ProposalSchema = new Schema<IProposal>(
  {
    proposalId: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    descriptionHash: {
      type: String,
      required: true,
      validate: {
        validator: function(v: string) {
          return /^0x[a-fA-F0-9]{64}$/.test(v);
        },
        message: 'Description hash must be a valid 32-byte hex string',
      },
    },
    actionType: {
      type: String,
      trim: true,
    },
    targets: {
      type: [String],
      required: true,
      validate: {
        validator: function(v: string[]) {
          return v.every(addr => /^0x[a-fA-F0-9]{40}$/.test(addr));
        },
        message: 'All targets must be valid Ethereum addresses',
      },
    },
    values: {
      type: [String],
      required: true,
    },
    calldatas: {
      type: [String],
      required: true,
    },
    state: {
      type: Number,
      required: true,
      min: 0,
      max: 7,
      default: 0, // Pending
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const DAOSchema = new Schema<IDAO>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    creator: {
      type: String,
      required: true,
      validate: {
        validator: function(v: string) {
          return /^0x[a-fA-F0-9]{40}$/.test(v);
        },
        message: 'Creator must be a valid Ethereum address',
      },
    },
    governorAddress: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(v: string) {
          return /^0x[a-fA-F0-9]{40}$/.test(v);
        },
        message: 'Governor address must be a valid Ethereum address',
      },
    },
    tokenAddress: {
      type: String,
      required: true,
      validate: {
        validator: function(v: string) {
          return /^0x[a-fA-F0-9]{40}$/.test(v);
        },
        message: 'Token address must be a valid Ethereum address',
      },
    },
    treasury: {
      type: String,
      required: true,
      validate: {
        validator: function(v: string) {
          return /^0x[a-fA-F0-9]{40}$/.test(v);
        },
        message: 'Treasury address must be a valid Ethereum address',
      },
    },
    proposals: {
      type: [ProposalSchema],
      default: [],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create index on governorAddress for faster lookups
DAOSchema.index({ governorAddress: 1 });
DAOSchema.index({ creator: 1 });

// Prevent model re-compilation during hot reloads in development
const DAO = mongoose.models.DAO || mongoose.model<IDAO>('DAO', DAOSchema);

export default DAO;

