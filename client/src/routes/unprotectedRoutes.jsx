/* ----------------------------- components ----------------------------- */
import Login from "../components/unprotected/login/Login.jsx";
import Signup from "../components/unprotected/signup/Signup.jsx";
import Home from "../components/unprotected/home/Home.jsx";
import PrivacyPolicy from "../components/unprotected/privacy-policy/PrivacyPolicy.jsx";
import TermCondition from "../components/unprotected/term-condition/TermCondition.jsx";

/* ----------------------------- libraries ----------------------------- */
import { Navigate } from "react-router-dom";


const unProtectedRoutes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/privacy", element: <PrivacyPolicy /> },
  { path: "/terms", element: <TermCondition /> },
  { path: "/*", element: <Navigate to={"/"} /> },
];

export default unProtectedRoutes;
