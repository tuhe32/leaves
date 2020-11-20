import { resolve, walkSync } from "../deps.ts";

export const controllers: any[] = [];
export const autoLoad = async (controllerPath: string) => {
  const fullPath = resolve(".", controllerPath);
  console.log("fullPath", fullPath);
  for (const entry of walkSync(fullPath)) {
    if (entry.isFile) {
      console.log(entry.path);
      controllers.push(await import(entry.path));
    }
  }
};
