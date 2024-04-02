import Elysia, { t } from "elysia";
import { prisma } from "../../libs/prisma";

export const auth = (app: Elysia) =>
    app.group("/auth", (app) =>
        app
            .post("/signup", async ({ body, set }) => {
                const { email, name, password, username } = body;

                const emailExists = await prisma.user.findUnique({
                    where: {
                        email,
                    },

                    select: {
                        id: true,
                    },
                });

                if (emailExists) {
                    set.status = 400;
                    return {
                        success: false,
                        data: null,
                        message: "Email already exists",
                    };
                }

                const usernameExists = await prisma.user.findUnique({
                    where: {
                        username,
                    },
                    select: {
                        id: true,
                    },

                });

                if (usernameExists) {
                    set.status = 400;
                    return {
                        success: false,
                        data: null,
                        message: "Username already exists",
                    };
                }

                const hash = await Bun.password.hash(password);

                const newUser = await prisma.user.create({
                    data: {

                        name,
                        email,
                        username,
                        hash,
                    },
                });

                return {
                    success: true,
                    message: "Account created",
                    data: {
                        user: newUser,
                    },
                };



            },

            {
                body: t.Object({
                    name: t.String(),
                    email: t.String(),
                    password: t.String(),
                    username: t.String(),
                }),
            }



            )
    )