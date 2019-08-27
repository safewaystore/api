import * as yup from 'yup';
import { userModel } from './user.model';

export const createUserSchema = () =>
  yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup
      .string()
      .email()
      .required()
      .test({
        name: 'unique',
        message: '${path} must be unique',
        exclusive: true,
        test: async value => {
          return userModel.findOne({ email: value }).then(user => {
            if (user) {
              return false;
            }
            return true;
          });
        },
      }),
    password: yup
      .string()
      .min(6)
      .required(),
  });
