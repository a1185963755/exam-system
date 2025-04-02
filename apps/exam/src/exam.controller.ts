import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { RequireLogin, UserInfo } from '@app/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { SaveExamDto } from './dto/save-exam.dto';
import { ListExamDto } from './dto/list-exam.dto';
import { PublishExamDto } from './dto/publish.dto';
import { DeleteExamDto } from './dto/delete.dto';

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

  @Get('find/:id')
  async get(@Param('id') id: number, @UserInfo('userId') userId: number) {
    if (!id) throw new HttpException('id is required', 400);
    return this.examService.getExam(userId, id);
  }

  @Get('list')
  async list(@UserInfo('userId') userId: number, @Query() query: ListExamDto) {
    if (!userId) return [];
    return this.examService.getExamList(userId, query);
  }

  @Post('delete')
  async delete(
    @Body() body: DeleteExamDto,
    @UserInfo('userId') userId: number,
  ) {
    return this.examService.deleteExam(body, userId);
  }

  @Post('save')
  async save(@Body() dto: SaveExamDto) {
    return this.examService.saveExam(dto);
  }

  @Post('publish')
  async publish(
    @UserInfo('userId') userId: number,
    @Body() body: PublishExamDto,
  ) {
    return this.examService.publishExam(userId, body);
  }
}
