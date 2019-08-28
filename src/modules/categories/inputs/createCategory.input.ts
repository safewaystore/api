import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  public title: string;

  @Field(() => String, { nullable: true })
  public description: string;

  @Field(() => String, { nullable: true })
  public image: string;

  @Field(() => ID, { nullable: true })
  public parentId: string;
}
