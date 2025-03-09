import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosService } from './produtos.service';
import { ProdutosController } from './produtos.controller';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ProdutosController', () => {
  let controller: ProdutosController;
  let service: ProdutosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutosController],
      providers: [
        {
          provide: ProdutosService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProdutosController>(ProdutosController);
    service = module.get<ProdutosService>(ProdutosService);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
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
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
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
      jest.spyOn(service, 'findOne').mockResolvedValue(produto);

      expect(await controller.findOne(1)).toEqual(produto);
    });

    it('deve lançar NotFoundException se o produto não existir', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Produto não encontrado'));

      await expect(controller.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('deve criar um produto e retornar a mensagem', async () => {
      const produtoDto: CreateProdutoDto = {
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

      jest.spyOn(service, 'create').mockResolvedValue({
        message: 'Produto criado com sucesso',
        produto: produtoCriado,
      });

      expect(await controller.create(produtoDto)).toEqual({
        message: 'Produto criado com sucesso',
        produto: produtoCriado,
      });
    });

    it('deve lançar BadRequestException ao falhar', async () => {
      const produtoDto: CreateProdutoDto = {
        nome: 'Produto com erro',
        preco: 10,
        descricao: '',
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadRequestException('Erro ao criar produto'));

      await expect(controller.create(produtoDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar um produto e retornar a mensagem', async () => {
      const produtoDto: UpdateProdutoDto = {
        nome: 'Produto Atualizado',
        preco: 30.0,
        descricao: 'Nova Desc',
      };
      const produtoAtualizado = {
        id: 1,
        nome: produtoDto.nome!,
        preco: produtoDto.preco!,
        descricao: produtoDto.descricao!,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'update').mockResolvedValue({
        message: 'Produto atualizado com sucesso',
        produto: produtoAtualizado,
      });

      expect(await controller.update(1, produtoDto)).toEqual({
        message: 'Produto atualizado com sucesso',
        produto: produtoAtualizado,
      });
    });

    it('deve lançar BadRequestException ao falhar na atualização', async () => {
      const produtoDto: UpdateProdutoDto = {
        nome: 'Produto Atualizado',
        preco: 30.0,
        descricao: 'Nova Desc',
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(
          new BadRequestException('Erro ao atualizar produto'),
        );

      await expect(controller.update(1, produtoDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delete', () => {
    it('deve excluir um produto e retornar a mensagem', async () => {
      jest
        .spyOn(service, 'delete')
        .mockResolvedValue({ message: 'Produto excluído com sucesso' });

      expect(await controller.delete(1)).toEqual({
        message: 'Produto excluído com sucesso',
      });
    });

    it('deve lançar BadRequestException ao falhar na exclusão', async () => {
      jest
        .spyOn(service, 'delete')
        .mockRejectedValue(new BadRequestException('Erro ao excluir produto'));

      await expect(controller.delete(1)).rejects.toThrow(BadRequestException);
    });
  });
});
