import axios from "axios";

export const ApiCall = axios.create({
  baseURL: import.meta.env.API,
});

/* 
all data http://localhost:7000

login http://localhost:7000/user/login

signup http://localhost:7000/user/signup

*/
