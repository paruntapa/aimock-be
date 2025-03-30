import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFeedback extends Document {
  interviewId: mongoose.Types.ObjectId;
  reviewScore: number;
  improvementSuggestions: string[];
  alternativeSolution?: string;
  createdAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    interviewId: { type: Schema.Types.ObjectId, ref: 'Interview', required: true },
    reviewScore: { type: Number, required: true, min: 1, max: 10 },
    improvementSuggestions: { type: [String], required: true },
    alternativeSolution: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only store creation time
  }
);

const Feedback: Model<IFeedback> = mongoose.model<IFeedback>('Feedback', feedbackSchema);

export default Feedback;
