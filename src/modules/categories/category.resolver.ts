import { Resolver, Arg, Mutation, Query } from 'type-graphql';
import { Category, categoryModel } from './category.model';
import { CreateCategoryInput } from './inputs/createCategory.input';
import { CategoryNotFound } from '../../commom/errors';
import { YupValidate } from '../../commom/decorators/yupValidation';
import { createCategorySchema } from './category.validations';

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => [Category])
  public async allCategories() {
    return categoryModel.find({});
  }

  @Query(() => Category)
  public async getCategory(@Arg('id', () => String) id: string) {
    return categoryModel.findById(id);
  }

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

  @Mutation(() => Boolean)
  public async removeCategory(@Arg('id', () => String) id: string) {
    const category = await categoryModel.findOne({ _id: id });

    if (!category) throw new CategoryNotFound();

    return category.remove().then(res => res && true);
  }
}
