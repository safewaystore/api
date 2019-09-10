import { InputType, Field, ID } from 'type-graphql';
import { ProductDescriptionInput } from './productDescription.input';
import { ProductInventaryInput } from './productInventary.input';
import { Status } from '../enums/status.enum';

@InputType()
export class UpdateProductInput {
  @Field(() => ID)
  public id: String;

  @Field(() => String)
  public title: string;

  @Field(() => String)
  public slug: string;

  @Field(() => Status)
  public status: Status;

  @Field(() => ProductDescriptionInput, { nullable: true })
  public description: ProductDescriptionInput;

  @Field(() => ProductInventaryInput, { nullable: true })
  public inventary: ProductInventaryInput;

  @Field(() => [String], { nullable: true })
  public categories: string[];
}
