/* ----------------------------- libraries ----------------------------- */
import { Navigate } from "react-router-dom";

const adminRoutes = [
  { path: "/", element: <>dashboard</> },
  { path: "/users", element: <>users list</> },
  { path: "/*", element: <Navigate to={"/"} /> },
];

export default adminRoutes;
