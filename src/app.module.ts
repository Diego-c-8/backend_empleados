import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmployeesModule } from './employees/employees.module';
import { Connection } from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    EmployeesModule,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    this.connection.once('open', () => {
      this.logger.log('MongoDB conectado correctamente.');
    });

    this.connection.on('error', (err) => {
      this.logger.error('Error en la conexión a MongoDB:', err);
    });
  }
}