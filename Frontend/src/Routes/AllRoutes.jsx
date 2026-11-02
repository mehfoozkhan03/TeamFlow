import { Route, Routes } from "react-router-dom";
import { Layout } from "../Components/Layout";
<<<<<<< HEAD
import { PrivateRoute } from "../Components/Routes/PrivateRoute";
=======
import { PrivateRoute } from "../Components/PrivateRoute";
import { PublicRoute } from "../Components/PublicRoute";
>>>>>>> be13fa5a83feb27c88be43725d76d999c683a214

import { Home } from "../Pages/Home";
import { About } from "../Pages/About";
import { Contact } from "../Pages/Contact";
import { Login } from "../Pages/Login";
import { Signup } from "../Pages/Signup";
import { ErrorPage } from "../Pages/ErrorPage";
<<<<<<< HEAD

import OverviewDash from "../Components/Admin/OverviewDash";
=======
>>>>>>> be13fa5a83feb27c88be43725d76d999c683a214

export const AllRoutes = () => {
  return (
    <Routes>
      {/* Public routes: only for unauthenticated users */}
      <Route element={<PublicRoute />}>
        <Route element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Route>

<<<<<<< HEAD
      {/* Protect the dashboard route */}
      <Route element={<PrivateRoute />}>
        <Route path="/overview" element={<OverviewDash />} />
      </Route>

=======
      {/* Private routes: only for authenticated users */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Route>

      {/* all admin route's */}

      {/* Unknown routes */}
>>>>>>> be13fa5a83feb27c88be43725d76d999c683a214
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};
