import { createNextRouteHandler } from 'uploadthing/next';
import { ourFileRouter } from './core';

const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});

export { GET, POST };
