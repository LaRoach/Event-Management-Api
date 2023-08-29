import { Module } from '@nestjs/common';
import { OrganizersController } from './controllers/organizers.controller';
import { OrganizersService } from './services/organizers.service';

@Module({
  controllers: [OrganizersController],
  providers: [OrganizersService]
})
export class OrganizersModule { }
