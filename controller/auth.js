const bcypt = require("bcrypt");
const path = require("path");
const jsw = require("jsonwebtoken");


const User = require("../models/user");
const SendMail = require("../mails/mail");
const { json } = require("body-parser");




exports.postSignUp = async (req,res,next) => {
    
    const email = req.body.email;
    const password = req.body.password;

    console.log(email);
    console.log(password);

    try{

        const user = await User.findOne({email: email});
        //console.log(`Our user is ${user}`);
        if(user)
        {      
            //console.log(`user mil raha hai`);
            const error = new Error("User Already Found");
            error.statusCode = 400;
            next(error);
        }

        else
        {   
            const hashedPassword =  await bcypt.hash(password,12);

            //console.log(`our hashed password ${hashedPassword}`);
            const user = new User({
                email: email,
                password: hashedPassword
            });

            //we are making our mail
            const mailpath = path.join(__dirname,"..","mails","signupmail.html");

            const mailSubject = "SignUp Successfull";

            SendMail(email,mailSubject,mailpath);
            
            const saveUser = await user.save();

            res.status(201).json({
                message: "SignUp Successfull"
            });
        }
    }

    catch(err)
    {
        const error = new Error("Internal Server Error");
        error.statusCode = 500;
        next(error);
    }
    

    
}

exports.postLogin = async (req,res,next) => {

    const email = req.body.email;
    const password = req.body.password;

    //console.log(`${email} and ${password}`);

    try{

    const userdoc = await User.findOne({email:email});
    //console.log(userdoc);
    if(!userdoc)
    {   
        const error = new Error("User Not Found");
        error.statusCode = 404;
        next(error);
    }

    else
    {   
        const comparePasswords = await bcypt.compare(password,userdoc.password);

        //console.log(comparePasswords);
        if(!comparePasswords)
        {
            const error = new Error("Wrong UserName or Password");
            error.statusCode = 401;
            next(error);
        }

        else{
            
            const token = jsw.sign({
                email: userdoc.email,
                userId: userdoc._id.toString()
            },'invoice',{expiresIn: "1h"});


            res.status(200).json({
                userId: userdoc._id.toString(),
                token: token,
                message: "Login Successfull"
            });
        }
    }
    }catch(err)
    {
        const error = new Error("Internal Server Error");
        error.statusCode = 500;
        next(error);
    }
}