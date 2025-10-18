/* ----------------------------- store ----------------------------- */
import { useStore } from "../../../StoreProvider";

/* ----------------------------- axios ----------------------------- */
import axios from "axios";

/* ----------------------------- libraries ----------------------------- */
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

/* ----------------------------- utils ----------------------------- */
import toasty from "../../../utils/toasty.util";

/* ----------------------------- services ----------------------------- */
import { connectSocket } from "../../../services/socket.service";

/* ----------------------------- constants ----------------------------- */
import { EMAIL_PATTERN } from "../../../constants/validation.constant";

export default function LoginPage() {
  const { updateStore } = useStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const { data } = await axios("/api/authentication/login", {
        method: "POST",
        data: formData,
      });
      connectSocket({ path: '/' });
      updateStore({ user: data.user, isAuthenticate: true });
      navigate("/");
    } catch (error) {
      if (error?.response?.data.status === "INVALID_EMAIL") {
        setError("email", {
          type: "manual",
          message: "Not quite right. Unless your goal was to see this error. Then congrats! 🎉",
        });
      } else if (error?.response?.data.status === "INVALID_PASSWORD") {
        setError("password", {
          type: "manual",
          message: "Not quite right. Unless your goal was to see this error. Then congrats! 🎉",
        });
      }
      if (error?.response?.data?.message) toasty.warning(error?.response?.data?.message);
      console.error(error);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark">
      <div className="card shadow-lg p-4 p-md-5" style={{ maxWidth: "420px" }}>
        <div className="card-body">
          <h2 className="card-title text-center text-success mb-4">Welcome Back</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="text"
                autoComplete="off"
                {...register("email", {
                  required: "Email is required",
                  pattern: EMAIL_PATTERN,
                })}
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
              />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
              />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isSubmitting} className="btn btn-success w-100 fw-semibold">
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-3 text-center small">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-success">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}