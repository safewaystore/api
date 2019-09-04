import { InputType, Field } from 'type-graphql';

@InputType()
export class ProductDescriptionInput {
  @Field(() => String, { nullable: true })
  public small: string;

  @Field(() => String, { nullable: true })
  public large: string;
}
