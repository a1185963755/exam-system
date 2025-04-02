import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class PublishExamDto {
  @IsNumber({}, { message: '考试 id 必须是数字' })
  id: number;

  @IsBoolean({ message: '发布状态必须为布尔值' })
  isPublish: boolean;
}
