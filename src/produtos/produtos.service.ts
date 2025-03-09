/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.produto.findMany();
  }

  async findOne(id: number) {
    const produto = await this.prisma.produto.findUnique({ where: { id } });
    if (!produto) {
      throw new NotFoundException({
        message: `Produto com ID ${id} não encontrado.`,
      });
    }
    return produto;
  }

  async create(data: CreateProdutoDto) {
    try {
      const produto = await this.prisma.produto.create({ data });
      return { message: 'Produto criado com sucesso', produto };
    } catch (error: any) {
      throw new BadRequestException({
        message: 'Erro ao criar produto',
        error: error.message,
      });
    }
  }

  async update(id: number, data: UpdateProdutoDto) {
    try {
      await this.findOne(id);
      const produto = await this.prisma.produto.update({ where: { id }, data });
      return { message: 'Produto atualizado com sucesso', produto };
    } catch (error: any) {
      throw new BadRequestException({
        message: 'Erro ao atualizar produto',
        error: error.message,
      });
    }
  }

  async delete(id: number) {
    try {
      await this.findOne(id);
      await this.prisma.produto.delete({ where: { id } });
      return { message: 'Produto excluído com sucesso' };
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: 'Erro ao excluir produto',
        error: error.message,
      });
    }
  }
}
