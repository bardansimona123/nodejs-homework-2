const { Schema, model } = require("mongoose");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
   email: {
       type: String,
       required: true,
       unique: true,
   },
   password: {
       type: String,
       required: true,
   },
   avatarURL: {
       type: String,
       default: function () {
           return gravatar.url(this.email, { s: "250", d: "retro" }, true);
       },
   },
});

// Criptarea parolei înainte de salvare
userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();

   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);

   next();
});

// Verificarea parolei
userSchema.methods.matchPassword = async function (enteredPassword) {
   return await bcrypt.compare(enteredPassword, this.password);
};

const User = model("User", userSchema);

module.exports = User;
