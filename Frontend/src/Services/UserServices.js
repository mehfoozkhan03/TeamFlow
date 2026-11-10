import { ApiCall } from "../Api/ApiCall";

const userAuthServices = {
  // Signup
    async signup(data) {
      const response = await ApiCall.post("/users/signup", data);
      return response.data;
    },

  // Login
  async login(data) {
    const response = await ApiCall.post("/users/login", data);
    console.log("🚀 ~ response:userAuthServices", response);

    return response.data;
  },

  // Get logged-in user
  async allUsers() {
    const response = await ApiCall.get("/users/me");
    return response.data;
  },
};

export { userAuthServices };

export const calc = (value) => {
  const ans = value * value;
};
