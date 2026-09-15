import { Route, Routes } from "react-router-dom";

import { Home } from "../Pages/Home";
import { About } from "../Pages/About";
import { Login } from "../Pages/Login";
import { Signup } from "../Pages/Signup";

export const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/about" element={<About />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
    </Routes>
  );
};
