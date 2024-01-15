const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  provider: {
    type: String,
    default: "email",
  },
  provider_id: {
    type: String,
    default: null,
  },
  password: String,
  userId: String,
  profile_image: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
