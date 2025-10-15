/* ----------------------------- libraries ----------------------------- */
import { Navigate } from "react-router-dom";

/* ----------------------------- components ----------------------------- */
import Users from "../components/protected/admin/Users";


const adminRoutes = [
  { path: "/", element: <Users /> },
  { path: "/*", element: <Navigate to={"/"} /> },
];

export default adminRoutes;
