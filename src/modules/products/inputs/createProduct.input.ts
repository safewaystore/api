import { InputType, Field, ID } from 'type-graphql';
import { ProductDescriptionInput } from './productDescription.input';
import { ProductInventaryInput } from './productInventary.input';
import { Category } from '../../categories/category.model';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  public title: string;

  @Field(() => String)
  public slug: string;

  @Field(() => ProductDescriptionInput)
  public description: ProductDescriptionInput;

  @Field(() => ProductInventaryInput)
  public inventary: ProductInventaryInput;

  @Field(() => [String])
  public categories: string[];

  // @Field(() => [Category])
  // public categories: Array<Category>;

  // @Field(() => GraphQLUpload, { nullable: true })
  // public image: Stream;
}
