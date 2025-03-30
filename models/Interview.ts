import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IInterview extends Document {
  userId: mongoose.Types.ObjectId;
  jobTitle: string;
  jobDescription: string;
  experienceRequired: number;
  question: string;
  selectedLanguage: string;
  userCode?: string;
  submittedAt?: Date;
  feedbackId?: mongoose.Types.ObjectId;
}

const interviewSchema = new Schema<IInterview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    experienceRequired: { type: Number, required: true },
    question: { type: String, required: true },
    selectedLanguage: { type: String },
    userCode: { type: String },
    submittedAt: { type: Date },
    feedbackId: { type: Schema.Types.ObjectId, ref: 'Feedback' }, // Reference to feedback
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

const Interview: Model<IInterview> = mongoose.model<IInterview>('Interview', interviewSchema);

export default Interview;
