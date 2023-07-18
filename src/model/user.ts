import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import Result from './result';

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public profilePictureUrl!: string;
  public passwordResetOTP!: number | null;
  public passwordResetOTPExpire!: Date | null;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('admin', 'teacher', 'student'),
      allowNull: false,
    },
    profilePictureUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetOTP: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    passwordResetOTPExpire: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    sequelize,
    modelName: 'User',
    timestamps: false,
  }
);

export default User;
