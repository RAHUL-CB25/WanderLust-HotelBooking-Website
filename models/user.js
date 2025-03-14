const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// Define the schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no two users have the same email
    },
});

// Apply the passport-local-mongoose plugin to the schema
userSchema.plugin(passportLocalMongoose);

// Export the model
module.exports = mongoose.model("User", userSchema);
