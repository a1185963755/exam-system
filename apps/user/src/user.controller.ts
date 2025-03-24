import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from '@app/redis';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailService } from '@app/email';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Get('register-captcha')
  async registerCaptcha(@Query('email') email: string) {
    const randomCaptcha = Math.random().toString().slice(-6);
    await this.redisService.set(`captcha_${email}`, randomCaptcha, 60 * 5);
    await this.emailService.sendMail({
      to: email,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${randomCaptcha}</p>`,
    });
    return '验证码已发送';
  }
  @Post('register')
  async create(@Body() data: CreateUserDto) {
    return this.userService.createUser(data);
  }
}
