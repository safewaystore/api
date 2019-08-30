import * as yup from 'yup';

export const createCategorySchema = () =>
  yup.object().shape({
    title: yup.string().required(),
  });
