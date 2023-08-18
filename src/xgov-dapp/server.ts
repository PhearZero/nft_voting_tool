import fs from "fs";
import path from "path";
import "dotenv/config";
import createApiModule from "@algorandfoundation/xgov-api";
import {createApp, fromNodeMiddleware, toNodeListener} from "h3";
import {createServer as createViteServer, ModuleNode} from "vite";
import { listen } from "listhen";
import sirv from "sirv";
const DEV_ENV = "development";

const createApi = createApiModule.default
const collectCssUrls = (mods: Set<ModuleNode>, styles: Map<string, string>) => {
  for (const mod of mods) {
    if (mod.ssrModule && mod.file && mod.id) {
      if (mod.file.endsWith('.css') || /\?vue&type=style/.test(mod.id)) {
        styles.set(mod.url, mod.ssrModule.default)
      }
    }
    if (mod.importedModules.size > 0) {
      collectCssUrls(mod.importedModules, styles)
    }
  }
}
const bootstrap = async () => {
  const app = createApp();
  let vite;

  if (process.env.NODE_ENV === DEV_ENV) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(fromNodeMiddleware(vite.middlewares));
  } else {
    app.use(fromNodeMiddleware(sirv("dist/client", {
        gzip: true,
      })
    ));
  }
  app.use('/api', fromNodeMiddleware(createApi()));
  app.use("*", fromNodeMiddleware(async (req, res, next) => {
    const url = req.originalUrl;
    let template, render;

    try {
      if (process.env.NODE_ENV === DEV_ENV) {
        template = fs.readFileSync(path.resolve("./index.html"), "utf-8");

        template = await vite.transformIndexHtml(url, template);

        render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
      } else {
        template = fs.readFileSync(
          path.resolve("dist/client/index.html"),
          "utf-8"
        );
        render = (await import("./dist/server/entry-server.js")).render;
      }

      const appHtml = await render({ path: url });

      const html = template.replace(`<!--ssr-outlet-->`, appHtml);

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html").end(html);
    } catch (error) {
      vite.ssrFixStacktrace(error);
      next(error);
    }
  }));

  return { app };
};



bootstrap()
  .then(async ({ app }) => {
    await listen(toNodeListener(app), { port: 5173 });
  })
  .catch(console.error);
