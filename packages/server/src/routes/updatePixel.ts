import { router } from '../lib/server.js';
import { canvas } from '../lib/canvas.js';
import { wss } from '../index.js';
import { z } from 'zod';

const UPDATE_PIXEL_PATH = '/update/pixel/:x/:y/:color';

router.route({
  path: UPDATE_PIXEL_PATH,
  method: 'GET',
  schemas: {
    request: {
      params: z.object({
        x: z.number().int().min(0).max(4),
        y: z.number().int().min(0).max(4),
        color: z.string().regex(/^#[0-9A-F]{6}$/)
      })
    }
  },
  handler: async (req) => {
    const { x, y, color } = req.params;
    canvas[y]![x] = "#" + color;
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(`${x}/${y}/${"#" + color}`);
      }
    });
    return;
  }
});
