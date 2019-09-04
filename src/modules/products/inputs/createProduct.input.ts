import { InputType, Field } from 'type-graphql';
import { Stream } from 'stream';
import { GraphQLUpload } from 'graphql-upload';
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

  // @Field(() => Category)
  // public categories: Category;

  // @Field(() => GraphQLUpload, { nullable: true })
  // public image: Stream;
}
