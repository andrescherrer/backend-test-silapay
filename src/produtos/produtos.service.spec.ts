import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosService } from './produtos.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ProdutosService', () => {
  let service: ProdutosService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutosService,
        {
          provide: PrismaService,
          useValue: {
            produto: {
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProdutosService>(ProdutosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar uma lista de produtos', async () => {
      const result = [
        {
          id: 1,
          nome: 'Produto 1',
          preco: 10.0,
          descricao: 'Desc',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(prisma.produto, 'findMany').mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('deve retornar um produto se encontrado', async () => {
      const produto = {
        id: 1,
        nome: 'Produto 1',
        preco: 10.0,
        descricao: 'Desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prisma.produto, 'findUnique').mockResolvedValue(produto);

      expect(await service.findOne(1)).toEqual(produto);
    });

    it('deve lançar NotFoundException se o produto não existir', async () => {
      jest.spyOn(prisma.produto, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('deve criar um produto e retornar a mensagem', async () => {
      const produtoDto = {
        nome: 'Produto Novo',
        preco: 20.0,
        descricao: 'Desc',
      };
      const produtoCriado = {
        id: 1,
        ...produtoDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prisma.produto, 'create').mockResolvedValue(produtoCriado);

      expect(await service.create(produtoDto)).toEqual({
        message: 'Produto criado com sucesso',
        produto: produtoCriado,
      });
    });

    it('deve lançar BadRequestException ao falhar', async () => {
      jest
        .spyOn(prisma.produto, 'create')
        .mockRejectedValue(new Error('Erro Prisma'));

      await expect(
        service.create({ nome: 'Erro', preco: 10, descricao: '' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('deve atualizar um produto e retornar a mensagem', async () => {
      const produtoDto = {
        nome: 'Produto Atualizado',
        preco: 30.0,
        descricao: 'Nova Desc',
      };
      const produtoAtualizado = {
        id: 1,
        ...produtoDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(produtoAtualizado);
      jest.spyOn(prisma.produto, 'update').mockResolvedValue(produtoAtualizado);

      expect(await service.update(1, produtoDto)).toEqual({
        message: 'Produto atualizado com sucesso',
        produto: produtoAtualizado,
      });
    });

    it('deve lançar BadRequestException ao falhar na atualização', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        id: 1,
        nome: 'Produto 1',
        preco: 10.0,
        descricao: 'Desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest
        .spyOn(prisma.produto, 'update')
        .mockRejectedValue(new Error('Erro Prisma'));

      await expect(
        service.update(1, { nome: 'Erro', preco: 10, descricao: '' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('deve excluir um produto e retornar a mensagem', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        id: 1,
        nome: 'Produto 1',
        preco: 10.0,
        descricao: 'Desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(prisma.produto, 'delete').mockResolvedValue({
        id: 1,
        nome: 'Produto 1',
        preco: 10.0,
        descricao: 'Desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(await service.delete(1)).toEqual({
        message: 'Produto excluído com sucesso',
      });
    });

    it('deve lançar erro ao falhar na exclusão', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        id: 1,
        nome: 'Produto 1',
        preco: 10.0,
        descricao: 'Desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest
        .spyOn(prisma.produto, 'delete')
        .mockRejectedValue(new Error('Erro Prisma'));

      await expect(service.delete(1)).rejects.toThrow();
    });
  });
});
