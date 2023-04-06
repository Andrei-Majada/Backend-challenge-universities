import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UniversityDocument = HydratedDocument<University>;

@Schema({ timestamps: true })
export class University {
  @Prop()
  state_province: string;

  @Prop()
  web_pages: [string];

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  alpha_two_code: string;

  @Prop()
  domains: [string];
}

export const UniversitySchema = SchemaFactory.createForClass(University);
