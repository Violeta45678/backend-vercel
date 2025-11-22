import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensaje no recibido" });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres un chatbot útil." },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Error en chatbot:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
      details: error.message,
    });
  }
}
