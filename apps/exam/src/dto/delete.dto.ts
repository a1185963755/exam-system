import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteExamDto {
  @IsNumber({}, { message: '考试 id 必须是数字' })
  @IsNotEmpty({ message: '考试 id 不能为空' })
  id: number;

  @IsBoolean({ message: '删除状态必须为布尔值' })
  isDelete: boolean;
}
