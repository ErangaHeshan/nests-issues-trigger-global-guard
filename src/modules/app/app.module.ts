import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../typeorm_config_service/typeorm_config_service';
import { SubscriptionModule } from '../subscription/subscription.module';
import { UserDetailsModule } from '../user_details/user_details.module';
import { AppResolver } from './app.resolver';

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
    SubscriptionModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
