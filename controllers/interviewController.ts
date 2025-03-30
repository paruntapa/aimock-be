import type { Request, Response } from 'express';
import Interview from '../models/Interview';
import { generateCodingQuestion } from '../utils/aiService';
import Feedback from '../models/Feedback';
import { generateFeedback } from '../utils/geminiService';

export const startInterview = async (req: Request, res: Response): Promise<any> => {
  try {
    const { jobTitle, jobDescription, experienceRequired } = req.body;
    const userId = req.user.id; // Extracted from authentication middleware

    if (!jobTitle || !jobDescription || !experienceRequired) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get question from AI
    const questions = await generateCodingQuestion(jobTitle, jobDescription, experienceRequired);

    // Save interview to DB
    const interview = await Interview.create({
      userId,
      jobTitle,
      jobDescription,
      experienceRequired,
      question: questions,
    });

    return res.status(201).json({ interviewId: interview._id });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getInterview = async (req: Request, res: Response): Promise<any>  => {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.status(200).json(interview);
  } catch (error) {
    console.error('Error fetching interview:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const submitAnswer = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { userCode, language } = req.body;

  try {
    // Find interview
    const interview = await Interview.findById(id);
    if (!interview) return res.status(404).json({ message: 'Interview not found' });

    // Save user code
    interview.userCode = userCode;
    await interview.save();

    // Get AI feedback
    const feedbackData = await generateFeedback(userCode, language);

    // Save feedback
    const feedback = new Feedback({ interviewId: id, ...feedbackData });
    await feedback.save();

    res.status(200).json({ message: 'Code submitted and feedback generated' });
  } catch (error) {
    console.error('Error submitting code:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getInterviewFeedback = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const feedback = await Feedback.findOne({ interviewId: id });
    if (!feedback) return res.status(404).json({ message: 'No feedback found' });

    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
};