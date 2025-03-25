import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { RequireLogin, UserInfo } from '@app/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { SaveExamDto } from './dto/save-exam.dto';

@RequireLogin()
@Controller()
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post('create')
  async create(
    @Body() data: CreateExamDto,
    @UserInfo('userId') userId: number,
  ) {
    return this.examService.createExam(data, userId);
  }

  @Get('list')
  async list(@UserInfo('userId') userId: number, @Query('bin') bin: string) {
    if (!userId) return [];
    return this.examService.getExamList(userId, bin);
  }

  @Post('delete')
  async delete(@Body('id') id: number, @UserInfo('userId') userId: number) {
    if (!id) {
      throw new HttpException('id不能为空', 400);
    }
    return this.examService.deleteExam(id, userId);
  }

  @Post('save')
  async save(@Body() dto: SaveExamDto) {
    return this.examService.saveExam(dto);
  }

  @Post('publish')
  async publish(@UserInfo('userId') userId: number, @Body('id') id: string) {
    return this.examService.publishExam(userId, +id);
  }
}
