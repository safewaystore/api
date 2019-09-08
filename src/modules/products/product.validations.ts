import * as yup from 'yup';
import { productModel } from './product.model';

export const createProductSchema = () =>
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
          return productModel.findOne({ slug: value }).then(product => {
            if (product) {
              return false;
            }
            return true;
          });
        },
      }),
  });

export const updateProductSchema = () =>
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
          return productModel.findOne({ slug: value }).then(product => {
            if (product) {
              return false;
            }
            return true;
          });
        },
      }),
  });
