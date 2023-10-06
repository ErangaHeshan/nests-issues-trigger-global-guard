import { Int, Query, Resolver } from '@nestjs/graphql';
import { RequireRights } from 'src/guards/user_right.guard';

@Resolver(() => Int)
export class AppResolver {
  @RequireRights(['subscription'])
  @Query(() => [Int])
  public generateInt(): number[] {
    return [1, 1];
  }
}
