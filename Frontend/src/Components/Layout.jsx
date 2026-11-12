import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { Navbar } from "./Navbar";
import { Chatbot } from "./Chat/Chatbot";

export const Layout = () => {
  const { isAuth } = useSelector((store) => store.user);

  return (
    <>
      <Navbar />

      <Outlet />

      {isAuth && <Chatbot />}
    </>
  );
};
