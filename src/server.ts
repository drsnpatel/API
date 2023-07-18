import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import './db';
import * as dotenv from 'dotenv';
import Result from './model/result';
import { addResult, updateResult, getResult, addSemester } from './router/result';
import {signup} from './router/signup';
import { loginUser,forgotPassword,resetPassword } from './router/login';
import User from './model/user';
import {multerConfig, uploadProfilePicture } from './multer/profile';
import authenticate from './middleware/authentication';
import sequelize from './db';





dotenv.config();
const port = 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up User and Result models
User.sync();
Result.sync();




// Set up API routes
app.post('/semester', authenticate,addSemester);
app.post('/user/signup', signup);
app.post('/user/login', loginUser);
app.post('/result', authenticate, addResult);
app.put('/result/:student_id', authenticate, updateResult);
app.post('/forgot-password',authenticate, forgotPassword);
app.post('/reset-password',authenticate, resetPassword);

app.get('/result/:student_id', authenticate, getResult);

app.post('/user/profile-picture/:userId', multerConfig.single('profilePicture') ,authenticate, uploadProfilePicture);







// Sync the models with the database
sequelize.sync({ alter:true })
  .then(() => {
    console.log('All models were synchronized successfully.');
  })
  .catch((err) => {
    console.error('Unable to synchronize the models:', err);
  });

app.listen(port, () => {
  console.log("Server running on port:", port);
});
