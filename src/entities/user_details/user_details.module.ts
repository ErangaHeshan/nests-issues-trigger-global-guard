import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDetails } from './user_details.entity';
import { UserDetailsResolver } from './user_details.resolver';

const userDetailsRepository = TypeOrmModule.forFeature([UserDetails]);

@Module({
  imports: [userDetailsRepository],
  providers: [UserDetailsResolver],
  exports: [userDetailsRepository],
})
export class UserDetailsModule {}
