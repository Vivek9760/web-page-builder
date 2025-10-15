/* ----------------------------- axios config ----------------------------- */
import "./axios.config";

/* ----------------------------- router ----------------------------- */
import Index from "./routes";

/* ----------------------------- toasty ----------------------------- */
import { ToastContainer } from "react-toastify";

/* ----------------------------- store ----------------------------- */
import { StoreProvider } from "./StoreProvider";

/* ----------------------------- components ----------------------------- */
import AuthenticationHandler from "./AuthenticationHandler";

function App() {
  return (
    <StoreProvider>
      <AuthenticationHandler>
        <Index />
        <ToastContainer />
      </AuthenticationHandler>
    </StoreProvider>
  );
}

export default App;
