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
  @Field(() => ID)
  public id: string;

  @Prop()
  name: String;

  @Field(() => String, { nullable: true })
  @Prop()
  description: string;

  // @Field(type => Product, { nullable: true })
  // @Prop({ ref: { name: 'Product' } })
  // public product: Ref<Product>;

  @Field(() => String, { nullable: true })
  image: string;

  @Field(() => [Category], { nullable: true })
  @Prop({ ref: { name: 'Category' } })
  public parentId: Ref<Category>;

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
