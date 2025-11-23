import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    // Asegurar POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    // 🔥 VERCEL NO PARSEA req.body — hay que hacerlo manualmente
    let body = {};
    try {
      body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    } catch (e) {
      return res.status(400).json({ error: "Body JSON inválido" });
    }

    const { message, history = [] } = body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Mensaje vacío" });
    }

    // Inicializar cliente OpenAI
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Prompt médico
    const prompt = `
Eres un asistente médico virtual. Tu tarea es:

1. Analizar síntomas del usuario.
2. Determinar si necesita un especialista.
3. Determinar urgencia (normal, alta, emergencia).
4. Extraer una especialidad médica según CONADEM.
5. Generar palabras clave para filtrar doctores.
6. Responder de forma natural, amable y clara.
7. Indicar qué paso sigue para el frontend.

Responde SIEMPRE en JSON válido:

{
  "reply": "...",
  "step": "initial | ask_more_info | show_doctors | change_specialty",
  "specialty": {
    "key": "cardiologia",
    "name": "Cardiología",
    "conademLabel": "Cardiólogo",
    "keywords": ["corazon","cardiologo","pecho"]
  },
  "needsMoreInfo": true | false,
  "urgency": "normal | alta | emergencia"
}

HISTORIAL:
${JSON.stringify(history)}

MENSAJE ACTUAL:
"${message}"
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    let content = completion.choices[0].message.content.trim();

    // Eliminar ```json
    if (content.startsWith("```")) {
      content = content.replace(/```(json)?/g, "").trim();
    }

    const ai = JSON.parse(content);

    return res.status(200).json(ai);

  } catch (error) {
    console.log("ERROR API CHATBOT:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
      reply: "Lo siento, hubo un error procesando tu mensaje.",
      step: "initial"
    });
  }
}
