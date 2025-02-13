import { Controller, Get, Post, Body,Param,Put } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from './schemas/employee.schema';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  // Crea un nuevo empleado
  @Post()
    async create(@Body() employee: Employee): Promise<Employee> {
    return this.employeesService.create(employee);
    }

  
  // obtiene todos los empleados
  @Get()
    async findAll(): Promise<Employee[]> {
    return this.employeesService.findAll();
    }

  // obtiene un empleado por su id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Employee> {
    return this.employeesService.findOne(id);
  }

  // Actualiza un empleado por su id
    @Put(':id')
    async update(@Param('id') id: string, @Body() employee: Employee): Promise<Employee> {
    return this.employeesService.update(id, employee);
    }

    // Elimina un empleado por su id
    @Post(':id/delete')
    async delete(@Param('id') id: string): Promise<Employee> {
    return this.employeesService.delete(id);
    }


}