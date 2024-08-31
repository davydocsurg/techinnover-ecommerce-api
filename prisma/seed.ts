import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin_password', 10);

  const adminUsers = [
    {
      name: 'Admin One',
      email: 'admin1@example.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
    {
      name: 'Admin Two',
      email: 'admin2@example.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  ];

  for (const user of adminUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log('Admin users seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
