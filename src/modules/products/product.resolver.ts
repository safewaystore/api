import { Arg, Authorized, Mutation } from 'type-graphql';
import { CreateProductInput } from './inputs/createProduct.input';
import { productModel, Product } from './product.model';
import { createProductSchema } from './product.validations';
import { YupValidate } from '../../commom/decorators/yupValidation';
import { Category, categoryModel } from '../categories/category.model';
import { CategoryNotFound } from '../../commom/errors';

export class ProductResolver {
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
          input.categories.forEach(async cat => {
            const category = await categoryModel.findById(cat);

            if (!category) throw new CategoryNotFound();

            product.categories.push(category.id);
            category.products.push(product._id);
            await category.save();
            await product.save();
          });
        }

        return product;
      });
  }
}
