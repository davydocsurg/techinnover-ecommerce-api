import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();

    // Register and login a user
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123@',
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123@',
      });

    jwtToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('should create a new product', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        name: 'Test Product',
        description: 'A product for testing',
        price: 100,
        quantity: 10,
      })
      .expect(201);

    console.log('====================================');
    console.log(response.body);
    console.log('====================================');

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', 'Test Product');
  });

  //   it('should update the product', async () => {
  //     const product = await prisma.product.findUnique({
  //       where: { name: 'Test Product' },
  //     });

  //     const response = await request(app.getHttpServer())
  //       .patch(`/products/${product.id}`)
  //       .set('Authorization', `Bearer ${jwtToken}`)
  //       .send({
  //         description: 'An updated product for testing',
  //       })
  //       .expect(200);

  //     expect(response.body).toHaveProperty(
  //       'description',
  //       'An updated product for testing',
  //     );
  //   });

  //   it('should get the product', async () => {
  //     const product = await prisma.product.findUnique({
  //       where: { name: 'Test Product' },
  //     });

  //     const response = await request(app.getHttpServer())
  //       .get(`/products/${product.id}`)
  //       .expect(200);

  //     expect(response.body).toHaveProperty('name', 'Test Product');
  //   });

  //   it('should delete the product', async () => {
  //     const product = await prisma.product.findUnique({
  //       where: { name: 'Test Product' },
  //     });

  //     await request(app.getHttpServer())
  //       .delete(`/products/${product.id}`)
  //       .set('Authorization', `Bearer ${jwtToken}`)
  //       .expect(200);

  //     const deletedProduct = await prisma.product.findUnique({
  //       where: { id: product.id },
  //     });

  //     expect(deletedProduct).toBeNull();
  //   });
});
