import { PrismaService } from '@app/prisma';
import { RedisService } from '@app/redis';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AnalysisService {
  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(PrismaService)
  private readonly prismaService: PrismaService;
  async ranking(examId: string) {
    const answers = await this.prismaService.answer.findMany({
      where: {
        examId: +examId,
      },
      include: {
        answerer: true,
      },
    });
    if (!answers) {
      throw new HttpException('没有找到答案', HttpStatus.BAD_REQUEST);
    }
    const body = answers.map((answer) => {
      return {
        score: answer.score,
        value: answer.answerer.username,
      };
    });
    await this.redisService.zAdd('ranking_' + examId, body);
    const res = await this.redisService.zRankList('ranking_' + examId, 0, 10);
    return res;
  }
}
