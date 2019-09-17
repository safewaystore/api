import {
  Arg,
  Authorized,
  Mutation,
  Query,
  FieldResolver,
  Root,
  Resolver,
  ID,
  Ctx,
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
import { Image } from '../../commom/interfaces/image';
import { removeProductGalleryImage } from './inputs/removeProductGalleryImage.input';

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

  @FieldResolver(() => [Image])
  public async images(@Root('_doc') product: Product) {
    return product.images.map(image => ({
      path: FileS3.url(image),
      variants: this.consts.variants.images.map(variant => ({
        name: variant.name,
        path: FileS3.url(image, variant.name),
        width: variant.width,
        height: variant.height,
      })),
    }));
  }

  // @Authorized('admin')
  @YupValidate(createProductSchema)
  @Mutation(() => Product)
  public async createProduct(
    @Arg('input', () => CreateProductInput) input: CreateProductInput
  ) {
    const { images, ...data } = input;

    return productModel.create({ ...data }).then(product => {
      if (input.categories) {
        input.categories.map(async cat => {
          const category = await categoryModel.findById(cat);

          if (!category) throw new CategoryNotFound();

          await product.updateOne({ $push: { categories: category.id } });
          await category.updateOne({ $push: { products: product._id } });
        });
      }

      if (images) {
        categoryModel.find({
          _id: { $in: product.categories },
        });

        images.map(async img => {
          const uploadedImage = await FileS3.upload(img, {
            path: 'product/gallery',
            id: product.id,
            variants: this.consts.variants.images,
          });

          await product.updateOne({ $push: { images: uploadedImage } });
        });
      }

      return product;
    });
  }

  // @Authorized('admin')
  @YupValidate(updateProductSchema)
  @Mutation(() => Product)
  public async updateProduct(
    @Arg('input', () => UpdateProductInput) input: UpdateProductInput
  ) {
    const { images, ...data } = input;

    return productModel
      .findOneAndUpdate({ _id: input.id }, { ...data }, { new: true })
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

        if (images) {
          images.map(async img => {
            const uploadedImage = await FileS3.upload(img, {
              path: 'product/gallery',
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
  @Mutation(() => Boolean)
  public async removeProduct(@Arg('id', () => ID) id: string) {
    return productModel.findByIdAndRemove(id).then(res => res && true);
  }

  @Mutation(() => Boolean)
  public async removeProductGalleryImage(
    @Arg('input', () => removeProductGalleryImage)
    input: removeProductGalleryImage
  ) {
    const product = await productModel.findOne({
      _id: input.productId,
    });

    if (!product) throw new ProductNotFound();

    return FileS3.remove(input.imagePath, this.consts.variants.images).then(
      async () => {
        return product
          .updateOne({ $pull: { images: input.imagePath } })
          .then((res: any) => res.nModified);
      }
    );
  }
}
