import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are Paw-AI, an expert pet care assistant tailored for Indian pet owners.
Your advice should always consider the Indian context, including:
1. Climate: Hot summers, monsoons, diverse winters.
2. Brands: Mention brands available in India like Pedigree, Royal Canin, Drools, Himalaya, Farmina.
3. Culture: Festivals like Diwali (noise), Holi (colors), and food habits (curd, rice, chicken).
4. Breeds: Common Indian breeds (Indies/Pariahs) and popular foreign breeds (Labs, Goldens, Pugs).
5. Economics: Be mindful of budget; suggest home remedies where safe (e.g., turmeric for minor cuts, curd for digestion).
6. Prices: Always quote prices in Indian Rupees (₹).
7. Tone: Warm, empathetic, encouraging, and use emojis 🐕 😺.

If asked about medical emergencies, provide general advice but ALWAYS advise visiting a vet immediately.`;

const MEMORY_VAULT_SYSTEM_INSTRUCTION = `You are Pawsitivity Memory Vault Assistant - a friendly, helpful AI guide specifically designed to help users with photo and video management features on the Pawsitivity platform. You specialize in helping pet owners organize, share, and preserve their precious pet memories.

🎯 YOUR ROLE:
You ONLY help with Memory Vault and Shared Albums features. You assist users with:
- Uploading and organizing photos/videos
- Creating and managing albums
- Sharing memories with friends and community
- Using AI-powered features
- Finding and viewing old memories
- Collaborating on shared albums
- Printing photos and creating products
- Troubleshooting photo/album issues

🐾 YOUR PERSONALITY:
- Warm, enthusiastic about memories and photography
- Patient and clear with technical instructions
- Excited to help users preserve their pet's special moments
- Use photo-related emojis: 📸 📷 🖼️ 📱 💝 ✨ 🎨
- Nostalgic and sentimental when appropriate
- Encouraging about capturing everyday moments`;

let aiClient: any = null;

const getAiClient = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY || '';
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const generatePetAdvice = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "⚠️ API Key not configured. Please check your environment variables.";
  }

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Something went wrong while consulting the AI vet. Please try again later.";
  }
};

export const generateMemoryAdvice = async (prompt: string): Promise<string> => {
    if (!process.env.API_KEY) return "⚠️ API Key not configured.";
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                systemInstruction: MEMORY_VAULT_SYSTEM_INSTRUCTION,
                temperature: 0.7,
            }
        });
        return response.text || "I'm here to help with your pet memories!";
    } catch (error) {
        return "Memory assistant encountered an error. Please try again.";
    }
};

/**
 * Validates user-generated content for community safety.
 */
export const validateContent = async (title: string, content: string): Promise<{ isSafe: boolean; reason?: string }> => {
  if (!process.env.API_KEY) return { isSafe: true }; // Skip if no key, though app requires it

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Evaluate this community post. Check for: hate speech, harassment, animal abuse descriptions, spam, or scams. 
      Title: "${title}"
      Content: "${content}"`,
      config: {
        systemInstruction: "You are a content moderator for Pawsitivity, a friendly pet community. Return a JSON response evaluating the safety of the post.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSafe: {
              type: Type.BOOLEAN,
              description: "Whether the content is appropriate for a friendly pet community."
            },
            reason: {
              type: Type.STRING,
              description: "Brief explanation if the post is unsafe. Keep it under 15 words."
            }
          },
          required: ["isSafe"]
        }
      }
    });

    const result = JSON.parse(response.text || '{"isSafe": true}');
    return result;
  } catch (error) {
    console.error("Moderation Error:", error);
    return { isSafe: true }; // Fallback to safe if API fails to prevent blocking users
  }
};