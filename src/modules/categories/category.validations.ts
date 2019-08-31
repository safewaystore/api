import * as yup from 'yup';

export const createCategorySchema = () =>
  yup.object().shape({
    title: yup
      .string()
      .trim()
      .required(),

    slug: yup
      .string()
      .trim()
      .required(),
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
      .required(),
  });
