import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';
import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import MainSeeder from './database/seeders/mainSeeder';

dotenv.config(); // load env variables

const ormconfig: PostgresConnectionOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [ __dirname + '/**/*.entity.{ts,js}' ],
  migrationsTableName: 'migrations',
  migrations: [ __dirname + '/database/migrations/**/*.{ts,js}' ],
  seeds: [ MainSeeder ]
};

const AppDataSource = new DataSource(ormconfig);

export { AppDataSource };

export default ormconfig;
