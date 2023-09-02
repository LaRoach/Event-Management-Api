import { Module } from '@nestjs/common';
import { AttendeesController } from './controllers/attendees.controller';
import { AttendeesService } from './services/attendees.service';
import { Attendee } from './models/attendee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attendee])],
  controllers: [AttendeesController],
  providers: [AttendeesService]
})
export class AttendeesModule { }
