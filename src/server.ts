import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const HOST = '127.0.0.1';
const PORT = Number(process.env['PORT'] ?? 4000);
const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  console.log(`\n[SSR server] ${req.method} ${req.originalUrl}`);

  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  app.listen(PORT, HOST, () => {
    console.log(`Angular AOT SSR server listening on http://${HOST}:${PORT}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
