const { GoogleGenerativeAI } = require("@google-analytics/generative-ai");

exports.handler = async (event) => {
    try {
        const { searchTerm } = JSON.parse(event.body);
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Logic: Turn the search into keywords that match your 'serviceProductType'
        const prompt = `You are a search assistant for Kharoline Socials. 
        The user searched for: "${searchTerm}". 
        Give me 2 single-word keywords that describe this business type. 
        Output only the words separated by a comma.`;

        const result = await model.generateContent(prompt);
        const aiWords = result.response.text().split(',').map(w => w.trim());

        return {
            statusCode: 200,
            body: JSON.stringify({ keywords: aiWords }),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
