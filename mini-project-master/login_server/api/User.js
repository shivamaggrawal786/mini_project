const express = require('express');
const router = express.Router();

const User = required('./../models/User');

const bcrypt = require('bcrypt');

// signup
router.post('/signup', (req,res) => {
    let {username, email, phoneno, password} = req.body;
    username = username.trim();
    email = email.trim();
    mobileno = mobileno.trim();
    password = password.trim();

    if(username == "" || email == "" || mobileno == "" || password == ""){
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
    });
    } else if (!/^[a-zA-Z ]*$/.test(username)){
        res.json({
            status: "FAILED",
            message: "Invalid name entered!"
        })
    } else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status: "FAILED",
            message: "Invalid email entered!"
        })
    } else if(password.length < 8){
        res.json({
            status: "FAILED",
            message: "Invalid password entered!"

        })
    } else if(mobileno <6300000000 || mobileno > 9999999999){
        res.json({
            status: "FAILED",
            message: "Invalid mobile no. entered!"

        })
    } else{

        User.find({email}).then(result =>{
            if(result.length){
                res.json({
                    status: "FAILED",
                    message: "User with the provided email already exists"
                })
            } else{
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword =>{
                    const newUser = new User({
                        username,
                        email,
                        mobileno,
                        password : hashedPassword

                    });
                    newUser.save().then(result =>{
                        res.json({
                            status: "SUCCESS",
                            message: "Signup successful",
                            data: result,
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occured while saving user account!"
                        })

                    })
                })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while hashing password"
                    })
                })

            }

        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing user!"
            })
        })
    }

})

// signin
router.post('/signin', (req,res) => {
    let {email, password} = req.body;
    email = email.trim();
    password = password.trim();

    if (email == "" || password == ""){
        res.json({
            status: "FAILED",
            message: "Empty credentials supplied"
        })
    
    } else{
        User.find({email})
        .then(data => {
            if(data.length){
                const hashedPassword= data[0].password;
                bcrypt.compare(password, hashedPassword).then(result =>{
                    if(result){
                        res.json({
                            status: "SUCCESS",
                            message: "Signin successful",
                            data: data
                        })
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Invalid password entered!"
                        })
                    }
                })
                .catch(err => {
                    res.json({
                    status: "FAILED",
                    message: "An error occured while comparing passwords"
                })
            })
            } else {
                res.json({
                    status: "FAILED",
                    message: "Invalid credentials entered!"
                })
            }
        })
        .catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing user"
            })
        })
    }

})

module.exports = router;
