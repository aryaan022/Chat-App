
const bcrypt = require("bcryptjs")
const User= require("../models/user.model.js")
const {generateToken} = require("../utils/util.js")





module.exports.signup = async (req, res) => {
    const {fullName ,email , password} = req.body;
    try{
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length <6){
            return res.status(400).json({message:"Password must be atleast 6 character long"});
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exist with email"});
        }
        const salt = await bcrypt.genSalt(10);

        const hashedPassword =  await bcrypt.hash(password ,salt);

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword,
        })

        if(newUser){
            generateToken(newUser._id , res);
            await newUser.save();

            return res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
            });
        }
        else{
            return res.status(400).json({message:"Invalid user data"});
        }
    }catch(error){
        console.log("Error in singup controller :" , error.message);
        return res.status(500).json({message:"Internal server error"});
    }
}


module.exports.login = async (req, res) => {
    const {email,password}= req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password , user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"});
        }

        generateToken(user._id , res);


        return res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
        });



    }catch(error){
        console.log("Error in login controller :" , error.message);
        return res.status(500).json({message:"Internal server error"});
    }
}


module.exports.logout = async (req, res) => {
    try{
        res.cookie("jwt","",{maxAge:0});
        return res.status(200).json({message:"Logged out successfully"});
    }catch(err){
        console.log("Error in logout controller :" , err.message);
        return res.status(500).json({message:"Internal server error"});
    }
}


module.exports.updateProfile = async (req, res) => {}