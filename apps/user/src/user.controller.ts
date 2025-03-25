import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from '@app/redis';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailService } from '@app/email';
import { LoginDto } from './dto/login.dto';
import { RequireLogin, UserInfo } from '@app/common';
import { UpdateUserPasswordDto } from './dto/update-password.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Get('register-captcha')
  async registerCaptcha(@Query('email') email: string) {
    if (!email) {
      throw new HttpException('邮箱不能为空', HttpStatus.BAD_REQUEST);
    }
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

  @Post('login')
  async login(@Body() data: LoginDto) {
    return this.userService.login(data);
  }

  @Get('update_password-captcha')
  async updatePasswordCaptcha(@Query('email') email: string) {
    if (!email) {
      throw new HttpException('邮箱不能为空', HttpStatus.BAD_REQUEST);
    }
    const randomCaptcha = Math.random().toString().slice(-6);
    await this.redisService.set(`captcha_${email}`, randomCaptcha, 60 * 5);
    await this.emailService.sendMail({
      to: email,
      subject: '修改密码验证码',
      html: `<p>你的修改密码验证码是 ${randomCaptcha}</p>`,
    });
    return '验证码已发送';
  }
  @Post('update-password')
  async updatePassword(@Body() body: UpdateUserPasswordDto) {
    return this.userService.updatePassword(body);
  }
}
