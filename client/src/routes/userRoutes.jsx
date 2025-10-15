/* ----------------------------- components ----------------------------- */
import Home from "../components/protected/client/home/Home.jsx";
import WebPagePreview from "../components/protected/client/web-page/WebPagePreview.jsx";

/* ----------------------------- libraries ----------------------------- */
import { Navigate } from "react-router-dom";


const userRoutes = [
  { path: "/", element: <Home /> },
  { path: "/preview/:slug", element: <WebPagePreview /> },
  { path: "/*", element: <Navigate to={"/"} /> },
];

export default userRoutes;
