import * as yup from 'yup';
import { categoryModel } from './category.model';

export const createCategorySchema = () =>
  yup.object().shape({
    title: yup
      .string()
      .trim()
      .required(),

    slug: yup
      .string()
      .trim()
      .required()
      .test({
        name: 'unique',
        message: '${path} must be unique',
        exclusive: true,
        test: async value => {
          return categoryModel.findOne({ slug: value }).then(category => {
            if (category) {
              return false;
            }
            return true;
          });
        },
      }),
  });

export const updateCategorySchema = () =>
  yup.object().shape({
    title: yup
      .string()
      .trim()
      .required(),

    slug: yup
      .string()
      .trim()
      .required()
      .test({
        name: 'unique',
        message: '${path} must be unique',
        exclusive: true,
        test: async value => {
          return categoryModel.findOne({ slug: value }).then(category => {
            if (category) {
              return false;
            }
            return true;
          });
        },
      }),
  });
