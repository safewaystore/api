import {
  prop as Prop,
  Typegoose,
  Ref,
  arrayProp as ArrayProp,
} from 'typegoose';
import { Field, ObjectType, ID } from 'type-graphql';
import { Image } from '../../commom/interfaces/image';

@ObjectType()
export class Category extends Typegoose {
  public readonly _id: string;

  @Field(() => ID, { nullable: true })
  public readonly id: string;

  @Field(() => String)
  @Prop()
  public title: String;

  @Field(() => String, { nullable: true })
  @Prop()
  public description: string;

  @Field(() => Image, { nullable: true })
  @Prop()
  public image: Image;

  @Field(() => String)
  @Prop()
  public slug: string;

  @Field(() => Category, { nullable: true })
  @Prop({ ref: { name: 'Category' } })
  public parent: Ref<Category>;

  @Field(() => Category, { nullable: 'itemsAndList' })
  @ArrayProp({ itemsRef: { name: 'Category' } })
  public children: Array<Ref<Category>>;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}

export const categoryModel = new Category().getModelForClass(Category, {
  schemaOptions: { timestamps: true },
});
