import { InputType, Field } from 'type-graphql';
import { Stream } from 'stream';
import { GraphQLUpload } from 'graphql-upload';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  public name: string;

  @Field(() => String)
  public sku: string;

  @Field(() => String)
  public shortDescription: string;

  @Field(() => String)
  public stock: string;

  @Field(() => String)
  public price: number;

  @Field(() => GraphQLUpload, { nullable: true })
  public image: Stream;
}
