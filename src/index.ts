import { Elysia } from "elysia";

import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { auth } from "./modules/auth";
import swagger from "@elysiajs/swagger";



const app = new Elysia().use(swagger()).get("/", () => "Hello Elysia").group("/api", (app) =>

  app
    .use(
      jwt({
        name: "jwt",
        secret: Bun.env.JWT_SECRET!,
      })
    )
    .use(cookie())
    .use(auth)
    

).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
