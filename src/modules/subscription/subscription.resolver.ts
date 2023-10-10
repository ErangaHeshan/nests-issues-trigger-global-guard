import { UseGuards } from '@nestjs/common';
import { Float, Mutation, Resolver } from '@nestjs/graphql';
import { RequireRights, UserRightGuard } from 'src/guards/user_right.guard';

@UseGuards(UserRightGuard)
@Resolver(() => Float)
export class SubscriptionResolver {
  @RequireRights(['subscription'])
  @Mutation(() => Float)
  async updateCard(): Promise<number> {
    return await Promise.resolve(1.0);
  }
}
