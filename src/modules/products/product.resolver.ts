import { Arg } from 'type-graphql';
import { CreateProductInput } from './inputs/createProduct.input';
import { productModel } from './product.model';

export class ProductResolver {
  public async createProduct(
    @Arg('input', () => CreateProductInput) input: CreateProductInput
  ) {
    return productModel
      .create({
        name: input.name,
        stock: input.stock,
      })
      .then(async Category => {
        console.log('Ok');
      });
  }
}
