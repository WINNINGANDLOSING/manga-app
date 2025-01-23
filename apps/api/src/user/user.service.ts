import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  // function to create a new user inside the db
  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto; // extract the password and user from the dto
    const hashedPassword = await hash(password); // hash the password with argon2
    return await this.prisma.users.create({
      data: {
        password: hashedPassword,
        ...user,
      },
    });
  }

  // function to find user with provided email
  async findByEmail(email: string) {
    return await this.prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  async findAll() {
    return await this.prisma.users.findMany({
      include: {
        posts: true,
      },
    });
  }
  async findOne(userId: number) {
    return await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async updateHashedRefreshToken(userId: number, hashedRefreshToken: string) {
    return await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken: hashedRefreshToken,
      },
    });
  }
}
