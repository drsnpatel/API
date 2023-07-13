import { Request, Response } from "express";
import Joi from "joi";
import Result from "../model/result";
import "../db";
import User from "../model/user";



const studentSchema = Joi.object({
  student_id: Joi.number().required(),
  semester: Joi.string().required(),
  subjects: Joi.array().items(Joi.string().required()).required(),
  marks: Joi.array().items(Joi.number().integer().min(0).max(100)).required(),
});

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const addResult = async (req: Request, res: Response) => {
  try {
    const { error, value } = studentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const user_role = req.user.role;

    if (user_role !== 'admin' && user_role !== 'teacher') {
      return res.status(403).json({ message: 'Access forbidden' });
    }

    await Result.create({
      student_id: req.body.student_id,
      semester:req.body.semester,
      subjects: req.body.subjects,
      marks: req.body.marks,
    });

    res.json({ message: 'Result added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const updateResult = async (req: Request, res: Response) => {
  const { error } = studentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const studentId = req.params.student_id;
  const { subject, marks } = req.body;

  try {
    if (
      req.user.role !== "admin" &&
      req.user.role !== "teacher" &&
      req.user.id !== studentId
    ) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    const result = await Result.update(
      { subject, marks },
      { where: { student_id: studentId } }
    );
    if (result[0] === 0) {
      return res
        .status(404)
        .json({ message: `Result for student id ${studentId} not found` });
    }

    return res.json({ message: `Result for student id ${studentId} updated` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Fail to update result" });
  }
};



const getResult = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.student_id;

    const user = await User.findOne({ where: { id: studentId } });

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with student ID ${studentId} not found` });
    }

    const results = await Result.findAll({ where: { student_id: studentId } });

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: `Result for student ID ${studentId} not found` });
    }

    const output = {
      student: {
        name: user.role === 'student' ? 'Student Name' : user.name,
        student_id: studentId,
      },
      results: results.map(result => ({
        semester: result.semester,
        subjects: result.subjects && result.marks ? result.subjects.reduce((acc: any, subject: string, index: number) => {
          acc[subject] = result.marks[index];
          return acc;
        }, {}) : {},
      })),
    };

    return res.json(output);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch result" });
  }
};




export { addResult, updateResult, getResult };
