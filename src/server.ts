import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import './db';
import * as dotenv from 'dotenv';
import Result from './model/result';
import { addResult, updateResult, getResult } from './router/result';
import {signup} from './router/signup';
import { loginUser,forgotPassword,resetPassword } from './router/login';
import User from './model/user';
import {multerConfig, uploadProfilePicture } from './multer/profile';
import authenticate from './middleware/authentication';

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
app.post('/user/signup', signup);
app.post('/user/login', loginUser);
app.post('/result', authenticate, addResult);
app.put('/result/:student_id', authenticate, updateResult);
app.post('/forgot-password',authenticate, forgotPassword);
app.post('/reset-password',authenticate, resetPassword);

app.get('/result/:student_id', authenticate, getResult);

app.post('/user/profile-picture/:userId', multerConfig.single('profilePicture') ,authenticate, uploadProfilePicture);


// Assuming you're using Express.js
app.get('/getresult/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId, {
      include: Result, // Include the associated results
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const results = user.Results; // Access the associated results

    // Create the desired JSON output
    const output = {
      student: {
        name: user.name,
        student_id: user.student_id
      },
      results: {} as { [key: string]: number } 
    };

    for (const result of results) {
      output.results[result.subject] = result.marks;
    }

    return res.json(output);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log("Server running on port:", port);
});
