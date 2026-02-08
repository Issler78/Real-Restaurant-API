import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';
import 'dotenv/config'
import { DataSource } from 'typeorm';

const ormconfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [ __dirname + '/**/*.entity.{ts,js}' ],
  migrationsTableName: 'migrations',
  migrations: [ __dirname + '/migrations/**/*.{ts,js}' ],
};

const AppDataSource = new DataSource(ormconfig);

export { AppDataSource };

export default ormconfig;
