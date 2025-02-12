
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerTest {
  warn(message: string) {
    console.warn(message);
  }

  error(message: string) {
    console.error(message);
  }

  info(message: string) {
    console.info(message);
  }

  
}
