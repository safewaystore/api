import {
  Resolver,
  Arg,
  Mutation,
  Query,
  FieldResolver,
  Root,
  Authorized,
} from 'type-graphql';
import { Category, categoryModel } from './category.model';
import { CreateCategoryInput } from './inputs/createCategory.input';
import { CategoryNotFound } from '../../commom/errors';
import { YupValidate } from '../../commom/decorators/yupValidation';
import {
  createCategorySchema,
  updateCategorySchema,
} from './category.validations';
import { UpdateCategoryInput } from './inputs/updateCategory.input';
import { Image } from '../../commom/interfaces/image';
import { FileS3 } from '../../commom/aws';
import { CategoryConst } from './category.consts';
import { Product, productModel } from '../products/product.model';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly consts = CategoryConst) {}

  @Query(() => [Category])
  public async getCategories() {
    return categoryModel.find({ parent: null });
  }

  // @Authorized('admin')
  @Query(() => Category)
  public async getCategory(@Arg('id', () => String) id: string) {
    return categoryModel.findById(id);
  }

  @FieldResolver(() => Image)
  public async image(@Root('_doc') category: Category) {
    if (!category.image) return null;
    return {
      path: await FileS3.url(category.image),

      variants: this.consts.variants.images.map(categoryVariant => ({
        name: categoryVariant.name,
        path: FileS3.url(category.image, categoryVariant.name),
        width: categoryVariant.width,
        height: categoryVariant.height,
      })),
    };
  }

  @FieldResolver(() => Category)
  public async parent(@Root('_doc') category: Category) {
    return categoryModel.findById(category.parent);
  }

  @FieldResolver(() => [Category])
  public async children(@Root('_doc') category: Category) {
    return categoryModel.find({ parent: category._id });
  }

  @FieldResolver(() => [Product])
  public async products(@Root('_doc') category: Category) {
    return productModel.find({
      _id: { $in: category.products },
    });
  }

  @Authorized('admin')
  @YupValidate(createCategorySchema)
  @Mutation(() => Category)
  public async createCategory(
    @Arg('input', () => CreateCategoryInput) input: CreateCategoryInput
  ) {
    if (input.parentId) {
      await categoryModel
        .findOne({
          _id: input.parentId,
        })
        .orFail(() => {
          throw new CategoryNotFound();
        });
    }

    return categoryModel
      .create({
        title: input.title,
        description: input.description,
        slug: input.slug,
        parent: input.parentId,
      })
      .then(async category => {
        if (category.parent) {
          await categoryModel.findByIdAndUpdate(
            { _id: category.parent },
            { $push: { children: category } }
          );
        }

        if (input.image) {
          console.log(input.image);
          const uploadedImage = await FileS3.upload(input.image, {
            path: 'category',
            id: category.id,
            variants: this.consts.variants.images,
          });

          return categoryModel
            .findByIdAndUpdate(
              category.id,
              {
                image: uploadedImage,
              },
              { new: true }
            )
            .then(categoryUpdated => {
              if (!categoryUpdated) throw new CategoryNotFound();
              return categoryUpdated;
            });
        }

        return category;
      });
  }

  @Authorized('admin')
  @Mutation(() => Category)
  @YupValidate(updateCategorySchema)
  public async updateCategory(
    @Arg('input', () => UpdateCategoryInput) input: UpdateCategoryInput
  ) {
    const category = await categoryModel.findOne({ _id: input.id });

    if (!category) throw new CategoryNotFound();

    if (input.image) {
      const imagePath = category.image;

      return FileS3.remove(imagePath, this.consts.variants.images).then(
        async () => {
          const uploadedImage = await FileS3.upload(input.image, {
            path: 'category',
            id: category.id,
            variants: this.consts.variants.images,
          });

          return categoryModel.findByIdAndUpdate(
            category.id,
            {
              title: input.title,
              description: input.description,
              slug: input.slug,
              image: uploadedImage,
            },
            {
              new: true,
            }
          );
        }
      );
    }

    return categoryModel.updateOne({ _id: category.id }, input, {
      new: true,
    });
  }

  @Authorized('admin')
  @Mutation(() => Boolean)
  public async removeCategory(@Arg('id', () => String) id: string) {
    const category = await categoryModel.findOne({ _id: id });

    if (!category) throw new CategoryNotFound();

    return category.remove().then(res => res && true);
  }
}
