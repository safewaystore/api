import { prop as Prop} from "typegoose";

export class ImageSchema {
  public id: string;

  @Prop()
  public path: string;
}