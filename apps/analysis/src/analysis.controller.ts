import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { RequireLogin } from '@app/common';

@RequireLogin()
@Controller()
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get('ranking')
  async ranking(@Query('examId') examId: string) {
    if (!examId) {
      throw new HttpException('examId不能为空', HttpStatus.BAD_REQUEST);
    }
    return await this.analysisService.ranking(examId);
  }
}
