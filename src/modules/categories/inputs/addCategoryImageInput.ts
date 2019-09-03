import { InputType, Field, ID } from 'type-graphql';
import { GraphQLUpload } from 'graphql-upload';
import { Stream } from 'stream';

@InputType()
export class AddCategoryImageInput {
  @Field(() => ID)
  public categoryId: string;

  @Field(() => GraphQLUpload)
  public image: Stream;
}
