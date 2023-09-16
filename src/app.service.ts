import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) { }

  healthCheck(): string {
    return `${this.configService.getOrThrow<string>('API_NAME')} ${this.configService.getOrThrow<string>('API_VERSION')}`;
  }
}
