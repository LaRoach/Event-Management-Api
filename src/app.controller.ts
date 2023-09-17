import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiTags('Healthcheck')
  @Get('/healthcheck')
  healthCheck(): string {
    return this.appService.healthCheck();
  }
}
