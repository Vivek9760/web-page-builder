/* ----------------------------- libraries ----------------------------- */
import { Navigate } from "react-router-dom";

/* ----------------------------- components ----------------------------- */
import Users from "../components/protected/admin/Users";
import PublishPage from "../components/common-ui/PublishPage";


const adminRoutes = [
  { path: "/", element: <Users /> },
  { path: "/published/web-page/:slug", element: <PublishPage /> },
  { path: "/*", element: <Navigate to={"/"} /> },
];

export default adminRoutes;
