import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './dto/sendEmail.dto';
import { SendEmailPersonalDto } from './dto/sendMailPersonal';
import { botLogs } from 'src/middlewares/log';

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

  async sendEmailPersonal(sendEmailPersonalDto:SendEmailPersonalDto){
   
    const { nombre, compania, email, mensaje} = sendEmailPersonalDto;

    const data =`<b>Solicitante: </b>${nombre},\n<b>Correo </b> : ${email}, \n<b>Compania</b>: ${compania},\n<b>Mensaje </b> : ${mensaje}, \n`;
    botLogs(data);
  
    return {ok:true,msg:'Correo enviado exitosamente!!'};
  }



}
