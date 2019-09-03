import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class Variant {
  @Field(() => String, { nullable: true })
  public name: string;

  @Field(() => String, { nullable: true })
  public path: string;
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
