import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class Variant {
  @Field(() => String, { nullable: true })
  public name: string;

  @Field(() => String, { nullable: true })
  public path: string;
}