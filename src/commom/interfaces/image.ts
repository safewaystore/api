import { ObjectType, Field, ID } from 'type-graphql';
import { Variant } from './variant';
import { prop as Prop } from 'typegoose';

@ObjectType()
export class Image {
  @Field(() => ID, { nullable: true })
  public id: string;

  @Field(() => String, { nullable: true })
  @Prop()
  public path: string;

  @Field(() => [Variant], { nullable: true })
  public variants: Variant[];
}
