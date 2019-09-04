import { Typegoose, prop as Prop, Ref, arrayProp } from 'typegoose';
import { ID, Field, ObjectType } from 'type-graphql';
import { Image } from '../../commom/interfaces/image';
import { Category } from '../categories/category.model';

@ObjectType()
export class Product extends Typegoose {
  @Field(() => ID)
  @Prop()
  public id: string;

  @Field(() => String)
  @Prop()
  public name: string;

  @Field(() => String)
  @Prop()
  public sku: string;

  @Field(() => String)
  @Prop()
  public shortDescription: string;

  @Field(() => String)
  @Prop()
  public stock: string;

  @Field(() => String)
  @Prop()
  public price: number;

  @Field(() => Image, { nullable: true })
  @Prop()
  public image: Image;

  @Field(() => [Category], { nullable: 'itemsAndList' })
  @arrayProp({ itemsRef: { name: 'Category' } })
  public categories: Array<Ref<Category>>;
}

export const productModel = new Product().getModelForClass(Product, {
  schemaOptions: { timestamps: true },
});
