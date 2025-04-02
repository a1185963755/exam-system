import { IsNotEmpty } from 'class-validator';

export class AddAnswerDto {
  @IsNotEmpty({
    message: '答案内容不能为空',
  })
  content: string;

  @IsNotEmpty({
    message: '考试ID不能为空',
  })
  examId: number;
}
