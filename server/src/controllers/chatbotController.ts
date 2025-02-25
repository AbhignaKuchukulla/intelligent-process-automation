import { Request, Response } from 'express';

export const processChatbotMessage = (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  res.json({ success: true, response: `Chatbot received: ${message}` });
};
