import { Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { RequireRights } from 'src/guards/user_right.guard';
import { Repository } from 'typeorm';
import { UserDetails } from './user_details.entity';

@Resolver(() => UserDetails)
export class UserDetailsResolver {
  constructor(
    @InjectRepository(UserDetails)
    private userDetailsRepository: Repository<UserDetails>,
  ) {}

  @RequireRights(['subscription'])
  @Query(() => [UserDetails])
  public async userDetails(): Promise<UserDetails[]> {
    return await this.userDetailsRepository.find();
  }
}
