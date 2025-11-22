export async function sendMessageToBot(message) {
  try {
    const response = await fetch(
      "https://backend-vercel-six-kappa.vercel.app/api/chatbot", 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      }
    );

    const data = await response.json();

    return data.reply || "No obtuve respuesta del servidor.";

  } catch (error) {
    console.log("Error al conectar con el chatbot:", error);
    return "Hubo un error al comunicar con el servidor.";
  }
}
