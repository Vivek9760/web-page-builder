/* ----------------------------- filepath ----------------------------- */
const FILE_PATH = "server/controllers/admin/users.controller";

/* ----------------------------- model ----------------------------- */
const UserModel = require("../../models/user.model");

/* ----------------------------- constants ----------------------------- */
const TOASTY = require("../../constants/toasty.constant");
const HTTP_STATUS = require("../../constants/http-status.constant");

/* ----------------------------- getUsersList ----------------------------- */
const getUsersList = async (req, res) => {
  try {
    const users = await UserModel.find({ role: "CLIENT" }, { name: 1, email: 1, _id: 1, isActive: 1, createdOn: 1 });

    return res.status(HTTP_STATUS.OK).json({ users });
  } catch (error) {
    console.error(FILE_PATH + "-> getUsersList", error);
    return res.status(HTTP_STATUS.UNAUTHORIZED).send({ message: TOASTY.SERVER.INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  getUsersList,
};
