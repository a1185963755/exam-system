import { PrismaService } from '@app/prisma';
import { Inject, Injectable } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { SaveExamDto } from './dto/save-exam.dto';

@Injectable()
export class ExamService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;
  async createExam(data: CreateExamDto, userId: number) {
    const res = await this.prismaService.exam.create({
      data: {
        ...data,
        content: '',
        creator: {
          connect: { id: userId },
        },
      },
    });
    return res;
  }

  async getExamList(userId: number, bin: string) {
    const condition = bin
      ? { creatorId: userId, isDelete: true }
      : { creatorId: userId };
    const res = await this.prismaService.exam.findMany({
      where: condition,
    });
    return res;
  }

  async deleteExam(id: number, userId: number) {
    const foundExam = await this.prismaService.exam.findUnique({
      where: {
        id: +id,
      },
    });
    if (!foundExam) {
      throw new Error('考试不存在');
    }
    const res = await this.prismaService.exam.update({
      where: {
        id: +id,
        creatorId: userId,
      },
      data: {
        isDelete: true,
      },
    });
    return res;
  }

  async saveExam(data: SaveExamDto) {
    const { id, content } = data;
    const foundExam = await this.prismaService.exam.findUnique({
      where: {
        id: +id,
      },
    });
    if (!foundExam) {
      throw new Error('考试不存在');
    }
    const res = await this.prismaService.exam.update({
      where: {
        id: +data.id,
      },
      data: {
        content,
      },
    });
    return res;
  }

  async publishExam(userId: number, id: number) {
    const foundExam = await this.prismaService.exam.findUnique({
      where: {
        id: +id,
      },
    });
    if (!foundExam) {
      throw new Error('考试不存在');
    }
    const res = await this.prismaService.exam.update({
      where: {
        id: +id,
      },
      data: {
        isPublish: true,
      },
    });
    return res;
  }
}
