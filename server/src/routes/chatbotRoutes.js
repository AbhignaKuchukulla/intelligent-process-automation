import express from 'express';
import { processChatbotMessage } from '../controllers/chatbotController.ts';

const router = express.Router();

router.post('/message', processChatbotMessage);

export default router;
