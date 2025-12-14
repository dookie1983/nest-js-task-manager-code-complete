import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constant/constants';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.get<boolean>(
            'isPublic', context.getHandler(),
        );
        if (isPublic) {
            return true;
        }

        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException('can not verify your access_token');
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : '';
    }
    // validateRequest(request: Request): boolean {
    //     if (!request.headers.authorization) {
    //         throw new UnauthorizedException('No authorization header provided');
    //     }
    //     if (request.headers.authorization === 'true') {
    //         return true;
    //     } else {
    //         throw new ForbiddenException('Permission denied');
    //     }
    // }
}