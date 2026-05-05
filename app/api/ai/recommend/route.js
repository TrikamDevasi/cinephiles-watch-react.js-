import OpenAI from 'openai';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const { mood } = await request.json();
    const prompt = `Recommend 5 movies perfect for someone feeling "${mood}". Return ONLY a JSON array of objects with "title" and "overview" keys. No markdown, no explanations, no other text.
    Example:
    [{"title": "The Matrix", "overview": "A computer hacker learns about the true nature of his reality."}]`;

    // Try providers in order: Groq -> Gemini -> OpenAI
    
    // 1. TRY GROQ
    try {
      console.log("AI: Attempting Groq...");
      const groq = new OpenAI({
        apiKey: process.env.GROQ_API_KEY?.trim(),
        baseURL: 'https://api.groq.com/openai/v1',
      });
      const completion = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });
      const data = JSON.parse(completion.choices[0].message.content.trim());
      return Response.json({ recommendations: data });
    } catch (err) {
      console.warn("Groq failed, trying Gemini...", err.message);
    }

    // 2. TRY GEMINI
    try {
      console.log("AI: Attempting Gemini...");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY?.trim());
      const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleanJson = text.replace(/```json|```/gi, '').trim();
      const data = JSON.parse(cleanJson);
      return Response.json({ recommendations: data });
    } catch (err) {
      console.warn("Gemini failed, trying OpenAI...", err.message);
    }

    // 3. TRY OPENAI
    try {
      console.log("AI: Attempting OpenAI...");
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY?.trim(),
      });
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });
      const data = JSON.parse(completion.choices[0].message.content.trim());
      return Response.json({ recommendations: data });
    } catch (err) {
      console.error("All AI providers failed.");
      throw err;
    }

  } catch (error) {
    console.error("AI Recommendation Critical Error:", error);
    return Response.json({ 
      recommendations: [],
      error: "AI service failed to generate recommendations."
    }, { status: 500 });
  }
}
