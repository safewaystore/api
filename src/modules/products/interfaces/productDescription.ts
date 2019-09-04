import { ObjectType, Field } from 'type-graphql';
import { prop as Prop } from 'typegoose';

@ObjectType()
export class ProductDescription {
  @Field(() => String, { nullable: true })
  @Prop()
  public small: string;

  @Field(() => String, { nullable: true })
  @Prop()
  public large: string;
}
