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
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserPasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  private logger = new Logger(UserService.name);

  async createUser(user: CreateUserDto) {
    const { email, captcha, username, password } = user;
    const redisCaptcha = await this.redisService.get(`captcha_${email}`);
    if (!redisCaptcha) {
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

  async login(user: LoginDto) {
    const { username, password } = user;
    const foundUser = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }
    const { password: pwd, ...safeUser } = foundUser;
    const token = this.jwtService.sign(safeUser);
    return {
      userInfo: {
        ...safeUser,
      },
      token,
    };
  }

  async updatePassword(data: UpdateUserPasswordDto) {
    const { email, captcha, password, username } = data;
    const redisCaptcha = await this.redisService.get(
      `update_password_captcha_${email}`,
    );
    if (!redisCaptcha) {
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST);
    }
    if (redisCaptcha !== captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }
    const foundUser = await this.prismaService.user.findUnique({
      where: { username, email },
    });
    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (isPasswordValid) {
      throw new HttpException('新密码不能与旧密码相同', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await this.prismaService.user.update({
        where: { username },
        data: { password: hashedPassword },
      });
      return { message: '密码修改成功' };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('密码修改失败', HttpStatus.BAD_REQUEST);
    }
  }
}
