import { ApiCall } from "../Api/ApiCall";

const userAuthServices = {
  // signup
  signup(data) {
    return ApiCall.post("/user/signup", data);
  },
  // login
  login(data) {
    return ApiCall.post("/user/login", data);
  },
  // allusers
  allUsers() {
    return ApiCall.get("/user/me");
  },
};

export { userAuthServices };
