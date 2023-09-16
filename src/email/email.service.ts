import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './dto/sendEmail.dto';

@Injectable()
export class EmailService {
  constructor(private mailService:MailerService){}

  
  async sendEmail(sendEmailDto:SendEmailDto){
   
    const {to, subject, template, url, token} = sendEmailDto;
    const response =await this.mailService.sendMail({
      to:to,
      from:'advinjosuev899@gmail.com',
      subject:subject,
      template: template,
      context: { 
        code: 'cf1a3f828287',
        username: 'john doe',
        url:url,
        token:token
      },
    })
    return 'Correo enviado exitosamente!!';
  }
}
