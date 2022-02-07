const Joi = require('joi');
const {User, RefreshToken} = require('../../models');
const bcrypt = require('bcrypt');
const CustomErrorHandler = require('../../services/CustomErrorHandler');
const JwtService = require('../../services/JwtService');
const { REFRESH_SECRET } = require('../../config');


async  function login(req, res, next){
    // Validation
    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),

    })

    const { error } = loginSchema.validate(req.body);
    if(error){
        return next(error);
    }

    try {

     
        const user = await User.findOne({ email: req.body.email });
        
        if(!user){
            return next(CustomErrorHandler.invalidCredentials());
        }

        // Compare password 
        const match = await bcrypt.compare(req.body.password, user.password);

        if(!match){
            return next(CustomErrorHandler.invalidCredentials());
        }

        // Token
        const accessToken =  JwtService.sign({_id: user._id, role: user.role })
        const  refreshToken =  JwtService.sign({_id: user._id, role: user.role }, '1y', REFRESH_SECRET )

        // Database whilelist
        await RefreshToken.create({token: refreshToken});
        res.json({
            access_token: accessToken,
        refresh_token: refreshToken
    });
    } catch (error) {
        return next(error);
    }
}

async function logout(req, res, next){

    // Validation
    const refreshSchema = Joi.object({
        refresh_token: Joi.string().required(),
    })
    
    const { error } = refreshSchema.validate(req.body);
    
    if(error){
        return next(error);
    }

    try {

        await RefreshToken.deleteOne({token: req.body.refresh_token});
        
    } catch (error) {
        return next(new Error('Something went wrong in database'));
    }
    
    res.json({status: 1});
}

module.exports = {
    login,
    logout,
  };