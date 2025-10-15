/* ----------------------------- components ----------------------------- */
import Home from "../components/protected/common/home/Home.jsx";

/* ----------------------------- libraries ----------------------------- */
import { Navigate } from "react-router-dom";


const userRoutes = [
  { path: "/", element: <Home /> },
  { path: "/*", element: <Navigate to={"/"} /> },
];

export default userRoutes;
