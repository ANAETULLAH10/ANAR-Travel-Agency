import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Ensure User-Agent header is set as required by skill guidelines
export const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not defined in environment');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const SYSTEM_INSTRUCTION_TRAVEL_PLANNER = `
You are the elite AI Travel Advisor for "ANAR Travel Agency" (Bangladesh's leading travel agency).
Your mission is to inspire exploration and provide knowledgeable, authentic, and accurate travel advice for both Bangladesh's local destinations (Cox's Bazar, Sajek Valley, Sundarbans, Sreemangal, Saint Martin, Tanguar Haor, Bandarban, Kuakata, Rangamati, etc.) and top international getaways (Maldives, Bali, Dubai, Santorini).
Key guidelines:
1. Always quote prices in Bangladeshi Taka (BDT ৳) and provide approximate USD ($) equivalent (approx 1 USD = 108 BDT).
2. Recommend practical transport options in Bangladesh (e.g. Scania AC bus like Green Line/Desh Travels, domestic flights via US-Bangla/Novoair, Sonar Bangla/Cox's Bazar Express train, traditional luxury Bajra houseboats for Tanguar Haor, 4x4 Chander Gari for hills).
3. Mention iconic local food specialties (e.g., Mejbani Beef in Chittagong, Koral/Rupchanda fry in Cox's Bazar, Bamboo Chicken in Sajek, Chui Jhal in Khulna, Shatkora Beef in Sylhet, Fresh Hilsa in Kuakata).
4. Emphasize that travelers can book verified local guides directly through ANAR Travel Agency and pay securely using bKash, Nagad, or Credit Cards.
5. Keep your tone enthusiastic, welcoming, professional, and culturally respectful.
`;

export async function handleTravelChat(userInput: string, history: Array<{ role: string; content: string }> = []) {
  const ai = getGeminiClient();
  
  // Use gemini-3.8-flash for general fast reasoning & text chat
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: userInput,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_TRAVEL_PLANNER,
      temperature: 0.7,
    },
  });

  return {
    text: response.text || 'Welcome to ANAR Travel Agency! How can I assist your journey today?',
  };
}

export async function handleVoiceConversation(userVoiceText: string) {
  const ai = getGeminiClient();

  // Call gemini-3.8-live / gemini-3.8-flash for conversational reasoning
  const textResponse = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: `The traveler is talking to you via Voice Live API: "${userVoiceText}". Respond concisely and warmly in 2-3 engaging sentences, giving specific advice about their trip, weather, budget in BDT, or highlights.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_TRAVEL_PLANNER,
      temperature: 0.7,
    },
  });

  const replyText = textResponse.text || "I'd love to help you plan your dream trip with ANAR Travel!";

  // Generate real-time TTS audio response using gemini-3.8-flash-lite-tts
  let audioBase64: string | null = null;
  try {
    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: replyText,
              speechMetadata: {
                style: 'Warm, friendly, enthusiastic travel concierge',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
      },
    });

    audioBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (ttsErr) {
    console.warn('TTS generation fallback to browser speech synthesis:', ttsErr);
  }

  return {
    text: replyText,
    audioBase64,
  };
}

export async function handleGuideAutoReply(guideName: string, district: string, userMessage: string) {
  const ai = getGeminiClient();
  const guidePrompt = `
You are ${guideName}, an authentic, licensed local travel guide in ${district}, Bangladesh, partnered with ANAR Travel Agency.
A traveler just messaged you in the agency chat: "${userMessage}".
Reply warmly in a friendly, conversational tone (you can mix polite English with authentic Bengali warmth like 'Salam / Nomoshkar', 'Bhai/Apu', or local tips).
Tell them practical local advice, what you can arrange (transport, cottages, permits, food), and reassure them that their trip will be safe and memorable. Keep it under 80 words.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: guidePrompt,
    config: {
      temperature: 0.8,
    },
  });

  return {
    reply: response.text || `Salam! I am ${guideName} from ${district}. I received your message and I'm ready to organize an unforgettable local trip for you. Feel free to ask anything!`,
  };
}
