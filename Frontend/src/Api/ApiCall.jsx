import axios from "axios";

export const ApiCall = axios.create({
  baseURL: import.meta.env.VITE_API,
  withCredentials: true,
});
/* 
all data http://localhost:7000/api

login http://localhost:7000/api/user/login

signup http://localhost:7000/api/user/signup

all_user http://localhost:7000/api/all
*/
