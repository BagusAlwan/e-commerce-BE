const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel')
const asyncHandler = require("express-async-handler");
const validateMongoId = require('../utils/validateMongoId');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('./emailControler');
//Create a user
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if (!findUser) {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error('User Already Created')
        }
});

//Login a user
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    //Find if user exist
    const findUser = await User.findOne({email});
    if (findUser && await findUser.isPasswordMatched(password)) {
        const rToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(findUser.id,
            {
                refreshToken: rToken,
            },
            {
                new:true,
            });
        res.cookie('refreshToken', rToken,{
            httpOnly: true,
            maxAge: 72*60*60*1000,
        });
        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            token: generateToken(findUser?._id),
        });
    } else {
        throw new Error("Invalid Credentials")
    } 
})

//handle refresh token
const handleRefreshToken = asyncHandler(async(req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No refresh token found")
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if(!user) throw new Error("No matching refresh token");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err || user.id !== decoded.id){
            throw new Error("There is something wrong with the Refresh Token")
        }
        const accessToken = generateToken(user?.id);
        res.json({accessToken});
    });
});

//Logot
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No refresh token found");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if(!user){
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204)
    }
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    return res.sendStatus(204);

});

//get all users
const getAllUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error)
    }
})

//get specific user
const getUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoId(id);
    try {
        getOneUser = await User.findById(id);
        res.json({
            getOneUser,
        });
    } catch (error) {
        throw new Error(error)
    }
});

//delete
const deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.user;
    validateMongoId(id);
    try {
        getDeleteUser = await User.findByIdAndDelete(id);
        res.json({
            getDeleteUser,
        });
    } catch (error) {
        throw new Error(error)
    }
});

//update
const updateUser = asyncHandler(async (req, res) => {
    const {id} = req.user;
    validateMongoId(id);
    try {
       getUpdateUser = await User.findByIdAndUpdate(id, 
        {
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
        },
        {
            new: true,
        }
        );
        res.json(getUpdateUser)
    } catch (error) {
        throw new Error(error)
    }
})

const blockUser = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoId(id);
    try {
        const block = await User.findByIdAndUpdate(id,
            {
                isBlocked: true
            },
            {
                new:true,
            });
            res.json({
                message: "User blocked",
            })
    } catch (error) {
        throw new Error(error)
    }
})

const unblockUser = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoId(id);
    try {
        const unblock = await User.findByIdAndUpdate(id,
            {
                isBlocked: false
            },
            {
                new:true,
            });
            res.json({
                message: "User unblocked",
            })
    } catch (error) {
        throw new Error(error)
    }
});

const updatePassword = asyncHandler(async (req, res) => {
    const {_id } = req.user;
    const { password } = req.body;
    validateMongoId(_id);
    const user = await User.findById(_id);
    if(password){
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword)
    }else{
        res.json(user);
    }
})

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try {
      const token = await user.createPasswordResetToken();
      await user.save();
      const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:9090/api/user/reset-password/${token}'>Click Here</>`;
      const data = {
        to: email,
        text: "Hey User",
        subject: "Forgot Password Link",
        htm: resetURL,
      };
      sendEmail(data);
      res.json(token);
    } catch (error) {
      throw new Error(error);
    }
  });

  const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error(" Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
  });

module.exports = { createUser, loginUser, getAllUser, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword };