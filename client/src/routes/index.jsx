/* ----------------------------- react ----------------------------- */
import { Suspense, useRef } from "react";

/* ----------------------------- store ----------------------------- */
import { useStore } from "../StoreProvider";

/* ----------------------------- routes ----------------------------- */
import adminRoutes from "./adminRoutes";
import unProtectedRoutes from "./unprotectedRoutes";
import userRoutes from "./userRoutes";

/* ----------------------------- libraries ----------------------------- */
import { createBrowserRouter, RouterProvider } from "react-router-dom";

/* ----------------------------- components ----------------------------- */
import Layout from "../Layout";
import Loader from "../components/common-ui/Loader";
import ErrorBoundary from "../error-boundary/ErrorBoundary";

function Index() {
  const { store } = useStore();
  const routes = useRef();
  const mapRoutes = {
    CLIENT: userRoutes,
    ADMIN: adminRoutes,
  };
  routes.current = store?.user?.role ? mapRoutes[store?.user?.role] : unProtectedRoutes;

  const router = createBrowserRouter(
    [
      {
        element: <Layout />,
        errorElement: <ErrorBoundary />,
        children: routes.current,
      },
    ],
    { basename: "/" }
  );

  return (
    <Suspense fallback={<Loader isLoading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default Index;
