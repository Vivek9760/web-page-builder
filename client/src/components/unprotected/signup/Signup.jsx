import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toasty from "../../../utils/toasty.util";
import { EMAIL_PATTERN, OTP_PATTERN, PASSWORD_PATTERN } from "../../../constants/validation.constant";

export default function Signup() {
  const OTP_TIMER = 59;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm();
  const interval = useRef(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      interval.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval.current);
    }
  }, [token]);

  const onSubmit = async (formData) => {
    try {
      if (token) {
        const { data } = await axios.post("/api/authentication/verify-email", {
          ...formData,
          token,
          email,
        });
        navigate("/login");
        toasty.success(data.message);
      } else {
        const { data } = await axios.post("/api/authentication/signup", formData);
        setToken(data.token);
        setEmail(data.email);
        setTimer(OTP_TIMER);
        reset();
        toasty.success(data.message);
      }
    } catch (error) {
      console.error(error);
      if (error?.response?.data?.field) {
        setError(error.response.data.field, {
          type: "manual",
          message: error.response.data.message,
        });
      } else if (error?.response?.data?.message) {
        toasty.error(error.response.data.message);
      }
    }
  };

  const resendOtp = async () => {
    try {
      const { data } = await axios.post("/api/authentication/send-otp/verify-email", { email });
      reset();
      setToken(data.token);
      toasty.success(data.message);
      setTimer(OTP_TIMER);
    } catch (error) {
      console.error(error);
      if (error?.response?.data?.message) {
        toasty.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4 p-md-5" style={{ maxWidth: "420px" }}>
        <div className="card-body">
          <h2 className="card-title text-center text-success mb-4">{!token ? "Sign Up" : "Verify Email"}</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {!token ? (
              <>
                {/* Full Name */}
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
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
                    {...register("password", {
                      required: "Password is required",
                      pattern: PASSWORD_PATTERN,
                    })}
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-success w-100">
                  Create Account
                </button>
              </>
            ) : (
              <>
                {/* OTP Verification */}
                <div className="mb-3">
                  <label className="form-label">Enter OTP</label>
                  <input
                    type="text"
                    {...register("otp", {
                      required: "OTP is required",
                      pattern: OTP_PATTERN,
                    })}
                    className={`form-control ${errors.otp ? "is-invalid" : ""}`}
                  />
                  {errors.otp && <div className="invalid-feedback">{errors.otp.message}</div>}
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-success w-100">
                  Verify
                </button>
              </>
            )}
          </form>

          <div className="mt-3 text-center small text-muted">
            {!token ? (
              <>
                <p>
                  By signing up, you agree to our{" "}
                  <Link to="/terms" className="text-success">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-success">
                    Privacy Policy
                  </Link>
                  .
                </p>
                <hr />
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="text-success">
                    Log In
                  </Link>
                </p>
              </>
            ) : (
              <>
                <p>
                  Didn't receive the OTP?{" "}
                  {timer ? (
                    <>
                      Resend OTP in <span className="text-success">00:{timer < 10 ? `0${timer}` : timer}</span>
                    </>
                  ) : (
                    <button onClick={resendOtp} className="btn btn-link p-0 text-success">
                      Resend OTP
                    </button>
                  )}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}