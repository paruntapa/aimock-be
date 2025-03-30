import dotenv from 'dotenv';
dotenv.config( { path: '../.env' } );

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateCodingQuestion(
  title: string,
  yearsOfExperience: number,
  description: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    You are an AI that generates coding questions for technical interviews. 
    Your task is to create **ONE** coding problem that requires writing a function.
    
    - The problem should be **practical and real-world relevant**.
    - It should **align** with the job role "${title}".
    - It should be **algin** with the job description "${description}".
    - The difficulty level should match **${yearsOfExperience} years of experience**.
    - **Do NOT return JSON or boilerplate code.** Only return the question in simple English.

    Example Format:
    - "Write a function that takes an array of numbers and returns the second largest number."
    - "Implement a function that checks whether a given string is a palindrome."
    - "Write a function that converts a given number into Roman numerals."
    
    Now, generate a coding problem for the role "${title}" with ${yearsOfExperience} years of experience:
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim(); // Return the question as a string
  } catch (error) {
    console.error("Error generating coding question:", error);
    return "Error: Unable to generate a coding question at the moment.";
  }
}