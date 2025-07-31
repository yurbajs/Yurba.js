import express from 'express';
import { randomBetween, randomBoolean, generateRandomEmoji } from './utils.js';

type Online = 0 | 1;

interface MockUser {
  ID: number;
  Name: string;
  Surname: string;
  Link: string;
  Avatar: number;
  Creative: number;
  Ban: number;
  Deleted: number;
  Reports: number;
  Emoji: string;
  CosmeticAvatar: number;
  Online: Online;
  CommentsState: number;
  ViewAvatarState: number;
}

// Mock data generator
export const generateMockUser = (id: string, tag: string): MockUser => ({
  ID: Number(id),
  Name: `Name_${tag}`,
  Surname: `Surname_${tag}`,
  Link: `https://yurba.one/u/${id}`,
  Avatar: randomBetween(0, 9),
  Creative: randomBetween(0, 4),
  Ban: randomBoolean(0.1) ? 1 : 0,
  Deleted: randomBoolean(0.05) ? 1 : 0,
  Reports: randomBetween(0, 99),
  Emoji: generateRandomEmoji(),
  CosmeticAvatar: randomBetween(0, 99),
  Online: randomBoolean() ? 1 : 0 as Online,
  CommentsState: randomBetween(0, 2),
  ViewAvatarState: randomBetween(0, 1),
});

// Express Server
export class Server {
  private port: number;
  private app: express.Application;

  constructor(options: { port?: number } = {}) {
    this.port = options.port || 3000;
    this.app = express();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.app.get('/user/:id', (req, res) => {
      const { id } = req.params;
      res.json(generateMockUser(id, `user_${id}`));
    });
    
    this.app.get('/user/:tag', (req, res) => {
      const { tag } = req.params;
      res.json(generateMockUser('0', tag));
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Express mock running on http://localhost:${this.port}`);
    });
  }
}

// MSW Handlers
export { handlers, createHandlers } from './msw.js';

// Utilities
export * from './utils.js';

export default Server;