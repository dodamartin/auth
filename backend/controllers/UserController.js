// controllers/UserController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const User = require('../models/User');

require('dotenv').config();


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
    secure: true, // use SSL/TLS
    port: 465,
});

const otpMap = new Map();

module.exports = {
    async register(req, res) {
        try {
          const { name, email, password } = req.body;
      
          // Check if the email is a Gmail address
          if (!email.endsWith('@gmail.com')) {
            return res.status(400).json({ message: 'Only Gmail addresses are allowed for registration' });
          }
      
          // Check if a user with the provided email already exists in the database
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return res.status(400).json({ message: 'Email address is already registered' });
          }
      
          const hashedPassword = await bcrypt.hash(password, 10);
          const user = new User({ name, email, password: hashedPassword });
          await user.save();
      
          // Create and send a JWT token upon successful registration
          const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
          res.status(201).json({ user, token });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Registration failed' });
        }
      },
      

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'Authentication failed', isAuthenticated: false });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Authentication failed', isAuthenticated: false });
      }

      // Create and send a JWT token with a longer expiration upon successful login
      const token = jwt.sign({ userId: user._id }, 'your-longer-secret-key', { expiresIn: '1h' });
      res.status(200).json({ user, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Authentication failed', isAuthenticated: false });
    }
  },

  async generateOTP(req, res) {
    try {
      const { email } = req.body;

      // Generate a random OTP and store it with a timestamp
      const otp = otpGenerator.generate(8, {
        digits: true,
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      const otpExpiration = Date.now() + 60 * 1000; // 60 seconds for 1 minute
      otpMap.set(email, { otp, expiration: otpExpiration });

      // Send the OTP via email
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).json({ message: 'Failed to send OTP via email' });
        } else {
          res.status(200).json({ message: 'OTP sent successfully' });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to generate OTP' });
    }
  },

  async verifyOTP(req, res) {
    try {
      const { email, otp, newPassword } = req.body;

      // Retrieve the stored OTP object associated with the user's email
      const storedOtpObject = otpMap.get(email);

      // Check if the OTP has expired
      if (!storedOtpObject || Date.now() > storedOtpObject.expiration) {
        otpMap.delete(email); // Remove the expired OTP
        return res.status(401).json({ message: 'OTP has expired' });
      }

      // Compare the provided OTP with the stored OTP
      if (otp !== storedOtpObject.otp) {
        return res.status(401).json({ message: 'Invalid OTP' });
      }

      // If the OTP is valid, update the user's password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findOneAndUpdate({ email }, { password: hashedPassword });

      // Remove the OTP from the map after it's been used
      otpMap.delete(email);

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to verify OTP and update password' });
    }
  },
};
