import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/sendEmail.dto';
import { SendEmailPersonalDto } from './dto/sendMailPersonal';


@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('plaint-email')
  emailPlane(
    @Body() sendEmailPersonalDto:SendEmailPersonalDto
  ){
    return this.emailService.sendEmailPersonal(sendEmailPersonalDto);
  }
}
