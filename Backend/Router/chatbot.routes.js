const express = require("express");
const router = express.Router();

const {
  chatbotMessage,
} = require("../Controller/chatbot.controller");

router.post("/message", chatbotMessage);

module.exports = router;