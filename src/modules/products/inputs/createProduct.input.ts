import { InputType, Field } from 'type-graphql';
import { ProductDescriptionInput } from './productDescription.input';
import { ProductInventaryInput } from './productInventary.input';
import { Status } from '../enums/status.enum';
import { GraphQLUpload } from 'graphql-upload';
import { Stream } from 'stream';
import { Image } from '../../../commom/interfaces/image';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  public title: string;

  @Field(() => String)
  public slug: string;

  @Field(() => Status, { nullable: true })
  public status: Status;

  @Field(() => ProductDescriptionInput, { nullable: true })
  public description: ProductDescriptionInput;

  @Field(() => ProductInventaryInput, { nullable: true })
  public inventary: ProductInventaryInput;

  @Field(() => [String], { nullable: true })
  public categories: string[];

  @Field(() => GraphQLUpload, { nullable: true })
  public images: string[];
}
