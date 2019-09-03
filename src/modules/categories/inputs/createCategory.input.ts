import { InputType, Field, ID } from 'type-graphql';
import { GraphQLUpload } from 'graphql-upload';
import { Stream } from 'aws-sdk/clients/glacier';

@InputType()
export class CreateCategoryInput {
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
