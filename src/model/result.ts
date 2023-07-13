import { Model, DataTypes } from "sequelize";
import sequelize from "../db";
import User from "./user";

class Result extends Model {
  public id!: number;
  public student_id!: number;
  public subjects!: string[];
  public marks!: number[];
  public semester!: string;

  static associate() {
    Result.belongsTo(User, { foreignKey: "student_id", as: "User" });
  }
}

Result.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    semester: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subjects: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    marks: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    },
  },
  {
    tableName:"results",
    sequelize,
    modelName: "Result",
    timestamps: false,
  }
);

export default Result;
