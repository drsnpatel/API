import User from './user';
import Result from './result';
import Semester from './semester';

// Define associations after initializing all models
Result.belongsTo(Semester, { foreignKey: 'semester_id', as: 'Semester' });
Result.belongsTo(User, { foreignKey: 'student_id', as: 'User' });

User.hasMany(Result, { foreignKey: 'student_id', as: 'Results' });

export { User, Result, Semester };
