const UserSchema = (mongoose) => {
  const { Schema } = mongoose;

  return new Schema(
    {
      name: { type: String, required: true },
      email: { type: String, lowercase: true, trim: true, required: true, unique: true },
      status: { type: String, enum: ["VERIFIED", "PENDING"], default: "PENDING" },
      isActive: { type: Boolean, default: false },
      role: { type: String, enum: ["ADMIN", "CLIENT"], default: "CLIENT" },
      password: { type: String, required: true },
      verifyEmail: {
        expiredAt: Date,
        otp: String,
        token: String,
      },
      isOnline: { type: Boolean },
      lastOnlineTime: { type: Date },
    },
    { timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } }
  );
};

module.exports = UserSchema;
