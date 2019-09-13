import { Typegoose, prop as Prop, Ref, arrayProp } from 'typegoose';
import { ID, Field, ObjectType } from 'type-graphql';
import { Category } from '../categories/category.model';
import { ProductInventary } from './interfaces/productInventary';
import { ProductDescription } from './interfaces/productDescription';
import { Status } from './enums/status.enum';
import { Image } from '../../commom/interfaces/image';
import { ImageSchema } from './interfaces/image';
import { Stream } from 'stream';

@ObjectType()
export class Product extends Typegoose {
  public readonly _id: string;

  @Field(() => ID, { nullable: true })
  public readonly id: string;

  @Field(() => String, { nullable: true })
  @Prop()
  public title: string;

  @Field(() => String, { nullable: true })
  @Prop()
  public slug: string;

  @Field(() => Status, { nullable: true })
  @Prop({ default: 'published' })
  public status: Status;

  @Field(() => ProductDescription, { nullable: true })
  @Prop({ _id: false })
  public description: ProductDescription;

  @Field(() => ProductInventary, { nullable: true })
  @Prop({ _id: false })
  public inventary: ProductInventary;

  @Field(() => [Image], { nullable: 'itemsAndList' })
  @arrayProp({ items: String })
  // @Prop()
  public images: string[];

  @Field(() => [Category], { nullable: 'itemsAndList' })
  @arrayProp({ itemsRef: { name: 'Category' } })
  public categories: Array<Ref<Category>>;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}

export const productModel = new Product().getModelForClass(Product, {
  schemaOptions: { timestamps: true },
});
