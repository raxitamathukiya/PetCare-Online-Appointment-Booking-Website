const jwt = require('jsonwebtoken');
const {DoctorModel}=require('../Model/doctor.model');
const {BlacklistModel}=require('../Model/Blacklist.model');
require("dotenv").config();

const auth = async( req, res, next ) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        const isBlacklisted = await BlacklistModel.findOne({ token });

        if (isBlacklisted) {
            return res.status(401).json({
                isError:true,
                msg:"Token is blacklisted please Login"
            });
        }

        const decodedToken = jwt.verify(token,process.env.SecretKey);
        // console.log(decodedToken);
        const { UserID } = decodedToken;
        
        const user = await DoctorModel.findById({_id:UserID});

        if (!user) {
            return res.status(401).json({ 
                isError:true,
                msg: 'Unauthorized' 
            });
        }
        req.UserID = UserID;
        next();

    } catch (error) {
        return res.status(401).json({
            isError:true,
            msg: 'Unauthorized' 
        });
    }
};

module.exports = {auth};