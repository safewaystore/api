import { ObjectType, Field, ID } from 'type-graphql';
import { Variant } from './variant';

@ObjectType()
export class Image {
  @Field(() => ID, { nullable: true })
  public id: string;

  @Field(() => String, { nullable: true })
  public original: string;

  @Field(() => Variant, { nullable: true })
  public variants: Variant;
}
