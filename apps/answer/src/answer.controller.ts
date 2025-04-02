import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { RequireLogin, UserInfo } from '@app/common';
import { AddAnswerDto } from './dto/add-answer.dto';
import { ExcelService } from '@app/excel';
import { Response } from 'express';
@RequireLogin()
@Controller()
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Inject(ExcelService)
  private readonly excelService: ExcelService;
  @Post('add')
  async add(@Body() body: AddAnswerDto, @UserInfo('userId') userId: number) {
    return this.answerService.addAnswer(body, userId);
  }

  @Get('list')
  async list(@Query('examId') examId: number) {
    return this.answerService.listAnswer(examId);
  }

  @Get('find/:id')
  async find(@Param('id') id: number) {
    return this.answerService.findAnswer(id);
  }

  @Get('export')
  async export(@Query('examId') examId: number, @Res() res: Response) {
    const columns = [
      { header: 'ID', key: 'id', width: 20 },
      { header: '分数', key: 'score', width: 30 },
      { header: '答题人', key: 'answerer', width: 30 },
      { header: '试卷', key: 'exam', width: 30 },
      { header: '创建时间', key: 'createTime', width: 30 },
    ];
    const answers = await this.answerService.listAnswer(+examId);
    const data = answers.map((item) => {
      return {
        id: item.id,
        score: item.score,
        answerer: item.answerer.id,
        exam: item.exam.name,
        createTime: item.createTime,
      };
    });

    const buffer = await this.excelService.export(columns, data);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=guang111.xlsx',
    });
    res.send(buffer);
  }
}
