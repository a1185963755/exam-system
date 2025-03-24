import { PrismaService } from '@app/prisma';
import { RedisService } from '@app/redis';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  private logger = new Logger(UserService.name);

  async createUser(user: CreateUserDto) {
    const { email, captcha, username, password } = user;
    const redisCaptcha = await this.redisService.get(`captcha_${email}`);
    if (!redisCaptcha) {
      console.log(
        '🚀 ~ UserService ~ createUser ~ redisCaptcha:',
        redisCaptcha,
      );
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST);
    }
    if (redisCaptcha !== captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(
        '🚀 ~ UserService ~ createUser ~ hashedPassword:',
        hashedPassword,
      );
      return await this.prismaService.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
        select: { id: true, username: true, email: true, createTime: true },
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('用户创建失败', HttpStatus.BAD_REQUEST);
    }
  }
}
