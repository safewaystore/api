import { Typegoose, prop as Prop, Ref, arrayProp } from 'typegoose';
import { ID, Field, ObjectType } from 'type-graphql';
import { Category } from '../categories/category.model';
import { ProductInventary } from './interfaces/productInventary';
import { ProductDescription } from './interfaces/productDescription';

@ObjectType()
export class Product extends Typegoose {
  public readonly _id: string;

  @Field(() => ID, { nullable: true })
  @Prop()
  public id: string;

  @Field(() => String, { nullable: true })
  @Prop()
  public title: string;

  @Field(() => String, { nullable: true })
  @Prop()
  public slug: string;

  @Field(() => ProductDescription, { nullable: true })
  @Prop({ _id: false })
  public description: ProductDescription;

  @Field(() => String)
  @Prop()
  public status: string;

  @Field(() => ProductInventary, { nullable: true })
  @Prop({ _id: false })
  public inventary: ProductInventary;

  @Field(() => [Category], { nullable: 'itemsAndList' })
  @arrayProp({ itemsRef: { name: 'Category' } })
  public categories: Array<Ref<Category>>;
}

export const productModel = new Product().getModelForClass(Product, {
  schemaOptions: { timestamps: true },
});
