import { Arg, Authorized, Mutation } from 'type-graphql';
import { CreateProductInput } from './inputs/createProduct.input';
import { productModel, Product } from './product.model';
import { createProductSchema } from './product.validations';
import { YupValidate } from '../../commom/decorators/yupValidation';
import { Category } from '../categories/category.model';

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
      // .then(product => {
      //   if (!input.categories) {
      //     input.categories.forEach(category => {
      //       product.categories.push(category.id);
      //     });
      //     product.save();
      //   }

      //   return product;
      // });
  }
}
