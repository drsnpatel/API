import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE!,
  process.env.USER!,
  process.env.PASSWORD!,
  
  {
    host: process.env.HOST,
    port: Number(process.env.PORT),
    dialect: 'postgres',
    logging:false
  }
);



sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to the db.');
  })
  .catch((err) => {
    console.error('enable to connect', err);
  });

export default sequelize;
