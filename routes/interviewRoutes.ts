import express from 'express';
import { authMiddleware } from '../middleware/middleware';
import { getInterview, getInterviewFeedback, startInterview, submitAnswer } from '../controllers/interviewController';

const router = express.Router();

router.post('/start', authMiddleware, startInterview);
router.get('/:id', authMiddleware, getInterview);
router.post('/:id/submit', authMiddleware, submitAnswer);
router.get('/:id/feedback', authMiddleware, getInterviewFeedback);


export default router;
