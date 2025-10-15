/* ----------------------------- regex ----------------------------- */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const OTP_REGEX = /^\d{6}$/;


/* ----------------------------- pattern ----------------------------- */
const EMAIL_PATTERN = {
    value: EMAIL_REGEX,
    message: 'If that’s your real email, then I’m Batman. 🦇'
}

const PASSWORD_PATTERN = {
    value: PASSWORD_REGEX,
    message: "At least 8 characters. A, a, 1, and %, because life is hard. 💪"
};

const OTP_PATTERN = {
    value: OTP_REGEX,
    message: "OTP must be a 6-digit number."
};

export {
    EMAIL_PATTERN,
    PASSWORD_PATTERN,
    OTP_PATTERN
}