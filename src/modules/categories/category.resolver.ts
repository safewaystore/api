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

@Resolver(() => Category)
export class CategoryResolver {
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
        image: input.image,
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

    return categoryModel.findByIdAndUpdate(
      input.id,
      {
        title: input.title,
        description: input.description,
        image: input.image,
        slug: input.slug,
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

  // public addCategoryImage(@Arg('input', () => AddEventImageInput) input: AddEvent){}
}
