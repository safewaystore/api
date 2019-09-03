import {
  Resolver,
  Arg,
  Mutation,
  Query,
  FieldResolver,
  Root,
  Ctx,
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
import { IUser } from '../users/user.model';
import { Image } from '../../commom/interfaces/image';
import { AddCategoryImageInput } from './inputs/addCategoryImageInput';
import { FileS3 } from '../../commom/aws';
import { CategoryConst } from './category.consts';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly consts = CategoryConst) {}

  @Authorized('admin')
  @Query(() => [Category])
  public async allCategories() {
    return categoryModel.find({ parent: null });
  }

  @Authorized('admin')
  @Query(() => Category)
  public async getCategory(@Arg('id', () => String) id: string) {
    return categoryModel.findById(id);
  }

  @FieldResolver(() => Category)
  public async parent(@Root('_doc') category: Category) {
    return categoryModel.findById(category.parent);
  }

  @FieldResolver(() => [Category])
  public async children(@Root('_doc') category: Category) {
    return categoryModel.find({ parent: category._id });
  }

  // @Authorized('admin')
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
          const uploadedImage = await FileS3.upload(input.image, {
            path: 'category',
            id: category.id,
            variants: this.consts.variants.images,
          });

          return categoryModel
            .findByIdAndUpdate(
              category.id,
              {
                'image.path': uploadedImage,
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

  // @Authorized('admin')
  @Mutation(() => Category)
  @YupValidate(updateCategorySchema)
  public async updateCategory(
    @Arg('input', () => UpdateCategoryInput) input: UpdateCategoryInput
  ) {
    const category = await categoryModel.findOne({ _id: input.id });

    if (!category) throw new CategoryNotFound();

    if (input.image) {
      const imagePath = category.image.path;

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
              'image.path': uploadedImage,
            },
            {
              new: true,
            }
          );
        }
      );
    }

    return categoryModel.findByIdAndUpdate(
      category.id,
      {
        title: input.title,
        description: input.description,
        slug: input.slug,
        'image.path': input.image,
      },
      {
        new: true,
      }
    );
  }

  @Authorized('admin')
  @Mutation(() => Boolean)
  public async removeCategory(@Arg('id', () => String) id: string) {
    const category = await categoryModel.findOne({ _id: id });

    if (!category) throw new CategoryNotFound();

    return category.remove().then(res => res && true);
  }

  @Mutation(() => Image)
  public async addCategoryImage(
    @Arg('input', () => AddCategoryImageInput) input: AddCategoryImageInput
  ) {
    const category = await categoryModel.findOne({
      _id: input.categoryId,
    });

    if (!category) throw new CategoryNotFound();

    const uploadedImage = await FileS3.upload(input.image, {
      path: 'category',
      id: category.id,
      variants: this.consts.variants.images,
    });

    return categoryModel
      .findByIdAndUpdate(
        category.id,
        {
          'image.path': uploadedImage,
        },
        { new: true }
      )
      .then(categoryUpdated => {
        console.log('Ok!');
      });
  }
}
