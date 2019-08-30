import {
  prop as Prop,
  Typegoose,
  Ref,
  arrayProp as ArrayProp,
} from 'typegoose';
import { Field, ObjectType, ID } from 'type-graphql';
import { User } from '../users/user.model';

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

  // @Field(type => Product, { nullable: true })
  // @Prop({ ref: { name: 'Product' } })
  // public product: Ref<Product>;

  @Field(() => String, { nullable: true })
  @Prop()
  public image: string;

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
