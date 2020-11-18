import Module from "https://deno.land/std@0.75.0/node/module.ts";
import { createRequire, expandGlobSync, resolve, walkSync } from "../deps.ts";

export const autoLoad = () => {
  const controllerPath = resolve(".", "test");
  console.log("controllerPath", controllerPath);

  for (const entry of walkSync(controllerPath)) {
    console.log(entry);
    if (entry.isFile) {
      // console.log("Module B's import.meta.url", import.meta.url);
      // console.log("Module B's mainModule url", Deno.mainModule);
      // console.log(
      //   "Is module B the main module via import.meta.main?",
      //   import.meta.main,
      // );
      const content = new TextDecoder().decode(Deno.readFileSync(entry.path));
      console.log(content);
      const wrapper = Module.wrap(content);
      console.log(wrapper);
      const [f, err] = (Deno as any).core.evalContext(content, entry.path);
      console.log(f);
      console.log(err);

      // eval(`import tsEntry from ${entry.path};`);
      // const require = createRequire(Deno.mainModule);
      // try {
      //   const tsEntry = require(entry.path);
      //   console.log("tsEntry", tsEntry);
      // } catch (error) {
      //   console.log(error);
      // }
    }
  }
};
