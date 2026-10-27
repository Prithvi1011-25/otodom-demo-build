import { spawn } from 'node:child_process';

/**
 * Exposes listing images on a public trycloudflare URL so the widget API
 * can download /listings/{slug}/NN.webp during local dev.
 */
export function reihDevTunnel() {
  let publicOrigin = '';

  return {
    name: 'reih-dev-tunnel',
    apply: 'serve',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        const port = server.config.server.port ?? 5180;
        const proc = spawn(
          'npx',
          ['-y', 'cloudflared@latest', 'tunnel', '--url', `http://127.0.0.1:${port}`],
          { stdio: ['ignore', 'pipe', 'pipe'] },
        );

        const captureOrigin = (chunk) => {
          const match = chunk.toString().match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
          if (!match || publicOrigin) return;
          publicOrigin = match[0];
          server.config.logger.info(
            `\n  [reih] Widget image origin: ${publicOrigin}\n`,
          );
        };

        proc.stdout?.on('data', captureOrigin);
        proc.stderr?.on('data', captureOrigin);

        proc.on('exit', () => {
          publicOrigin = '';
        });

        server.httpServer?.on('close', () => {
          publicOrigin = '';
          proc.kill();
        });
      });

      server.middlewares.use('/__reih_public_origin', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        res.end(JSON.stringify({ origin: publicOrigin }));
      });
    },
  };
}
