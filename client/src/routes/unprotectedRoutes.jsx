/* ----------------------------- components ----------------------------- */
import Login from "../components/unprotected/login/Login.jsx";
import Signup from "../components/unprotected/signup/Signup.jsx";
import Home from "../components/unprotected/home/Home.jsx";
import PublishPage from "../components/common-ui/PublishPage.jsx";
import PrivacyPolicy from "../components/unprotected/privacy-policy/PrivacyPolicy.jsx";
import TermCondition from "../components/unprotected/term-condition/TermCondition.jsx";
import PublishedWebPages from "../components/unprotected/published-web-pages/PublishedWebPages.jsx";

/* ----------------------------- libraries ----------------------------- */
import { Navigate } from "react-router-dom";


const unProtectedRoutes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/privacy", element: <PrivacyPolicy /> },
  { path: "/terms", element: <TermCondition /> },
  { path: "/web-pages", element: <PublishedWebPages /> },
  { path: "/published/web-page/:slug", element: <PublishPage /> },
  { path: "/*", element: <Navigate to={"/"} /> },
];

export default unProtectedRoutes;
