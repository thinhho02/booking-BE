import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    googleID: {
      type: String,
      unique: true,
    },
    avatar: {
      type: String,
    },
    numberPhone: {
      type: String,
      unique: true,
    },
    birthDate:{
      year: Number,
      month: Number,
      day: Number
    },
    password: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    signInWith: {
      type: String,
      enum: ["Normal", "Google"],
      default: "Normal",
    },
    otp: {
      type: Number,
    },
    otpCreateAt: { type: Date },
    otpExpires: { type: Date },
    passwordResetToken: { type: String },
    roles: {
      type: [String],
      required: true,
      default: "user"
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    business: {
      type: [{ type: Schema.Types.ObjectId, ref: "Business" }],
      default: undefined,
    },
    refreshToken: {
      type: String,
    },
    // passwordChangeAt: Date,
    // passwordResetToken: String,
    // passwordResetExpries: Date,
  },
  { timestamps: true }
);
// userSchema.virtual("fullName").get(function () {
//   return `${this.firstName} ${this.lastName}`;
// });
userSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update?.password) {
    const salt = bcrypt.genSaltSync(10);
    this._update.password = await bcrypt.hash(this._update.password, salt);
  }
  next()
});

userSchema.methods.isPasswordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// userSchema.methods.createPasswordResetToken = async function () {
//   const resetToken = crypto.randomBytes(32).toString("hex");
//   console.log(resetToken)
//   this.passwordResetToken = crypto
//     .createHash("sha256",{hmacKey:process.env.passwordTokenKey})
//     .update(resetToken)
//     .digest("hex");
//   this.passwordChangeAt = Date.now()
//   this.passwordResetExpries = Date.now() + 10 * 60 * 1000 // 10 phút
//   return resetToken
// };

const User = mongoose.model("User", userSchema);

export default User;
