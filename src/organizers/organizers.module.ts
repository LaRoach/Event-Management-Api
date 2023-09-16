import { Module } from '@nestjs/common';
import { OrganizersController } from './controllers/organizers.controller';
import { OrganizersService } from './services/organizers.service';
import { AuthService } from 'src/auth/services/auth.service';
import { Organizer } from './models/organizer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from 'src/attendees/models/attendee.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from 'src/jwt/JwtConfigService';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Organizer, Attendee]),
  JwtModule.registerAsync({
    useClass: JwtConfigService
  }), HttpModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      timeout: configService.getOrThrow<number>('HTTP_TIMEOUT'),
      maxRedirects: configService.getOrThrow<number>('HTTP_MAX_REDIRECTS'),
    }),
    inject: [ConfigService]
  })],
  controllers: [OrganizersController],
  providers: [OrganizersService, AuthService]
})
export class OrganizersModule { }
