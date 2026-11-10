import { ApiCall } from "../Api/ApiCall";

const chatbotServices = {
  async sendMessage(message) {
    const response = await ApiCall.post("/chatbot/message", {
      message,
    });

    return response.data;
  },
};

export default chatbotServices;