import { IsString } from 'class-validator';

export class ListExamDto {
  @IsString()
  bin?: string;
}
