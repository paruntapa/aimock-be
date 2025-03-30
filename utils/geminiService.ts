import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateFeedback(code: string, language: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    You are an AI code reviewer. Analyze the following ${language} code and provide feedback.

    - Assign a review score from **1 to 10**.
    - List at least **two improvement suggestions** in a numbered format (1. ... 2. ...).
    - If possible, suggest a **better optimized solution**.

    Code:
    ${code}
    
    Format your response as follows:
    **Score:** X/10  
    **Suggestions:**  
    1. ...  
    2. ...  
    **Better Solution:**  
    ...
  `;

  try {
    const result = await model.generateContent(prompt);
    const feedback = parseFeedback(result.response.text().trim());
    return feedback;
  } catch (error) {
    console.error("Error generating feedback:", error);
    return {
      reviewScore: 5,
      improvementSuggestions: ["Error: Unable to generate feedback at the moment."],
      alternativeSolution: null,
    };
  }
}

function parseFeedback(response: string) {
  const scoreMatch = response.match(/\*\*Score:\*\*\s*(\d+)/);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 5;

  const suggestionsMatch = response.match(/\*\*Suggestions:\*\*\s*(.*?)(?=\*\*Better Solution|\*\*$)/s);
  const suggestions = suggestionsMatch
    ? suggestionsMatch[1].split(/\d+\.\s+/).slice(1).map(s => s.trim()) // Extracts numbered points
    : [];

  const alternativeMatch = response.match(/\*\*Better Solution:\*\*\s*(.*)/s);
  const alternativeSolution = alternativeMatch ? alternativeMatch[1].trim() : null;

  return {
    reviewScore: score,
    improvementSuggestions: suggestions,
    alternativeSolution,
  };
}