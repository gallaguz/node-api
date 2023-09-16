import * as process from 'process';

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const salt = Number(process.env.SALT);

const getUsers = async (): Promise<Array<Record<string, string>>> => {
    return [
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
        {
            name: 'staging',
            email: 'staging@staging.com',
            password: await hash('staging', salt),
        },
    ];
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
