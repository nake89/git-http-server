import { Application, Router } from "jsr:@oak/oak";
import { run } from "./util.ts";
import { git } from "jsr:@roka/git";

const pathPrefix = "/app";
const gitDirName = "gitdirs";

const auth = {
  "randomAuthKey": {
    username: "myusername",
    email: "myemail"
  }
}

function getUsername(authKey:string) {
  if (authKey in auth) {
    // @ts-ignore nonsense
    return auth[authKey].username;
  }
  return null;
}
function getEmail(authKey:string) {
  if (authKey in auth) {
    // @ts-ignore nonsense
    return auth[authKey].email;
  }
  return null;
}

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = "hello win98";
});

router.post("/init", async (ctx) => {
  const token = ctx.response.headers.get("X-Auth-Token");
  if (!token) {
    ctx.response.body = { ok: 0, error: "No token" };
    return;
  }
  const username = getUsername(token);
  const email = getEmail(token);

  const { dirName } = await ctx.request.body.json();
  const cwd = `${pathPrefix}/${gitDirName}/${username}/${dirName}`;
  try {
    await Deno.mkdir(cwd, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.AlreadyExists)) {
      ctx.response.body = { ok: 0, error: "Could not create directory" };
      return
    }
  }
  if (!await hasFiles(cwd)) {
    ctx.response.body = { ok: 0, error: "Directory is empty" };
    return;
  }

  const repo = git({
    cwd: `${pathPrefix}/${gitDirName}/${username}`,
    config: { user: { name: username, email: email } },
  });
  await repo.init();
});

router.post("/add", async (ctx) => {
  const token = ctx.response.headers.get("X-Auth-Token");
  if (!token) {
    ctx.response.body = { ok: 0, error: "No token" };
    return;
  }
  const username = getUsername(token);
  const email = getEmail(token);
  const {files, dirName} = await ctx.request.body.json();
  const cwd = `${pathPrefix}/${gitDirName}/${username}/${dirName}`;
  const repo = git({
    cwd: `${pathPrefix}/${gitDirName}/${username}/${dirName}`,
    config: { user: { name: username, email: email } },
  });
  for (const file of files) {
    await repo.index.add(file);
  }
  ctx.response.body = { ok: 1 };
});

router.post("/file", async (ctx) => {
  const formData = await ctx.request.body.formData();
  let dirName = "";
  let username = "";
  const files: { [key: string]: File} = {};
  formData.forEach((value, key) => {
    if (key === "dirName") {
      dirName = value as string;
    } else if (key === "username") {
      username = value as string;
    }
    const file = value as File;
    files[key] = file;
    console.log(file.name);
    console.log(file.name);
    console.log(file.name);
  });
  const cwd = `${pathPrefix}/${gitDirName}/${username}/${dirName}`;
  for (const key in files) {
    const filePathWithFileName = key;
    const filePathWithoutFileName = filePathWithFileName.split("/").slice(0, -1).join("/");
    // create path if it doesn't exist
    await Deno.mkdir(`${cwd}/${filePathWithoutFileName}`, { recursive: true });
    const fileData = files[key].stream();
    Deno.writeFile(filePathWithFileName, fileData);
  }
  ctx.response.body = "files uploaded";
});

router.get("/clone", async (ctx) => {
  console.log("GET REQUEST");

  // const asd = await testSsh();
  // console.log(asd)
  let res = "";
  const { code, stdout, stderr } = await run("git", [
    "clone",
    "git@codeberg.org:nake89/testrepo.git",
  ]);
  console.log(code);
  console.log(stdout);
  console.log(stderr);
  console.log(stdout.length);
  console.log(stderr.length);
  // if (stderr) res = stderr;
  // if (stdout) res = stdout;
  ctx.response.body = "asdsadsasd";
});

async function testSsh() {
  const { stderr, stdout } = await run("ssh", ["-T", "git@codeberg.org"]);
  return stderr + stdout;
}
async function hasFiles(cwd: string) {
  const dir = Deno.readDir(cwd);
  let hasFiles = false;
  for await (const entry of dir) {
    if (entry.isFile) {
      hasFiles = true;
      break;
    }
  }
  return hasFiles;
}

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 80 });
