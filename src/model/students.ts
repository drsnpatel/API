import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import Result from './result';

class Student extends Model {
  public student_id!: number;
  public name!: string;
  // Add other student properties here

    // Define associations
    static associate() {
        Student.hasMany(Result, { foreignKey: 'studentId', as: 'results' });
      }

}


Student.init(
  {
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Add other student attributes here
  },
  {
    sequelize,
    tableName: 'students',
    modelName: 'Student',
  }
);

export default Student;
