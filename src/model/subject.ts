import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import Result from './result';

class Subject extends Model {
  public student_id!: number;
  public name!: string;
  public subject! : string;
  public marks!: number;

}

Subject.init(
  {
    student_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    marks: {
        type: DataTypes.INTEGER,
        allowNull:true,
    }

  },
  {
    tableName: 'subjects',
    sequelize,
    timestamps: false,
  }
);

Subject.hasMany(Result, { foreignKey: 'student_id' });
Result.belongsTo(Subject, { foreignKey: 'student_id' });

export default Subject;
