import bcrypt from "bcryptjs";
import mongoose, { model, models, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide your username."],
    },

    email: {
      type: String,
      required: [true, "Please provide your email."],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Please provide your phone number."],
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    password: {
      type: String,
      default: "",
    },
    // isVerified: { type: Boolean, default: false },
    // verificationToken: { type: String },
    // verificationTokenExpiry: { type: Date }

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    friendRequests: [
      {
        from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (this: any) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const User = models.User || model("User", userSchema);

export default User;
