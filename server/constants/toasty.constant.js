const Toasty = {
  SERVER: {
    INTERNAL_SERVER_ERROR: "Something went wrong.",
  },
  LOGIN: {
    TERMINATED: "Your account has been terminated.",
    NOT_VERIFIED: "Your account is not verified.",
  },
  SIGNUP: {
    SUCCESS: "Account created successfully! Please verify your email to log in.",
    EMAIL_EXISTS: "An account with this email already exists.",
    ERROR: "An error occurred while creating your account. Please try again later.",
  },
  VERIFY_OTP: {
    USER_NOT_FOUND: "User not found. Please check your email.",
    INVALID_OTP: "Invalid OTP. Please try again.",
    EXPIRED_OTP: "OTP has expired. Please request a new one.",
    SUCCESS_SIGNUP: "Email verified successfully! You can now log in.",
    SUCCESS_RESET_PASSWORD: "Email verified successfully! You can now reset your password.",
    INVALID_TOKEN: "Invalid otp. Please request a new verification otp.",
  },
  RESEND_OTP: {
    USER_NOT_FOUND: "User not found. Please check your email.",
    SUCCESS: "OTP resent successfully! Please check your email.",
    ERROR: "An error occurred while resending the OTP. Please try again later.",
  },
};

module.exports = Toasty
