import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';



@Schema({ collection: 'employee' })
export class Employee extends Document {

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  posicion: string;

  @Prop({
    type: Number,
    required: true, // de alguna forma solo funcionaba con esto
    min: 1
    })
    salario: number;

  @Prop({ required: true, enum: ['M', 'F'] })
  sexo: string;

  @Prop({ required: true, type: Date })
  fecha_de_ingreso: Date;
  }

export const EmployeeSchema = SchemaFactory.createForClass(Employee);