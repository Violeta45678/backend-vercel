import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres un asistente amable y útil." },
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ reply });

  } catch (error) {
    console.error("Error en API:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
