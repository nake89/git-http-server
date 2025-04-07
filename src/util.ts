export async function run(cmdString:string, argsArr: string[]) {
  const command = new Deno.Command(cmdString, {
    args: argsArr,
  });
  const { code, stdout, stderr } = await command.output();
  return { code, stdout, stderr };
}
