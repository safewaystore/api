import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class UpdateCategoryInput {
  @Field(() => ID)
  public id: String;

  @Field(() => String)
  public title: string;

  @Field(() => String, { nullable: true })
  public description: string;

  @Field(() => String, { nullable: true })
  public image: string;

  @Field(() => String)
  public slug: string;

  @Field(() => ID, { nullable: true })
  public parentId: string;
}
