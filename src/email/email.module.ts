import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';


@Module({
  controllers: [EmailController],
  providers: [EmailService],
  imports:[
    MailerModule.forRoot({
      transport:{
        host:'smtp.gmail.com',
        port: 465,
        secure:true,
        auth:{
          user:'advinjosuev899@gmail.com',
          pass:'nlonxtvuqeojwzjc'
        }
      },
      defaults: {
        from: '"No Reply" <no-reply@localhost>',
      },
      template: {
        dir: process.cwd() + '/template/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  exports:[
    MailerModule,
    EmailService
  ]
})
export class EmailModule {}
