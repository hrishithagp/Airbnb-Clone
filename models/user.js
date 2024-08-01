const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportLocalMongoose =require("passport-local-mongoose");

//username and password are automically defined by passport-local-mongoose when we give email, we can define on our own also
const userSchema = new schema({
    email:{
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);