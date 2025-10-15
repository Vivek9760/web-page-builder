/* ----------------------------- react ----------------------------- */
import { Suspense } from "react";

/* ----------------------------- store ----------------------------- */
import { useStore } from "./StoreProvider";

/* ----------------------------- libraries ----------------------------- */
import { Outlet } from "react-router-dom";

/* ----------------------------- components ----------------------------- */
import Loader from "./components/common-ui/Loader";
import Header from "./components/protected/Header";

const Layout = () => {
  const { store } = useStore();
  return (
    <>
      <Suspense fallback={<Loader isLoading />}>
        <div className="h-screen flex flex-col">
          {store.isAuthenticate && <Header />}
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </Suspense>
    </>
  );
};

export default Layout;
