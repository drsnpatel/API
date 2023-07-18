import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import Semester from './semester';

class Result extends Model {
  public id!: number;
  public name!: string;
  public student_id!: number;
  public result_id!: number;
  public semester_id!: number;
  
}

Result.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    result_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    semester_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

  },
  {
    tableName: 'results',
    sequelize,
    modelName: 'Result',
    timestamps: false,
  }
);
Result.belongsTo(Semester, { foreignKey: 'semester_id', as: 'Semester' });
export default Result;
