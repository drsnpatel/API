import { Request, Response } from "express";
import Joi from "joi";
import Result from "../model/result";
import "../db";
import User from "../model/user";


import Semester from "../model/semester";



const studentSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  student_id: Joi.number().required(),
  result_id: Joi.number().required(),
  semester_id: Joi.number().required(),
  
 
});

const semesterSchema = Joi.object({
  semester_id: Joi.number().required(),
  semester_name: Joi.string().required(),
  subject: Joi.string().required(),
  marks: Joi.number().required()
})

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
      id:  req.body.id,
      name: req.body.name,
      student_id: req.body.student_id,
      result_id: req.body.result_id,
      semester_id:req.body.semester_id,
    });

    res.json({ message: 'Result added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addSemester = async (req: Request, res: Response) => {
  try {
    const { error, value } = semesterSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const user_role = req.user.role;

    if (user_role !== 'admin' && user_role !== 'teacher') {
      return res.status(403).json({ message: 'Access forbidden' });
    }

    await Semester.create({
      semester_id: req.body.semester_id,
      semester_name: req.body.semester_name,
      subject: req.body.subject,
      marks: req.body.marks
    });

    res.json({ message: 'semester added successfully' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
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

    const results = await Result.findAll({
      where: { student_id: studentId },
      include: {
        model: Semester, // Include the associated Semester model
        as: 'Semester', // Use the correct alias 'Semester'
      },
    });

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: `Result for student ID ${studentId} not found` });
    }

    const output = {
      student: {
        name: user.role === 'student' ? user.name : results[0]?.name,
        student_id: studentId,
      },
      results: results.map((result: any) => ({
        semester_id: result.Semester.id,
        semester_name: result.Semester.semester_name,
        subject: result.Semester.subject,
        marks: result.Semester.marks,
      })),
    };

    return res.json(output);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch result' });
  }
};








export { addResult, updateResult, getResult, addSemester };
