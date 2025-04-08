
const decoder = new TextDecoder();

export async function run(cmdString: string, argsArr: string[]) {
  const command = new Deno.Command(cmdString, {
    args: argsArr,
  });
  const { code, stdout, stderr } = await command.output();
  const stdoutString = decoder.decode(stdout);
  const stderrString = decoder.decode(stderr);
  return { code, stdout: stdoutString, stderr: stderrString};
}
