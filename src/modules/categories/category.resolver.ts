import { Resolver, Arg, Mutation, Query } from 'type-graphql';
import { Category, categoryModel } from './category.model';
import { CreateCategoryInput } from './inputs/createCategory.input';
import { CategoryNotFound } from '../../commom/errors';

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => [Category])
  public async allCategories() {
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

  @Mutation(() => Boolean)
  public async removeCategory(@Arg('id', () => String) id: string) {
    const category = await categoryModel.findOne({ _id: id });

    if (!category) throw new CategoryNotFound();

    return category.remove().then(res => res && true);
  }
}
