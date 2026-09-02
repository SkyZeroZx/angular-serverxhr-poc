import { ApplicationConfig } from "@angular/core";
import {
  provideHttpClient,
  withInterceptors,
  withXhr,
} from "@angular/common/http";
import { sameOriginCredentialInterceptor } from "./same-origin-credential.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXhr(),
      withInterceptors([sameOriginCredentialInterceptor]),
    ),
  ],
};
