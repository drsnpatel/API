import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';

class Semester extends Model {
  public id!: number;
  public semester_id!: number;
  public semester_name!: string;
  public subject!: string;
  public marks!: number;

}

Semester.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    semester_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    semester_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    marks: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: 'semesters',
    modelName: 'Semester',
    timestamps: false,
  }
);

export default Semester;
