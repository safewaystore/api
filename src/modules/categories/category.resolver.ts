import { Resolver, Arg, Mutation, Query } from 'type-graphql';
import { Category, categoryModel } from './category.model';
import { CreateCategoryInput } from './inputs/createCategory.input';
import { CategoryNotFound } from '../../commom/errors';
import { dedentBlockStringValue } from 'graphql/language/blockString';

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => [Category])
  public async allCategories() {
    console.log(categoryModel.find({}));
    return categoryModel.find({});
  }

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

    const category = categoryModel.create(input);
    return category;
  }
}
