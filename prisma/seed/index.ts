import process from 'process';

import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { config } from 'dotenv';

config({
    path: process.env.ENV_FILE_PATH,
});

const prisma = new PrismaClient();

const salt = Number(process.env.SALT);

const randomUser = (): Record<string, string> => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    return { name, email, password };
};

const getUsers = async (): Promise<Array<Record<string, string>>> => {
    const userData: Array<Record<string, string>> = [
        {
            name: 'admin',
            email: 'admin@admin.com',
            password: await hash('admin', salt),
        },
        {
            name: 'name',
            email: 'email@email.com',
            password: await hash('password', salt),
        },
        {
            name: 'test',
            email: 'test@test.com',
            password: await hash('test', salt),
        },
    ];

    for (let i = 0; i < 10; i++) {
        userData.push(randomUser());
    }

    return userData;
};

async function main(): Promise<void> {
    console.log(`--- Start seeding ...`);

    const userData = await getUsers();

    for (const { name, email, password } of userData) {
        const user = await prisma.user.create({
            // where: { email },
            // update: {},
            data: {
                name,
                email,
                password,
            },
        });

        console.log(`--- Created user with id: ${user.id}`);
    }

    console.log(`--- Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
