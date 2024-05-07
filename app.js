const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");


const generalroutes = require("./routes/general");
const invoiceroutes = require("./routes/invoice");
const authroutes = require("./routes/auth");

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.use(generalroutes);
app.use(authroutes);
app.use("/invoice", invoiceroutes);



//error handler

app.use((error,req,res,next) => {

      const statusCode = error.statusCode;
      const message = error.message;

      console.log(error);

      console.log("my error handling middleware works");

      res.status(statusCode).json({

        status: statusCode,
        message: message

      })
  
});



app.use((req,res,next) =>{

    const error = new Error("404 NOT found");
    error.statusCode = 404;
    throw error;
})


mongoose.connect('mongodb+srv://kapilhedau:Kapil123@cluster0.25fxh0q.mongodb.net/invoices?retryWrites=true&w=majority&appName=Cluster0')
.then(result => {

  console.log("DB Connected");
  app.listen(3000, (results) => {
    console.log("listenng to the port 3000");
  });
  
})
.catch(err => {
    console.log("Problem to connected to Database");
});
