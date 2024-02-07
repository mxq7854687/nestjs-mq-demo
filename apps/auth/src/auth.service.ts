import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/new-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers() {
    return this.userRepo.find();
  }

  async postUser() {
    return this.userRepo.save({ firstName: '' });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepo.findOne({ where: { email } });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async register(dto: Readonly<RegisterDto>): Promise<UserEntity> {
    const { firstName, lastName, email, password } = dto;

    const existUser = await this.findByEmail(email);
    if (existUser) {
      throw new ConflictException();
    }
    const hashedPassword = await this.hashPassword(password);

    const savedUser = await this.userRepo.save({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    delete savedUser.password;
    return savedUser;
  }

  async login(dto: Readonly<LoginDto>) {
    const user = await this.userRepo.findOne({
      where: {
        email: dto.email,
      },
      select: ['password'],
    });
    if (!user) {
      throw new NotFoundException();
    }
    const isMatched = await bcrypt.compare(dto.password, user.password);
    if (!isMatched) {
      throw new UnauthorizedException();
    }

    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt };
  }

  async verifyJwt(jwt: string): Promise<{ exp: number }> {
    if (!jwt) {
      throw new UnauthorizedException();
    }
    try {
      const { exp } = await this.jwtService.verifyAsync(jwt);
      return { exp };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
