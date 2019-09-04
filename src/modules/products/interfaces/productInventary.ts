import { ObjectType, Field } from 'type-graphql';
import { prop as Prop } from 'typegoose';

@ObjectType()
export class ProductInventary {
  @Field(() => String, { nullable: true })
  @Prop()
  public sku: string;
}
