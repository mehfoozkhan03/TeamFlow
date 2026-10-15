import { Route, Routes } from "react-router-dom";
import { Navbar } from "../Components/Navbar";
import { Home } from "../Pages/Home";
import { About } from "../Pages/About";
import { Login } from "../Pages/Login";
import { Signup } from "../Pages/Signup";

export const AllRoutes = () => {
  return (
    <>
      {/* Page content changes based on the URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
};
