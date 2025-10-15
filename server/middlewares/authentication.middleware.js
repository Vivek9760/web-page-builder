/* ----------------------------- libraries ----------------------------- */
const JWT = require("jsonwebtoken");

/* ----------------------------- constants ----------------------------- */
const HTTP_STATUS = require("../constants/http-status.constant");
const TOASTY = require("../constants/toasty.constant");
const { USER_STATUS } = require("../constants/enum.constant.js");
const { SESSION_EXPIRY } = require("../constants/authentication.constant");

/* ----------------------------- filepath ----------------------------- */
const FILE_PATH = 'server/middlewares/authentication.middleware';

/* ----------------------------- models ----------------------------- */
const UserModel = require("../models/user.model.js");
const AuthenticationModel = require("../models/authentication.model.js");


const clearSessionToken = (res) => {
    res.clearCookie("sessionToken", {
        httpOnly: true,
        secure: false,
        sameSite: "Strict"
    });
}

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

        if (!authenticationInfo || authenticationInfo.expiredAt < Date.now()) {
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

        req['user'] = user;
        req['userId'] = user._id;
        req['sessionId'] = sessionInfo.sessionId;

        next();
    } catch (error) {
        clearSessionToken(res);
        console.error(FILE_PATH + '-> authentication', error);
        return res.status(HTTP_STATUS.UNAUTHORIZED).send({ status: "TERMINATE" });
    }
}

const permitRole = (...roles) => {
    try {
        return (req, res, next) => {
            if (roles.includes(req.user.role)) next();
            else return res.status(HTTP_STATUS.UNAUTHORIZED).json({ status: 'UNAUTHORIZED' });
        }
    } catch (error) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ status: "UNAUTHORIZED" });
    }
}

module.exports = {
    authentication,
    permitRole
}