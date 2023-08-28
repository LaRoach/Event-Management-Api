import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) { }

  healthCheck(): string {
    return `${this.configService.get<string>('API_NAME')} ${this.configService.get<string>('API_VERSION')}`;
  }
}
