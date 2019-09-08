import {
  Arg,
  Authorized,
  Mutation,
  Query,
  FieldResolver,
  Root,
  Resolver,
  InputType,
  ID,
} from 'type-graphql';
import { CreateProductInput } from './inputs/createProduct.input';
import { productModel, Product } from './product.model';
import { createProductSchema } from './product.validations';
import { YupValidate } from '../../commom/decorators/yupValidation';
import { Category, categoryModel } from '../categories/category.model';
import { CategoryNotFound, ProductNotFound } from '../../commom/errors';
import { UpdateProductInput } from './inputs/updateProduct.input';

@Resolver(() => Product)
export class ProductResolver {
  @Authorized('admin')
  @Query(() => [Product])
  public async getProducts() {
    return productModel.find({});
  }

  @Query(() => Product)
  public async getProduct(@Arg('id', () => ID) id: string) {
    return productModel.findById(id);
  }

  @FieldResolver(() => [Category])
  public async categories(@Root('_doc') product: Product) {
    return categoryModel.find({
      _id: { $in: product.categories },
    });
  }

  @Authorized('admin')
  @YupValidate(createProductSchema)
  @Mutation(() => Product)
  public async createProduct(
    @Arg('input', () => CreateProductInput) input: CreateProductInput
  ) {
    return productModel.create(input).then(product => {
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

  // @Authorized('admin')
  @Mutation(() => Boolean)
  public async removeProduct(@Arg('id', () => ID) id: string) {
    return productModel.findByIdAndRemove(id).then(res => res && true);
  }
}
