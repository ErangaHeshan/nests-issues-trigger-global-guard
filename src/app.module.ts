import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, Scope } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UserDetails } from './entities/user_details/user_details.entity';
import { UserDetailsModule } from './entities/user_details/user_details.module';
import { UserRightGuard } from './guards/user_right.guard';
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
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) =>
        await TypeOrmConfigService.getOrCreateDataSource(options),
    }),
    UserDetailsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      // I'm using the factory method here since the repository needs to change based
      // on the customer. We have a separate database for each customer. If I use
      // `useClass: UserRightGuard` syntax here, I get `undefined` for `reflector`.
      useFactory: (reflector, repo) => new UserRightGuard(reflector, repo),
      inject: [Reflector, getRepositoryToken(UserDetails)],
      // If I make this request scoped, the guard will execute.
      // scope: Scope.REQUEST,
    },
  ],
})
export class AppModule {}
