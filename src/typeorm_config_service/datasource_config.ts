import { DataSource, DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  database: 'test',
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  synchronize: false,
  logging: ['error'],
  migrations: ['dist/migrations/*{.js,.ts}'],
  entities: ['dist/entities/**/**.entity{.ts,.js}'],
  migrationsRun: true,
};

export const dataSource = new DataSource(config);
