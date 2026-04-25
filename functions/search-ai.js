const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { query, siteContent } = JSON.parse(event.body);
    
    // Use the GEMINI_KEY you added to Netlify environment variables
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a helpful search assistant for a social media marketing portfolio. 
      User Query: "${query}"
      Available Site Content: ${JSON.stringify(siteContent)}
      
      Based ONLY on the available content, provide a concise answer. 
      If the information isn't there, politely say you couldn't find it.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer: text }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process search" }),
    };
  }
};
