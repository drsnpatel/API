import express from 'express';
import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import User from './user';

const app = express();

class Result extends Model {
  public id!: number;
  public student_id!: number;
  public subject!: string;
  public marks!: number;
}

Result.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  marks: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'results',
  sequelize,
  timestamps: false,
});

// Define the association between User and Result models
User.hasMany(Result, { foreignKey: 'student_id' });
Result.belongsTo(User, { foreignKey: 'student_id' });

export default Result;