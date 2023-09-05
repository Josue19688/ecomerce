import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/sendEmail.dto';


@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('plaint-email')
  emailPlane(
    @Query() sendEmailDto:SendEmailDto
  ){
    return this.emailService.sendEmail(sendEmailDto);
  }
}
