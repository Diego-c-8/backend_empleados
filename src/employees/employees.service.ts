import { Injectable ,NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Employee } from './schemas/employee.schema';

@Injectable()
export class EmployeesService {

    constructor(@InjectModel(Employee.name) private employeeModel: Model<Employee>) {}

    async create(employee: Employee): Promise<Employee> {
        const newEmployee = new this.employeeModel(employee);
        return newEmployee.save();
    }

    async findAll(): Promise<Employee[]> {
        return this.employeeModel.find().exec();
    }

    async findOne(id: string): Promise<Employee> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('ID inválido');
        }
        const employee = await this.employeeModel.findById(id).exec();
        if (!employee) {
            throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
        }
        return employee;

    }

    async update(id: string, employee: Employee): Promise<Employee> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('ID inválido');
        }
        const updatedEmployee = await this.employeeModel.findByIdAndUpdate
        (id, employee, { new: true }).exec();
        if (!updatedEmployee) {
            throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
        }
        return updatedEmployee;
    }

    async delete(id: string): Promise<Employee> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('ID inválido');
        }
        const deletedEmployee = await this.employeeModel.findByIdAndDelete(id).exec();
        if (!deletedEmployee) {
            throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
        }
        return deletedEmployee;
    }
    


}