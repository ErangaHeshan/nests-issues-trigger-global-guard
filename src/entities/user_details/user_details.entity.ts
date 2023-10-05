import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class UserDetails {
  @Field()
  @PrimaryColumn()
  id: number;

  @Field()
  @Column()
  right: string;
}
