import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import type { Request } from 'express';
import { DataSource, DataSourceOptions } from 'typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly databaseID: string;

  constructor(
    @Inject(REQUEST) readonly request: Request & { user: { database: string } },
  ) {
    this.databaseID = request.user.database;
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    //! Do not give a name here, or you should give a name to all the
    //! TypeOrm.forFeature.
    return {
      database: this.databaseID,
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      synchronize: false,
      logging: ['error'],
      autoLoadEntities: true,
      migrations: ['dist/migrations/*{.js,.ts}'],
      migrationsRun: true,
    };
  }

  static async getOrCreateDataSource(
    options: DataSourceOptions,
  ): Promise<DataSource> {
    const dataSource = new DataSource(options);

    await dataSource.initialize();

    return dataSource;
  }
}
