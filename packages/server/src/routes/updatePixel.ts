import { Response, URLPattern } from 'fets';
import { router } from '../lib/server.js';
import { canvas } from '../lib/canvas.js';
import { wss } from '../index.js';

const UPDATE_PIXEL_PATH = '/update/pixel/:x/:y/:color';

router.route({
  path: UPDATE_PIXEL_PATH,
  method: 'GET',
  handler: async (req: Request) => {
    const pattern = new URLPattern({ pathname: UPDATE_PIXEL_PATH });
    const { x, y, color } = pattern.exec(req.url)?.pathname.groups as any;
    const xint = parseInt(x);
    const yint = parseInt(y);
    if (canvas[yint]![xint] != null) {
      canvas[yint]![xint] = "#" + color;
    }
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(`${x}/${y}/${"#" + color}`);
      }
    });
    return;
  }
});
