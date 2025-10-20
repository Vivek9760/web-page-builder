/* ----------------------------- libraries ----------------------------- */
const JWT = require("jsonwebtoken");

/* ----------------------------- constants ----------------------------- */
const HTTP_STATUS = require("../constants/http-status.constant");
const TOASTY = require("../constants/toasty.constant");
const { USER_STATUS } = require("../constants/enum.constant.js");
const { SESSION_EXPIRY } = require("../constants/authentication.constant");

/* ----------------------------- filepath ----------------------------- */
const FILE_PATH = "server/middlewares/authentication.middleware";

/* ----------------------------- models ----------------------------- */
const UserModel = require("../models/user.model.js");
const AuthenticationModel = require("../models/authentication.model.js");

/* ----------------------------- utils ----------------------------- */
const { parseCookies } = require("../utils/cookie.util.js");

const clearSessionToken = (res) => {
  res.clearCookie("sessionToken", {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
  });
};

const authentication = async (req, res, next) => {
  try {
    const { cookies } = req;

    if (!cookies?.sessionToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "NO_TOKEN" });
    }

    const sessionInfo = JWT.verify(cookies?.sessionToken, process.env.SECRET_KEY);

    if (!sessionInfo) {
      throw new Error("Invalid token");
    }

    const authenticationInfo = await AuthenticationModel.findOne({ sessionId: sessionInfo.sessionId, userId: sessionInfo.userId });

    if (!authenticationInfo) {
      throw new Error("Invalid token");
    }

    if (authenticationInfo.expiredAt < Date.now()) {
      await AuthenticationModel.deleteOne({ sessionId: sessionInfo.sessionId, userId: sessionInfo.userId });
      throw new Error("Token expired");
    }

    const user = await UserModel.findOne({ _id: sessionInfo.userId });

    if (!user) {
      throw new Error("User not found");
    } else if (user.status !== USER_STATUS.VERIFIED) {
      throw new Error(TOASTY.LOGIN.NOT_VERIFIED);
    } else if (!user.isActive) {
      throw new Error(TOASTY.LOGIN.TERMINATED);
    }

    authenticationInfo.expiredAt = new Date(Date.now() + SESSION_EXPIRY);

    await authenticationInfo.save();

    req["user"] = user;
    req["userId"] = user._id;
    req["sessionId"] = sessionInfo.sessionId;

    next();
  } catch (error) {
    clearSessionToken(res);
    console.error(FILE_PATH + "-> authentication", error);
    return res.status(HTTP_STATUS.UNAUTHORIZED).send({ status: "TERMINATE" });
  }
};

const permitRole = (...roles) => {
  try {
    return (req, res, next) => {
      if (roles.includes(req.user.role)) next();
      else return res.status(HTTP_STATUS.UNAUTHORIZED).json({ status: "UNAUTHORIZED" });
    };
  } catch (error) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ status: "UNAUTHORIZED" });
  }
};

const socketAuthentication = async (socket, next) => {
  try {
    const cookies = parseCookies(socket.handshake.headers.cookie);
    const sessionToken = cookies.sessionToken;

    if (!sessionToken) {
      return next(new Error("NO_TOKEN"));
    }

    const sessionInfo = JWT.verify(sessionToken, process.env.SECRET_KEY);
    if (!sessionInfo) {
      throw new Error("Invalid token");
    }

    const authenticationInfo = await AuthenticationModel.findOne({
      sessionId: sessionInfo.sessionId,
      userId: sessionInfo.userId,
    });

    if (!authenticationInfo || authenticationInfo.expiredAt < Date.now()) {
      throw new Error("Token expired");
    }

    // 4️⃣ Check user info
    const user = await UserModel.findOne({ _id: sessionInfo.userId });
    if (!user) throw new Error("User not found");
    if (user.status !== USER_STATUS.VERIFIED) throw new Error("User not verified");
    if (!user.isActive) throw new Error("User terminated");

    socket.user = { ...user, _id: String(user._id) };
    socket.userId = String(user._id);
    socket.sessionId = sessionInfo.sessionId;
    socket.path = socket?.handshake?.auth?.path || "/";

    next();
  } catch (error) {
    console.error("Socket authentication error:", error);
  }
};

module.exports = {
  authentication,
  permitRole,
  socketAuthentication,
};
