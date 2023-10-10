import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { AppResolver } from './app.resolver';
import { UserRightGuard } from './guards/user_right.guard';
import { UserDetails } from './modules/user_details/user_details.entity';
import { UserDetailsModule } from './modules/user_details/user_details.module';
import { TypeOrmConfigService } from './typeorm_config_service/typeorm_config_service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      context: ({ req }) => ({
        req,
        user: new JwtService().decode(
          (req.headers.authorization as string).replace('Bearer ', ''),
        ),
      }),
    }),
    // I need to make `TypeOrmModule` asynchronous because not all the requests
    // will need a database connection, and the requests that need will carry
    // the information to initialize the database connection inside the
    // authorization header as a JWT.
    //
    // e.g.: Check the following payload inside the JWT.
    //
    // ```json
    // {
    //   "id": "2",
    //   "database": "test",
    //   "iat": 1696519539,
    //   "exp": 1696526739
    // }
    // ```
    //
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) =>
        await TypeOrmConfigService.getOrCreateDataSource(options),
    }),
    UserDetailsModule,
  ],
  providers: [
    AppResolver,
    {
      provide: APP_GUARD,
      // I'm using the factory method here since the repository needs to change based
      // on the customer. We have a separate database for each customer. If I use
      // `useClass: UserRightGuard` syntax here, I get `undefined` for `reflector`.
      useFactory: (reflector, repo) => new UserRightGuard(reflector, repo),
      inject: [Reflector, getRepositoryToken(UserDetails)],
      // If I make this request scoped, the guard will execute but that is not
      // the solution I want since not all the requests (e.g.: login) will have
      // user info in the request header.
      //
      // scope: Scope.REQUEST,
    },
  ],
})
export class AppModule {}
