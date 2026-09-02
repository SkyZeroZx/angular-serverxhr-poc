import http from 'node:http';

const HOST = '127.0.0.2';
const PORT = 5000;
const events = [];

const server = http.createServer((req, res) => {
  if (req.url === '/__reset') {
    events.length = 0;
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/__events') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(events, null, 2));
    return;
  }

  const event = {
    method: req.method,
    url: req.url,
    host: req.headers.host ?? null,
    authorization: req.headers.authorization ?? null,
    marker: req.headers['x-poc-marker'] ?? null,
  };
  events.push(event);

  console.log('\n=== LOCAL ATTACKER SINK RECEIVED REQUEST ===');
  console.log(JSON.stringify(event, null, 2));
  console.log('============================================\n');

  res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
  res.end('LOCAL_ATTACKER_SINK_OK');
});

server.listen(PORT, HOST, () => {
  console.log(`Local attacker sink listening on http://${HOST}:${PORT}`);
  console.log(`Evidence endpoint: http://${HOST}:${PORT}/__events`);
});
