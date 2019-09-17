import { Field, InputType, ID } from 'type-graphql';

@InputType()
export class removeProductGalleryImage {
  @Field(() => ID)
  public productId: string;

  @Field(() => String)
  public imagePath: string;
}
