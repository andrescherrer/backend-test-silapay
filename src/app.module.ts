import { Module } from '@nestjs/common';
import { ProdutosModule } from './produtos/produtos.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [ProdutosModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
