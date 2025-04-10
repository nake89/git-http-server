import { Application, Router } from 'jsr:@oak/oak';
import { run } from './util.ts';

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = 'hello win98';
});

router.post('/file', async (ctx) => {
  const formData = await ctx.request.body.formData();
  formData.forEach((value) => {
    const file = value as File;
    console.log(file.name);
    console.log(file.name);
    console.log(file.name);
    const fileData = file.stream();
    Deno.writeFile(file.name, fileData);
  });
  ctx.response.body = 'files uploaded';
});

router.get('/clone', async (ctx) => {
  console.log('GET REQUEST');

  // const asd = await testSsh();
  // console.log(asd)
  let res = '';
  const { code, stdout, stderr } = await run('git', [
    'clone',
    'git@codeberg.org:nake89/testrepo.git',
  ]);
  console.log(code);
  console.log(stdout);
  console.log(stderr);
  console.log(stdout.length);
  console.log(stderr.length);
  // if (stderr) res = stderr;
  // if (stdout) res = stdout;
  ctx.response.body = 'asdsadsasd';
});

async function testSsh() {
  const { stderr, stdout } = await run('ssh', ['-T', 'git@codeberg.org']);
  return stderr + stdout;
}

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 80 });
