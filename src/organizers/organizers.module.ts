import { Module } from '@nestjs/common';
import { OrganizersController } from './controllers/organizers.controller';
import { OrganizersService } from './services/organizers.service';
import { AuthService } from 'src/auth/services/auth.service';
import { Organizer } from './models/organizer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Organizer]),
  JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      return {
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
        global: true
      };
    },
  })],
  controllers: [OrganizersController],
  providers: [OrganizersService, AuthService]
})
export class OrganizersModule { }
