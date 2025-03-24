import { Controller, Get, Inject } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Inject('EXAM_SERVICE')
  private examClient: ClientProxy;

  @Get()
  async getHello() {
    const value = await firstValueFrom(
      this.examClient.send('sum', [1, 2, 3, 4, 5]),
    );

    console.log('🚀 ~ AnswerController ~ getHello ~ value:', value);
    return value;
  }
}
