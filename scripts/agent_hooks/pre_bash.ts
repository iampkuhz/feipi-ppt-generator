const command = process.argv.slice(2).join(' ');
const blocked = [/git reset --hard/, /git clean -fdx/, /rm -rf \//, /rm -rf ~/, /chmod -R 777 \//];
if (blocked.some((pattern) => pattern.test(command))) {
  console.error('FAIL 命令被安全策略拦截');
  process.exitCode = 1;
} else {
  console.log('PASS Bash 预检通过');
}
