const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require('jsonwebtoken');
require("dotenv").config();


//creating the signup route handler
exports.signup = async (req,res) => {
    try{
        //getting the data from the
        const {name,email,password,role} = req.body;
        const existingUser = await User.findOne({email});
        
        //checking if the user already exists;
        if(existingUser){
            return res.status(400).json({
                success: true,
                message : 'User already exists',
            });
        }

        //securing password
        let hashPassword;
        try{
            hashPassword = await bcrypt.hash(password,10);
        }
        catch(error){
            console.error(error);
            return res.status(500).json({
                success: false,
                message : 'Server error while hashing password',
            });
        }

        //creating a new user
        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
            role
        })

        return res.status(200).json({
            success: true,
            message : 'User created successfully',
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message : 'user cannot be registered , server error or try again later on',
        });

    }
}


// creating the login route

exports.login = async (req,res) => {
    try{
        //fetching the data from the request body
        const {email ,password} = req.body;
        //now validating the email and password
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message : 'Please provide both email and password',
            });
        }

        //check for registered user
        const user = await User.findOne({email});
        //if not an registered user
        if(!user){
            return res.status(401).json({
                success: false,
                message : 'User is not registered',
            });
        }

        //creating a payload for Jwt token
        const payload = {
            user : user.email,
            id : user._id,
            role : user.role,
        };

        //verifying the password and creating a json web tokens
        if(await bcrypt.compare(password,user.password)){
            //password match
            let token = jwt.sign(payload,
                                process.env.JWT_SECRET,
                                {expiresIn: '2h'});
            // user = user.toObject({token});
            const userObject = user.toObject();
            userObject.token = token;
            userObject.password = undefined;
            const options = {
                expires : new Date(Date.now() + 3* 24 * 60 *60 *1000),
                httpOnly : true, 
            }


            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message : 'User logged in successfully',
            });
        }

        else{
            //password doesn't matches
            return res.status(403).json({
                success: false,
                message : 'Invalid password',
            })
        }


    }

    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message : 'Server error while logging in',
        });
    }
}


