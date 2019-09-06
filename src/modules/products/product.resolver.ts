import {
  Arg,
  Authorized,
  Mutation,
  Query,
  FieldResolver,
  Root,
} from 'type-graphql';
import { CreateProductInput } from './inputs/createProduct.input';
import { productModel, Product } from './product.model';
import { createProductSchema } from './product.validations';
import { YupValidate } from '../../commom/decorators/yupValidation';
import { Category, categoryModel } from '../categories/category.model';
import { CategoryNotFound, ProductNotFound } from '../../commom/errors';
import { UpdateProductInput } from './inputs/updateProduct.input';

export class ProductResolver {
  @Authorized('admin')
  @Query(() => [Product])
  public async getProducts() {
    return productModel.find({});
  }

  // @FieldResolver()
  // public async categories(@Root('_doc') product: Product) {
  //   return categoryModel.find({
  //     products: product._id,
  //   });
  // }

  @Authorized('admin')
  @YupValidate(createProductSchema)
  @Mutation(() => Product)
  public async createProduct(
    @Arg('input', () => CreateProductInput) input: CreateProductInput
  ) {
    return productModel
      .create({
        title: input.title,
        slug: input.slug,
        description: {
          small: input.description.small,
          large: input.description.large,
        },
        inventary: {
          sku: input.inventary.sku,
        },
      })
      .then(product => {
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
    const product = await productModel.findOne({ _id: input.id });

    if (!product) throw new ProductNotFound();

    return productModel.findByIdAndUpdate(
      product.id,
      {
        title: input.title,
        slug: input.slug,
        description: {
          small: input.description.small,
          large: input.description.large,
        },
        inventary: {
          sku: input.inventary.sku,
        },
      },
      {
        new: true,
      }
    );
  }
}
