import { ObjectType, Field, ID } from 'type-graphql';
import { Variant } from './variant';
import { prop as Prop } from 'typegoose';

@ObjectType()
export class Image {
  @Field(() => ID, { nullable: true })
  public id: string;

  @Field(() => String)
  @Prop()
  public path: string;

  @Field(() => String, { nullable: true })
  public original: string;

  @Field(() => Variant, { nullable: true })
  public variants: Variant;
}

// interface IVariants {
//   height: string;
//   key: 'thumb' | 'medium' | 'large';
//   path: string;
//   width: string;
// }

// export interface IImage {
//   id: string;
//   path: string;
//   variants: IVariants[];
// }
