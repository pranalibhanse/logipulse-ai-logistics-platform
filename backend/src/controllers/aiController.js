const aiAssistantService = require(
  "../services/aiAssistantService"
);

async function askAssistant(req, res) {
  try {
    const { question } = req.body;

    if (
      typeof question !== "string" ||
      !question.trim()
    ) {
      return res.status(400).json({
        error: "A non-empty question is required.",
      });
    }

    if (question.length > 500) {
      return res.status(400).json({
        error: "Question must be 500 characters or fewer.",
      });
    }

    const result =
      await aiAssistantService.answerQuestion(question);

    res.json(result);
  } catch (error) {
    console.error("AI assistant error:", error.message);

    res.status(500).json({
      error: "Unable to answer your question right now.",
    });
  }
}

module.exports = { askAssistant };