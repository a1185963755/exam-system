import { PrismaService } from '@app/prisma';
import { Inject, Injectable } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { SaveExamDto } from './dto/save-exam.dto';
import { ListExamDto } from './dto/list-exam.dto';
import { PublishExamDto } from './dto/publish.dto';
import { DeleteExamDto } from './dto/delete.dto';

@Injectable()
export class ExamService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;
  async createExam(data: CreateExamDto, userId: number) {
    const res = await this.prismaService.exam.create({
      data: {
        ...data,
        creator: {
          connect: { id: userId },
        },
      },
    });
    return res;
  }

  async getExam(userId: number, id: number) {
    const foundExam = await this.prismaService.exam.findUnique({
      where: {
        id,
        creatorId: userId,
      },
    });
    return foundExam;
  }
  async getExamList(userId: number, query: ListExamDto) {
    const condition =
      query.bin === 'true'
        ? { creatorId: userId, isDelete: true }
        : { creatorId: userId, isDelete: false };
    const res = await this.prismaService.exam.findMany({
      where: condition,
    });
    return res;
  }

  async deleteExam(body: DeleteExamDto, userId: number) {
    const { id, isDelete } = body;
    const foundExam = await this.prismaService.exam.findUnique({
      where: {
        id,
      },
    });
    if (!foundExam) {
      throw new Error('考试不存在');
    }
    const res = await this.prismaService.exam.update({
      where: {
        id,
        creatorId: userId,
      },
      data: {
        isDelete,
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

  async publishExam(userId: number, body: PublishExamDto) {
    const { id, isPublish } = body;
    const foundExam = await this.prismaService.exam.findUnique({
      where: {
        id: +id,
        creatorId: userId,
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
        isPublish,
      },
    });
    return res;
  }
}
