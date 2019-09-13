import { prop as Prop} from "typegoose";

export class ImageSchema {
  @Prop()
  public path: string;
}
