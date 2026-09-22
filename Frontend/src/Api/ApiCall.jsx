import axios from "axios";

export const ApiCall = axios.create({
  baseURL: "http://localhost:7000",
});

/* 
all data http://localhost:7000

login http://localhost:7000/user/login

signup http://localhost:7000/user/signup


*/
