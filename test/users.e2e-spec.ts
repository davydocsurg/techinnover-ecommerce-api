import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { Role } from '@prisma/client';

function generateRandomEmail() {
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${randomString}@example.com`;
}

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let adminId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();

    // Register and login an admin user
    const adminEmail = generateRandomEmail();
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Admin User',
      email: adminEmail,
      password: 'password123@',
      role: Role.ADMIN,
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: adminEmail,
        password: 'password123@',
      })
      .expect(200);

    adminToken = loginResponse.body.data.accessToken;
    adminId = loginResponse.body.data.user.id;
  });

  afterAll(async () => {
    // await prisma.user.deleteMany();
    await app.close();
  });

  it('should register a new user', async () => {
    const email = generateRandomEmail();
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Test User',
        email,
        password: 'password123@',
      })
      .expect(201);

    expect(response.body.data.user).toHaveProperty('id');
    expect(response.body.data.user).toHaveProperty('email', email);
  });

  it('should login the user', async () => {
    const email = generateRandomEmail();
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Test User',
      email,
      password: 'password123@',
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: 'password123@',
      })
      .expect(200);

    expect(response.body.data).toHaveProperty('accessToken');
  });

  it('should get the user profile', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${adminId}`)
      .set('Cookie', [`access_token=${adminToken}`]);
    //   .expect(200);

    console.log('=================USER PROFILE===================');
    console.log(response.body);
    console.log('====================================');

    // expect(response.body.data.user).toHaveProperty('email');
  });

  // it('should ban the user', async () => {
  //   const user = await prisma.user.findUnique({
  //     where: { email: 'test@example.com' },
  //   });

  //   await prisma.user.update({
  //     where: { id: user.id },
  //     data: { isBanned: true },
  //   });

  //   const response = await request(app.getHttpServer())
  //     .get('/users/profile')
  //     .set('Authorization', `Bearer ${jwtToken}`)
  //     .expect(403);

  //   expect(response.body.message).toBe(
  //     'You are banned from interacting with the system',
  //   );
  // });
});
