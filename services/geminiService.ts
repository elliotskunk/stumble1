import { GoogleGenAI, Type } from "@google/genai";
import { ChallengeData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const challengeSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A short, catchy title for the challenge (max 5 words).",
    },
    description: {
      type: Type.STRING,
      description: "The specific instruction for the user to perform. Must be safe and actionable immediately.",
    },
    locationIdentified: {
      type: Type.STRING,
      description: "What environment the AI detected (e.g., 'Gym', 'Coffee Shop', 'Park').",
    },
    timeLimitSeconds: {
      type: Type.INTEGER,
      description: "Time in seconds to complete the challenge. Usually between 60 and 300.",
    },
  },
  required: ["title", "description", "locationIdentified", "timeLimitSeconds"],
};

export const generateChallengeFromEnvironment = async (
  imageBase64: string,
  userGoal: string = "Physical resilience"
): Promise<ChallengeData> => {
  try {
    // Strip the data:image/jpeg;base64, prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `
      Analyze this image which represents the user's current environment.
      The user's goal is: "${userGoal}".
      
      Create a spontaneous "micro-challenge" for them to do RIGHT NOW in this environment.
      The mission is to build resilience, focus, and discipline.
      
      IMPORTANT: The challenge must be strictly SOLITARY. Do NOT include social interactions.

      Select one of the following TWO categories ONLY:

      1. Physical Resilience (Body):
         - "Do pushups until failure."
         - "Hold a wall-sit for 2 minutes."
         - "Do 20 air squats immediately."
         - "Hold a plank as long as possible."
         - "Stand on one leg with eyes closed for 60 seconds."

      2. Artistic Expression (Creativity):
         - "Write a 4-line poem about the nearest red object."
         - "Sketch the view in front of you in 60 seconds."
         - "Make a small sculpture using only items on your desk/table."
         - "Invent a fictional backstory for an object near you."
         - "Find a pattern in the room and draw it."

      Ensure the challenge is safe, simple, and achievable within 5 minutes.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: challengeSchema,
        temperature: 1.2, // Higher temperature for more creative/random challenges
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text) as ChallengeData;
    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if AI fails
    return {
      title: "Quick Reset",
      description: "Do 10 deep breaths or 10 jumping jacks right now.",
      locationIdentified: "Unknown",
      timeLimitSeconds: 60,
    };
  }
};