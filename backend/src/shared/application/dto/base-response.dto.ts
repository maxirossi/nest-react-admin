export class BaseResponseDto {
  success: boolean;
  message?: string;
  timestamp: Date;

  constructor(success: boolean, message?: string) {
    this.success = success;
    this.message = message;
    this.timestamp = new Date();
  }
}
