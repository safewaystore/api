import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class Variant {
  @Field(() => String, { nullable: true })
  public name: string;

  @Field(() => String, { nullable: true })
  public width: string;

  @Field(() => String, { nullable: true })
  public height: string;

  @Field(() => String, { nullable: true })
  public path: string;
}
