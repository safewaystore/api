import { Field, ID, InputType } from 'type-graphql';
import { GraphQLUpload } from 'graphql-upload';
import { Stream } from 'stream';

@InputType()
export class UpdateCategoryInput {
  @Field(() => ID)
  public id: String;

  @Field(() => String)
  public title: string;

  @Field(() => String, { nullable: true })
  public description: string;

  @Field(() => GraphQLUpload, { nullable: true })
  public image: Stream;

  @Field(() => String)
  public slug: string;

  @Field(() => ID, { nullable: true })
  public parentId: string;
}
