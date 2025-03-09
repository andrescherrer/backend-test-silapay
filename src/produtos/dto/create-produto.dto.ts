/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNumber, Min, MaxLength } from 'class-validator';

export class CreateProdutoDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @MaxLength(255, { message: 'O nome pode ter no máximo 255 caracteres.' })
  nome: string;

  @IsNumber({}, { message: 'O preço deve ser um número.' })
  @Min(0, { message: 'O preço não pode ser negativo.' })
  preco: number;

  @IsString({ message: 'A descrição deve ser uma string.' })
  @MaxLength(5000, {
    message: 'A descrição pode ter no máximo 5000 caracteres.',
  })
  descricao: string;
}
