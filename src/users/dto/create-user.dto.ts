import { IsEmail, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @Min(1950)
    @Max(2005)
    year_of_birth: number;
}
