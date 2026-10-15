import { ApiCall } from "../Api/ApiCall";

const userAuthServices = {
  signup(data) {
    return ApiCall.post("/user/signup", data);
  },
};

export { userAuthServices };
