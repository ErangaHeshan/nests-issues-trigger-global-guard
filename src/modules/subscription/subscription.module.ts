import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDetails } from '../user_details/user_details.entity';
import { SubscriptionResolver } from './subscription.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserDetails])],
  providers: [SubscriptionResolver],
})
export class SubscriptionModule {}
