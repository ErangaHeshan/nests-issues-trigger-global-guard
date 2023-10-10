import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDetails } from 'src/modules/user_details/user_details.entity';
import { Repository } from 'typeorm';

export const RequireRights = Reflector.createDecorator<string[]>();

/**
 * Prevents users without the required rights to query or mutate data.
 */
@Injectable()
export class UserRightGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(UserDetails)
    private userDetailsRepo: Repository<UserDetails>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRights = this.reflector.getAllAndOverride(RequireRights, [
        context.getHandler(),
        context.getClass(),
      ]);
      // Returns `true` if there is no right specified as required.
      if (!requiredRights) return true;

      const ctx = GqlExecutionContext.create(context).getContext();
      const { user } = ctx;
      const { right } = await this.userDetailsRepo.findOne({
        where: { id: user.id },
      });
      return requiredRights.some((r) => r == right);
    } catch (err) {
      return false;
    }
  }
}
