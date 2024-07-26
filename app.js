const express = require("express");
const app = express();
const mongoose = require("mongoose"); 
const path= require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate"); 
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialised: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: Date.now() +  7 * 24 * 60 * 60 * 1000,
    }
};

app.use(session(sessionOptions));
//root
app.get("/",( req, res)=>{
    res.send("hi");
});

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"));
})

app.use((err,req,res,next)=>{
    let{statusCode=500, message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("sever listening");
});