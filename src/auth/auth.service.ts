import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async signIn(email: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException(
                'can not find your email in system');
        }

        const payload: JwtPayloadDto = {
            email: user.email,
            name: user.name,
        };

        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '600s',
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '3600s',
        });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }
}
