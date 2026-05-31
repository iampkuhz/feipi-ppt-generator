export type AppEnv = {
  templateRoot: string;
  tmpRoot: string;
};

export function loadEnv(): AppEnv {
  return {
    templateRoot: process.env.PPT_LORD_TEMPLATE_ROOT ?? 'assets/templates',
    tmpRoot: process.env.PPT_LORD_TMP_ROOT ?? 'tmp'
  };
}
