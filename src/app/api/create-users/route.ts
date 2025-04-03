

import { prisma } from "@/db/prisma";
import { faker } from "@faker-js/faker";
import { hash } from "bcrypt";





export async function POST() {
    const users = [];

    for (let i = 0; i < 2000; i++) {
        users.push({
            username: faker.internet.username(),
            email: faker.internet.email(),
            password:await hash("123456", 12) 
        });
    }

    try {
        await prisma.user.createMany({ data: users, skipDuplicates: true });

        return Response.json({ message: "2000 users inserted into PostgreSQL!" });
    } catch (error) {
        return Response.json({ error: error }, { status: 500 });
    }
}