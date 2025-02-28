import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  publicAddress: string;

  @IsString()
  imageUrl?: string;

  @IsString()
  bio?: string;

  @IsString()
  @IsOptional()
  solanaBalance?: string;
}
