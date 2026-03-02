import { LoggerService } from '@nestjs/common';

export class AppLogger implements LoggerService {
  private timestamp(): string {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');
    const ms = now.getMilliseconds().toString().padStart(3, '0');
    return `[${h}:${m}:${s}.${ms}]`;
  }

  log(message: unknown) {
    process.stdout.write(`${this.timestamp()} INFO: ${message}\n`);
  }

  error(message: unknown, trace?: string) {
    process.stderr.write(`${this.timestamp()} ERROR: ${message}\n`);
    if (trace) process.stderr.write(`${trace}\n`);
  }

  warn(message: unknown) {
    process.stdout.write(`${this.timestamp()} WARN: ${message}\n`);
  }

  debug(message: unknown) {
    process.stdout.write(`${this.timestamp()} DEBUG: ${message}\n`);
  }

  verbose(message: unknown) {
    process.stdout.write(`${this.timestamp()} VERBOSE: ${message}\n`);
  }
}
