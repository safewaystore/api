import {
  Arg,
  Authorized,
  Mutation,
  Query,
  FieldResolver,
  Root,
  Resolver,
  ID,
} from 'type-graphql';
import { CreateProductInput } from './inputs/createProduct.input';
import { productModel, Product } from './product.model';
import {
  createProductSchema,
  updateProductSchema,
} from './product.validations';
import { YupValidate } from '../../commom/decorators/yupValidation';
import { Category, categoryModel } from '../categories/category.model';
import { CategoryNotFound, ProductNotFound } from '../../commom/errors';
import { UpdateProductInput } from './inputs/updateProduct.input';
import { FileS3 } from '../../commom/aws';
import { ProductConst } from './category.consts';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly consts = ProductConst) {}

  @Authorized('admin')
  @Query(() => [Product])
  public async getProducts() {
    return productModel.find({});
  }

  @Query(() => Product)
  public async getProduct(@Arg('id', () => ID) id: string) {
    return productModel.findById(id).orFail(() => new ProductNotFound());
  }

  @FieldResolver(() => [Category])
  public async categories(@Root('_doc') product: Product) {
    return categoryModel.find({
      _id: { $in: product.categories },
    });
  }

  // @Authorized('admin')
  @YupValidate(createProductSchema)
  @Mutation(() => Product)
  public async createProduct(
    @Arg('input', () => CreateProductInput) input: CreateProductInput
  ) {
    return productModel
      .create({ title: input.title, slug: input.slug })
      .then(product => {
        if (input.categories) {
          input.categories.map(async cat => {
            const category = await categoryModel.findById(cat);

            if (!category) throw new CategoryNotFound();

            await product.updateOne({ $push: { categories: category.id } });
            await category.updateOne({ $push: { products: product._id } });
          });
        }

        if (input.images) {
          // console.log(input.images);
          input.images.map(async img => {
            // console.log(img);
            const uploadedImage = await FileS3.upload(img, {
              path: 'product',
              id: product.id,
              variants: this.consts.variants.images,
            });

            await product.updateOne({ $push: { images: uploadedImage } });
          });
        }

        return product;
      });
  }

  @Authorized('admin')
  @YupValidate(updateProductSchema)
  @Mutation(() => Product)
  public async updateProduct(
    @Arg('input', () => UpdateProductInput) input: UpdateProductInput
  ) {
    return productModel
      .findOneAndUpdate({ _id: input.id }, input, {
        new: true,
      })
      .orFail(() => new ProductNotFound())
      .then(async (product: any) => {
        if (input.categories) {
          input.categories.map(async cat => {
            const category = await categoryModel.findById(cat);

            if (!category) throw new CategoryNotFound();

            await product.updateOne({ $push: { categories: category.id } });
            await category.updateOne({ $push: { products: product._id } });
          });
        }

        return product;
      });
  }

  @Authorized('admin')
  @Mutation(() => Boolean)
  public async removeProduct(@Arg('id', () => ID) id: string) {
    return productModel.findByIdAndRemove(id).then(res => res && true);
  }
}
