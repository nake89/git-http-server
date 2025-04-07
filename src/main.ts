import { Application, Router } from 'jsr:@oak/oak';
import { run } from './util.ts';

const router = new Router();

router.get('/', (ctx) => {
  ctx.response.body = 'Hello world';
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 80 });
// Deno.serve((_req) => {
//   return new Response("Hello, Kevin2!");
// });
