import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: 'oliver',
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
