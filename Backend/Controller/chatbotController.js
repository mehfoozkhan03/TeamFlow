
const websiteInfo = require("../Data/websiteInfo");

const chatbotMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate message
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message.",
      });
    }

    // Normalize user message
    const userMessage = message.toLowerCase().trim();

    // Find matching keywords
    let matchedAnswer = null;
    let highestScore = 0;

    websiteInfo.forEach((item) => {
      const score = item.keywords.reduce((total, keyword) => {
        const normalizedKeyword = keyword.toLowerCase();

        return userMessage.includes(normalizedKeyword)
          ? total + normalizedKeyword.length
          : total;
      }, 0);

      if (score > highestScore) {
        highestScore = score;
        matchedAnswer = item.answer;
      }
    });

    // Default response
    const answer =
      matchedAnswer ||
      "Sorry, I don't have information about that. Please ask me something about TeamFlow.";

    return res.status(200).json({
      success: true,
      answer,
    });

  } catch (error) {
    console.error("Chatbot Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

module.exports = { chatbotMessage };
