import { Injectable, StreamableFile } from '@nestjs/common';
import { Column, Workbook } from 'exceljs';

@Injectable()
export class ExcelService {
  async export(columns: Partial<Column>[], data: Array<Record<string, any>>) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    worksheet.columns = columns;
    worksheet.addRows(data);
    return await workbook.xlsx.writeBuffer();
  }
}
