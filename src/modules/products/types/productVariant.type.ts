import { Typegoose, prop as Prop } from 'typegoose';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class ProductVariant extends Typegoose {
  public _id: string;

  @Prop()
  @Field(() => ID)
  public id?: string;
}
