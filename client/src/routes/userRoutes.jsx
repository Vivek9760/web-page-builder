/* ----------------------------- components ----------------------------- */
import Home from "../components/protected/client/home/Home.jsx";
import Builder from "../components/protected/client/builder/Builder.jsx";
import WebPagePreview from "../components/protected/client/web-page/WebPagePreview.jsx";

/* ----------------------------- libraries ----------------------------- */
import { Navigate } from "react-router-dom";


const userRoutes = [
  { path: "/", element: <Home /> },
  { path: "/builder/:slug?", element: <Builder /> },
  { path: "/preview/:slug", element: <WebPagePreview /> },
  { path: "/*", element: <Navigate to={"/"} /> },
];

export default userRoutes;
