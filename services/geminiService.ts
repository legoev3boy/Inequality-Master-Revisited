
import { GoogleGenAI, Type } from "@google/genai";
import { MathProblem, EvaluationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMathProblem = async (level: number): Promise<MathProblem> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a 7th or 8th grade math word problem involving a linear inequality. 
    Complexity level: ${level} out of 100. 
    Map the level to difficulty: 1-30 is Easy, 31-70 is Medium, 71-100 is Hard.
    
    CRITICAL REQUIREMENT FOR LEVEL 100:
    If the level is 100, the resulting inequality MUST be a complex 5-step problem with:
    1. Distribution (brackets).
    2. Negative numbers.
    3. Multi-step operations.

    FOR ALL LEVELS:
    - DO NOT include the mathematical inequality string in the "context".
    - Provide a "keyFacts" array which lists the important numerical values and their meaning from the text (e.g. ["$20 total budget", "$5 flat fee"]).
    - Provide a specific variable name and what it represents.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          context: { type: Type.STRING },
          variableName: { type: Type.STRING },
          variableDescription: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
          level: { type: Type.NUMBER },
          keyFacts: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["id", "context", "variableName", "variableDescription", "difficulty", "level", "keyFacts"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Invalid problem data received from AI");
  }
};

export const generateVisualProblem = async (level: number, base64Image: string): Promise<MathProblem> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
        {
          text: `Look at this image. Identify objects, quantities, or scenes. 
          Generate a 7th grade math word problem involving a linear inequality based on what you see.
          Complexity level: ${level}/100. 
          If you see "nothing" or an empty space, create a problem about emptiness, capacity, or starting from zero.
          
          REQUIREMENTS:
          - DO NOT include the inequality in the context.
          - Identify key facts from the visual.
          - If level is 100, make it a 5-step problem with brackets and negatives.
          - Return JSON format.`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          context: { type: Type.STRING },
          variableName: { type: Type.STRING },
          variableDescription: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
          level: { type: Type.NUMBER },
          keyFacts: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["id", "context", "variableName", "variableDescription", "difficulty", "level", "keyFacts"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse visual Gemini response", e);
    throw new Error("Invalid visual problem data received");
  }
};

export const evaluateSubmission = async (
  problem: MathProblem,
  process: string,
  inequality: string,
  solution: string
): Promise<EvaluationResult> => {
  const prompt = `
    Problem Context: ${problem.context}
    Variable: ${problem.variableName} (${problem.variableDescription})
    
    Student reasoning (Plan): ${process}
    Student model (Inequality): ${inequality}
    Student result (Solution): ${solution}
    
    Evaluate the student's work. Be encouraging and helpful.
    CRITICAL: DO NOT provide the final correct inequality or solution in the "feedback" or "tips".
    Instead, give conceptual hints to help them fix their own work.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isCorrect: { type: Type.BOOLEAN },
          feedback: { type: Type.STRING },
          correctInequality: { type: Type.STRING },
          tips: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["isCorrect", "feedback", "correctInequality", "tips"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse evaluation", e);
    throw new Error("Invalid evaluation received from AI");
  }
};
