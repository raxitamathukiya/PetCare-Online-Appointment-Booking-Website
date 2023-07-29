const express = require('express')
const { UserModel } = require('../Model/User.model')
const { connection } = require('../config/db')
const userRoutes = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { BlacklistModel } = require('../Model/Blacklist.model');
const { authMiddleware } = require('../Middleware/Auth.middleware')
const { User_appointmentModel } = require('../Model/User_Appointment.model')
const { getIO } = require('../socket');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport")
const { v4: uuidv4 } = require('uuid');
const isAuth = (req, res, next) => {
  if (req.user) {
    next();
  }
  else {
    res.redirect("/login")
  }
}

passport.serializeUser(function (user, cb) {
  cb(null, user.id)
})

passport.deserializeUser(function (id, cb) {
  cb(null, id)
})

passport.use(new GoogleStrategy({
  clientID: '187460305704-483v8ku84ebi9501n8pm2j4093pfhcul.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: "http://localhost:8080/auth/google/callback"
},
  async function (accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    try {
      const email = profile._json.email
      let user = await UserModel.findOne({ email })
      
      if (user) {
        const token = jwt.sign({ userId: user._id }, process.env.SecretKey, {
          expiresIn: '7d'
        });
        return cb(null, user,token)
      } else {
        
        const user = new UserModel({
          email,
          password: uuidv4(),
          name: profile._json.given_name
        })
        await user.save()
        const token = jwt.sign({ userId: user._id }, process.env.SecretKey, {
          expiresIn: '7d'
        });
        return cb(null,user,token)
      }
    } catch (error) {
      return cb(error)
    }

  }
));

userRoutes.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

userRoutes.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  async function (req, res) {
    // Successful authentication, redirect home.
    let user = req.user;
    user.password = undefined;
    const token = jwt.sign({ userId: user._id }, process.env.SecretKey, {
      expiresIn: '7d'
    });
    res.redirect(`https://petcare-booking.netlify.app/user_index?userdata=${encodeURIComponent(JSON.stringify(user))}&token=${encodeURIComponent(JSON.stringify(token))}`);

  });
userRoutes.post('/register', async (req, res) => {
  try {
    const { name, email, password, mobile, city } = req.body;
    const userExists = await UserModel.findOne({ $or: [{ name }, { email }] });
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      const adddata = new UserModel({ name, email, password: hash, mobile, city })
      await adddata.save()
      res.status(200).json({ msg: 'User created successfully' });
    });
  } catch (error) {
    res.status(400).json({
      isError: true,
      msg: "Something went wrong !!!!",
      error: error
    });
  }
})

userRoutes.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: 'Invalid username or password' });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ msg: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.SecretKey, {
      expiresIn: '7d'
    });
    res.status(200).json({ msg: 'Login Successfully', token: token, name: user.name, userid: user._id });
  } catch (error) {
    res.status(400).json({
      isError: true,
      msg: "Something went wrong !!!!",
      error: error
    });
  }

})
userRoutes.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const blacklistedToken = new BlacklistModel({ token });
    await blacklistedToken.save();
    res.status(200).json({ msg: 'Logged out successfully' });
  } catch (error) {
    res.status(400).json({
      isError: true,
      msg: "internal server error",
      error: error

    });

  }
});
userRoutes.post('/appointment', authMiddleware, async (req, res) => {
  try {

    const { name, email, mobile, city, _id } = req.body.user;
    const { petname, date, time, urgency_level, note, doctor_id } = req.body;

    const adddata = new User_appointmentModel({ name, email, mobile, city, petname, date, time, urgency_level, note, doctor_id, user_id: _id })
    await adddata.save();
    // console.log(adddata);
    const notificationData = {
      type: 'appointment',
      message: 'New appointment confirmed!',
      appointmentDetails: adddata,
      DoctorID: doctor_id
    };
    const io = getIO();
    console.log(notificationData)
    io.emit('notification', notificationData);
    res.status(200).json({ msg: 'Appointment booking successfully' });

  } catch (error) {
    res.status(400).json({
      isError: true,
      msg: "Something went wrong !!!!",
      error: error
    });
  }
})
userRoutes.get("/getapp/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const data = await User_appointmentModel.find({ user_id: id });
    // console.log(data)
    res.status(200).json(data)
  } catch (error) {
    res.status(400).json({
      isError: true,
      msg: "Something went wrong !!!!",
      error: error
    });
  }
})

userRoutes.get("/get", async (req, res) => {

  try {
    const data = await User_appointmentModel.find()
    res.status(200).json(data)
  } catch (error) {
    res.status(400).json({
      isError: true,
      msg: "Something went wrong !!!!",
      error: error
    });
  }
})

userRoutes.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedData = await User_appointmentModel.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }
    res.status(200).json({ msg: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(400).json({
      isError: true,
      msg: "Something went wrong !!!!",
      error: error
    });
  }

})

userRoutes.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const updata = req.body
    const data = await User_appointmentModel.findByIdAndUpdate({ _id: id }, updata)
    res.status(200).json({ msg: 'Appointment updated successfully' });
  } catch (error) {
    res.status(400).json({
      isError: true,
      msg: "Something went wrong !!!!",
      error: error
    });
  }

})
userRoutes.get("/getuser/:id", async (req, res) => {

  try {
    const data = await UserModel.find({ _id: req.params.id })
    res.status(200).json(data)
  } catch (error) {
    res.status(400).json({
      isError: true,
      msg: "Something went wrong !!!!",
      error: error
    });
  }
})
module.exports = {
  userRoutes

}
