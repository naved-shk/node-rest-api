const Joi = require('joi');
const { REFRESH_SECRET } = require('../../config');
const CustomErrorHandler = require('../../services/CustomErrorHandler');
const JwtService = require('../../services/JwtService');
const {User, RefreshToken} = require('../../models');

async function refresh(req, res, next){
   // Validation 

   const refreshSchema = Joi.object({
    refresh_token: Joi.string().required(),
})

const { error } = refreshSchema.validate(req.body);

if(error){
    return next(error);
}

 // Database 
 let refreshToken;
 try {

   refreshToken =  await RefreshToken.findOne({token: req.body.refresh_token});
   if(!refreshToken){
       
       return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
   }

   let userId;

   try {
       const {_id} = await JwtService.verify(refreshToken.token, REFRESH_SECRET);
       userId = _id;

   } catch (error) {
        return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
   }

   const user = User.findOne({_id: userId});
   if(!user){
    return next(CustomErrorHandler.unAuthorized('No user found!'));
   }

      // Token
      const access_token =  JwtService.sign({_id: user._id, role: user.role })
      const refresh_token =  JwtService.sign({_id: user._id, role: user.role }, '1y', REFRESH_SECRET )

      // Database whilelist
      await RefreshToken.create({token: refreshToken});
      res.json({
          access_token,
          refresh_token
  });
  

     
 } catch (error) {
     return next(new Error(`Someting went wrong  ${error.message}`));
 }

}

module.exports ={
    refresh,
}