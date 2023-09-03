import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizersModule } from './organizers/organizers.module';
import { AttendeesModule } from './attendees/attendees.module';
import { EventsModule } from './events/events.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './db/TypeOrmConfigService';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    useClass: TypeOrmConfigService,
  }), ConfigModule.forRoot({ isGlobal: true }), OrganizersModule, AttendeesModule, EventsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
