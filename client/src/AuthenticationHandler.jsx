/* ----------------------------- libraries ----------------------------- */
import axios from "axios";

/* ----------------------------- react ----------------------------- */
import { useEffect, useState } from "react";

/* ----------------------------- store ----------------------------- */
import { useStore } from "./StoreProvider.jsx";

/* ----------------------------- component ----------------------------- */
import Loader from "./components/common-ui/Loader.jsx";

const AuthenticationHandler = ({ children }) => {
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const { updateStore } = useStore();

  useEffect(() => {
    getUserSession();
  }, []);

  const getUserSession = async () => {
    try {
      const { data } = await axios("/api/authentication/user-session", {
        method: "GET",
      });
      updateStore({ user: data.user, isAuthenticate: true });
    } catch (error) {
      updateStore({ user: null, isAuthenticate: false });
      console.error(error);
    } finally {
      setIsSessionLoading(false);
    }
  };

  return (
    <>
      <Loader isLoading={isSessionLoading}>{children}</Loader>
    </>
  );
};

export default AuthenticationHandler;
