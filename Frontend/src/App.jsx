
import { useLocation } from "react-router-dom";
import { Navbar } from "./Components/Navbar";
import { AllRoutes } from "./Routes/AllRoutes";

export const App = () => {
  const location = useLocation();

  const isOverviewPage = location.pathname === "/overview";

  return (
    <>
      {!isOverviewPage && <Navbar />}
      <AllRoutes />
    </>
  );
};
