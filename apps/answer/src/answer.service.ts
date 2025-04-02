import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AddAnswerDto } from './dto/add-answer.dto';
import { PrismaService } from '@app/prisma';
import { json } from 'stream/consumers';

@Injectable()
export class AnswerService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  async addAnswer(body: AddAnswerDto, userId: number) {
    const { examId, content } = body;
    const foundExam = await this.prismaService.exam.findUnique({
      where: {
        id: +examId,
      },
    });
    if (!foundExam) {
      throw new HttpException('考试不存在', HttpStatus.BAD_REQUEST);
    }

    let score = 0;
    const examContent = JSON.parse(foundExam.content);
    examContent.forEach((item) => {
      const id = item.id;
      if (item.answer === content[id]) {
        score += item.score;
      }
    });
    return await this.prismaService.answer.create({
      data: {
        content: JSON.stringify(content),
        score,
        answerer: {
          connect: {
            id: userId,
          },
        },
        exam: {
          connect: {
            id: +examId,
          },
        },
      },
    });
  }

  async listAnswer(examId: number) {
    return await this.prismaService.answer.findMany({
      where: {
        examId,
      },
      include: {
        exam: true,
        answerer: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async findAnswer(id: number) {
    return await this.prismaService.answer.findUnique({
      where: {
        id,
      },
      include: {
        exam: true,
        answerer: {
          select: {
            id: true,
          },
        },
      },
    });
  }
}
