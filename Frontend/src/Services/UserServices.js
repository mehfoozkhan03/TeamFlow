import { ApiCall } from "../Api/ApiCall";

const userAuthServices = {
  // Signup
  async signup(data) {
    const response = await ApiCall.post("/user/signup", data);
    return response.data;
  },

  // Login
  async login(data) {
    const response = await ApiCall.post("/user/login", data);
    return response.data;
  },

  // Get logged-in user
  async allUsers() {
    const response = await ApiCall.get("/user/me");
    return response.data;
  },
};

export { userAuthServices };