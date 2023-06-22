import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import  User  from '../model/user'; 
import '../db';


dotenv.config();

const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/;
const message = { 'string.pattern.base': "Password must contain at least one alphabet, one number, and one special character (@#$%^&+=!)." }
const userSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().pattern(new RegExp(pattern)).required().messages(message),
  email: Joi.string().email().required(),
  role: Joi.string().valid('admin','teacher','student').required()
  
});

const loginSchema = Joi.object({
  password: Joi.string().pattern(new RegExp(pattern)).required().messages(message),
  email: Joi.string().email().required(),
  
});

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_TOKEN as string, { expiresIn: '10h' });
    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const forgotPassword = async (req:Request,res:Response) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.status(404).send({ message: 'User not found' });
    return;
  }

  const otp = Math.floor(Math.random() * 900000) + 100000;
  const otpExpiry = new Date(Date.now() + 30 * 60 * 1000);

  user.passwordResetOTP = otp;
  user.passwordResetOTPExpire = otpExpiry;
  await user.save();

  res.json({ message: 'OTP sent to your email successfully' });
};

export const resetPassword = async  (req:Request,res:Response) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email, passwordResetOTP: otp.toString() } });
    
    if (!user || user.passwordResetOTPExpire === null || user.passwordResetOTPExpire < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordResetOTP = null ;
    user.passwordResetOTPExpire = new Date(Date.now() + 30 * 60 * 1000) as any; // Add type assertion 'as any' to handle null assignment
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export default { loginUser, forgotPassword,resetPassword };






