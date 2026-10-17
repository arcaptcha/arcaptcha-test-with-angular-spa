import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero page-shell">
      <div class="hero-copy">
        <span class="status-pill"><span class="status-dot"></span> A small Angular demo</span>
        <h1>Good sign-in starts with a little more <span>certainty.</span></h1>
        <p class="hero-description">A simple multi-route app showing ARCaptcha in a header login form and a phone-based OTP flow.</p>
        <div class="hero-actions">
          <a class="button button-primary" routerLink="/login">Try phone login <span aria-hidden="true">→</span></a>
          <a class="text-link" routerLink="/signup">Create an account</a>
        </div>
        <p class="hero-note">Use the Login button in the top navigation to try the username and password form.</p>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="orbit orbit-one"></div>
        <div class="orbit orbit-two"></div>
        <div class="shield-card">
          <div class="shield-icon"><span></span></div>
          <div class="shield-line long"></div>
          <div class="shield-line short"></div>
          <div class="shield-check">✓</div>
        </div>
        <div class="floating-chip chip-top"><span class="chip-dot"></span> Human verified</div>
        <div class="floating-chip chip-bottom">Secure by design <span>✦</span></div>
      </div>
    </section>
    <section class="feature-strip page-shell">
      <div><span class="feature-number">01</span><h2>Home</h2><p>Start here and explore the demo routes.</p></div>
      <div><span class="feature-number">02</span><h2>Phone OTP</h2><p>Enter a number, then verify a demo code with ARCaptcha.</p></div>
      <div><span class="feature-number">03</span><h2>Header login</h2><p>Protect the username and password form with a widget.</p></div>
    </section>
  `,
})
export class HomeComponent {}
