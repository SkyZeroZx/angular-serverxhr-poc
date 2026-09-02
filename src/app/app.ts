import { DOCUMENT, isPlatformServer } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, PLATFORM_ID, inject, signal } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <main>
      <h1>Angular AOT SSR PoC</h1>
      <p>ServerXhr URL parser discrepancy</p>
      <p id="status">{{ status() }}</p>
      <pre id="target">{{ target() }}</pre>
    </main>
  `,
})
export class App {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly status = signal("No SSR request executed.");
  readonly target = signal("");

  constructor() {
    // Make the network request only during SSR. This keeps the browser side out
    // of the proof and makes the sink evidence unambiguously server-originated.
    if (!isPlatformServer(this.platformId)) {
      this.status.set(
        "Browser bootstrap: SSR-only PoC request intentionally skipped.",
      );
      return;
    }

    const target = new URLSearchParams(this.document.location.search).get(
      "target",
    );
    if (!target) {
      this.status.set(
        "Pass ?target=... to trigger the SSR HttpClient request.",
      );
      return;
    }

    this.target.set(JSON.stringify(target));
    this.status.set("SSR HttpClient request pending...");

    console.log("\n[Angular component]");
    console.log("decoded ?target =", JSON.stringify(target));

    this.http.get(target, { responseType: "text" }).subscribe({
      next: (body) => {
        console.log("[Angular component] HttpClient response =", body);
        this.status.set(`SSR HttpClient completed: ${body}`);
      },
      error: (error) => {
        console.error("[Angular component] HttpClient failed:", error);
        this.status.set(
          `SSR HttpClient failed: ${String(error?.message ?? error)}`,
        );
      },
    });
  }
}
