/* ----------------------------- libraries ----------------------------- */
const bcrypt = require("bcrypt");

/* ----------------------------- filepath ----------------------------- */
const FILE_PATH = "server/controllers/authentication.controller";

/* ----------------------------- utils ----------------------------- */
const { generateRandomString, generateOtp, generateUniqueSlug } = require("../utils/crypto.util");

/* ----------------------------- model ----------------------------- */
const UserModel = require("../models/user.model");
const WebPageModel = require("../models/web-page.model");
const AuthenticationModel = require("../models/authentication.model");

/* ----------------------------- json ----------------------------- */
const DEFAULT_WEB_PAGES = require("../seeds/web-page.seed.json");

/* ----------------------------- constants ----------------------------- */
const TOASTY = require("../constants/toasty.constant");
const { USER_STATUS } = require("../constants/enum.constant");
const HTTP_STATUS = require("../constants/http-status.constant");
const { SALT_ROUND, TOKEN_EXPIRY } = require("../constants/authentication.constant");
const { EMAIL_REGEX, PASSWORD_REGEX } = require("../constants/validation.constant");

/* ----------------------------- services ----------------------------- */
const { createUserStore } = require("../services/authentication.service");

/* ----------------------------- login ----------------------------- */
const login = async (req, res) => {
  try {
    const { body } = req;
    const email = body.email.toLowerCase().trim();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: "INVALID_EMAIL" });
    }

    const isMatch = await bcrypt.compare(body.password, user.password);

    if (!isMatch) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: "INVALID_PASSWORD" });
    }

    if (user.status !== "VERIFIED") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: "NOT_VERIFIED", message: TOASTY.LOGIN.NOT_VERIFIED });
    }

    if (!user.isActive) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: "TERMINATED", message: TOASTY.LOGIN.TERMINATED });
    }

    const storeInfo = await createUserStore(user);

    /* ----------------------------- httpOnly cookie ----------------------------- */
    res.cookie("sessionToken", storeInfo.sessionToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });

    return res.status(HTTP_STATUS.OK).json({ user: storeInfo.user });
  } catch (error) {
    console.error(FILE_PATH + "-> login", error);
    return res.status(HTTP_STATUS.UNAUTHORIZED).send({ message: TOASTY.SERVER.INTERNAL_SERVER_ERROR });
  }
};

/* ----------------------------- signup ----------------------------- */
const signup = async (req, res) => {
  try {
    const { body } = req;
    const { name, email: userEmail, password } = body;
    const email = userEmail.toLowerCase().trim();

    if (!name || !email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: "MISSING_FIELDS", message: TOASTY.SIGNUP.ERROR });
    }
    if (!EMAIL_REGEX.test(email) || !PASSWORD_REGEX.test(password)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: "INVALID_FIELDS", message: TOASTY.SIGNUP.ERROR });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: "EMAIL_EXISTS", field: "email", message: TOASTY.SIGNUP.EMAIL_EXISTS });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

    const verifyEmail = {
      token: generateRandomString(),
      otp: generateOtp(),
      expiredAt: new Date(Date.now() + TOKEN_EXPIRY),
    };

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      verifyEmail,
    });

    const defaultPages = JSON.parse(JSON.stringify(DEFAULT_WEB_PAGES));

    for (const template of defaultPages) {
      template.author = user._id;
      template.slug = await generateUniqueSlug(template.title);
      await WebPageModel.create(template);
    }

    console.log(verifyEmail);

    return res.status(HTTP_STATUS.OK).json({ message: TOASTY.SIGNUP.SUCCESS, token: verifyEmail.token, email: email });
  } catch (error) {
    console.error(FILE_PATH + "-> signup", error);
    return res.status(HTTP_STATUS.UNAUTHORIZED).send({ message: TOASTY.SERVER.INTERNAL_SERVER_ERROR });
  }
};

/* ----------------------------- login-session ----------------------------- */
const loginSession = async (req, res) => {
  try {
    const { user } = req;
    res.status(HTTP_STATUS.OK).json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(FILE_PATH + "-> loginSession", error);
    return res.status(HTTP_STATUS.UNAUTHORIZED).send({ message: TOASTY.SERVER.INTERNAL_SERVER_ERROR });
  }
};

/* ----------------------------- verify-email ----------------------------- */
const verifyEmail = async (req, res) => {
  try {
    const { body } = req;
    const { otp, token, email } = body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: "USER_NOT_FOUND", message: TOASTY.VERIFY_OTP.USER_NOT_FOUND });
    }

    if (user?.verifyEmail?.token !== token) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: "INVALID_TOKEN", field: "otp", message: TOASTY.VERIFY_OTP.INVALID_TOKEN });
    }

    if (user?.verifyEmail?.otp !== otp) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: "INVALID_OTP", field: "otp", message: TOASTY.VERIFY_OTP.INVALID_OTP });
    }

    if (user?.verifyEmail?.expiredAt < new Date()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: "EXPIRED_OTP", field: "otp", message: TOASTY.VERIFY_OTP.EXPIRED_OTP });
    }

    user.status = USER_STATUS.VERIFIED;
    user.verifyEmail = undefined;
    user.isActive = true;
    await user.save();

    return res.status(HTTP_STATUS.OK).json({ message: TOASTY.VERIFY_OTP.SUCCESS_SIGNUP });
  } catch (error) {
    console.error(FILE_PATH + "-> verifyEmail", error);
    return res.status(HTTP_STATUS.UNAUTHORIZED).send({ message: TOASTY.SERVER.INTERNAL_SERVER_ERROR });
  }
};

/* ----------------------------- send-otp ----------------------------- */
const sendOtp = async (req, res) => {
  try {
    const { body } = req;
    const { email: userEmail } = body;
    const email = userEmail.toLowerCase().trim();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: "USER_NOT_FOUND", message: TOASTY.RESEND_OTP.USER_NOT_FOUND });
    }

    const newOtp = generateOtp();
    const token = generateRandomString();
    user.verifyEmail.otp = newOtp;
    user.verifyEmail.token = token;
    user.verifyEmail.expiredAt = new Date(Date.now() + TOKEN_EXPIRY);
    await user.save();

    console.log(user.verifyEmail);

    return res.status(HTTP_STATUS.OK).json({ message: TOASTY.RESEND_OTP.SUCCESS, token });
  } catch (error) {
    console.error(FILE_PATH + "-> sendOtp", error);
    return res.status(HTTP_STATUS.UNAUTHORIZED).send({ message: TOASTY.SERVER.INTERNAL_SERVER_ERROR });
  }
};

/* ----------------------------- logout ----------------------------- */
const logout = async (req, res) => {
  try {
    const { sessionId } = req;

    await AuthenticationModel.deleteOne({ sessionId });

    res.clearCookie("sessionToken", {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });

    return res.status(HTTP_STATUS.OK).json({ status: "SUCCESS" });
  } catch (error) {
    console.error(FILE_PATH + "-> logout", error);
    return res.status(HTTP_STATUS.UNAUTHORIZED).send({ message: TOASTY.SERVER.INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  login,
  signup,
  loginSession,
  verifyEmail,
  sendOtp,
  logout,
};
