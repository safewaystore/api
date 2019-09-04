import { InputType, Field } from 'type-graphql';

@InputType()
export class ProductInventaryInput {
  @Field(() => String, { nullable: true })
  public sku: string;
}
