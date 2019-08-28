import { prop as Prop, pre as Pre, Typegoose, InstanceType } from 'typegoose';
import * as bcrypt from 'bcrypt';
import { Field, ID, ObjectType } from 'type-graphql';

export interface IUser extends InstanceType<User> {}

@ObjectType()
@Pre<User>('save', function(next) {
  if (this.password) {
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, salt);
  }
  next();
})
export class User extends Typegoose {
  @Field(() => ID)
  public id: string;

  @Prop()
  @Field(() => String)
  public firstName: string;

  @Prop()
  @Field(() => String)
  public lastName: string;

  @Prop()
  @Field(() => String)
  public email: string;

  @Prop()
  public password: string;

  @Field(() => String, { nullable: true })
  public token: string;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}

export const userModel = new User().getModelForClass(User, {
  schemaOptions: { timestamps: true },
});
