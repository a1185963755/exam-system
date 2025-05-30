import { IsNotEmpty, IsString } from 'class-validator';

export class SaveExamDto {
  @IsNotEmpty({ message: '考试 id 不能为空' })
  id: number;

  @IsString()
  content: string;
}
