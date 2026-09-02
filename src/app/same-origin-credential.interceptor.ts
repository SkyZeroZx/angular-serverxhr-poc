import { HttpInterceptorFn } from '@angular/common/http';

const TRUSTED_ORIGIN = new URL('http://127.0.0.1:4000/');
const DEMO_CREDENTIAL = 'Bearer AOT-LOCAL-DEMO-SECRET';

export const sameOriginCredentialInterceptor: HttpInterceptorFn = (req, next) => {
  // This intentionally mirrors the application-level validation described in
  // The input itself is NOT trimmed before the WHATWG parse.
  const checked = new URL(req.urlWithParams, TRUSTED_ORIGIN);

  console.log('\n[application interceptor]');
  console.log('raw request URL :', JSON.stringify(req.urlWithParams));
  console.log('WHATWG result   :', checked.href);
  console.log('checked origin  :', checked.origin);

  if (checked.origin !== TRUSTED_ORIGIN.origin) {
    throw new Error(`Cross-origin request blocked: ${checked.origin}`);
  }

  console.log('decision        : ALLOW');
  console.log('credential      : attached after same-origin check');

  return next(
    req.clone({
      setHeaders: {
        Authorization: DEMO_CREDENTIAL,
        'X-PoC-Marker': 'AOT-SSRXHR-PARSER-POC',
      },
    }),
  );
};
