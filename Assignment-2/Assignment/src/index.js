const express = require("express");
const mongoose = require("mongoose")

const app = express()
const bodyParser = require("body-parser")

app.use(bodyParser.json())
app.use(express.json())

const loginRouter = require("./routes/login")
const registerRouter=require("./routes/register")
const postRouter = require("./routes/post")

app.use("/login",loginRouter)
app.use("/register",registerRouter)
app.use("/posts",postRouter)

mongoose.connect("mongodb://localhost/assignment")
    .then(()=>console.log("Database Connected"))
    .catch(err=>console.log(err))

app.listen(3000,()=>console.log("Server Started"))