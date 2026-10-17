import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArcaptchaService, RenderedCaptcha } from '../services/arcaptcha.service';

type LoginStep = 'phone' | 'otp';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="auth-layout page-shell">
      <div class="auth-intro">
        <span class="eyebrow">Secure access</span>
        <h1>Welcome back.</h1>
        <p>Sign in with your phone number and a one-time code. ARCaptcha is rendered on the code verification step.</p>
        <div class="auth-mini-card">
          <div class="mini-icon">✦</div>
          <div><strong>One more layer of trust</strong><span>Verify the visitor before accepting the OTP.</span></div>
        </div>
      </div>

      <div class="auth-card">
        <div class="step-indicator"><span [class.current]="step === 'phone'" [class.complete]="step === 'otp'">1</span><i></i><span [class.current]="step === 'otp'">2</span></div>
        <ng-container *ngIf="step === 'phone'; else otpForm">
          <p class="eyebrow">Step 1 of 2</p>
          <h2>Enter your phone</h2>
          <p class="card-description">We’ll send a one-time code to verify it’s you.</p>
          <form (ngSubmit)="requestCode()" #phoneForm="ngForm">
            <label for="phone">Phone number</label>
            <input id="phone" name="phone" [(ngModel)]="phone" type="tel" autocomplete="tel" required minlength="8" placeholder="+1 555 123 4567" />
            <p class="form-message" *ngIf="errorMessage">{{ errorMessage }}</p>
            <button class="button button-primary button-full" type="submit" [disabled]="!phoneForm.valid">Continue <span aria-hidden="true">→</span></button>
          </form>
          <p class="panel-footnote">No SMS is sent in this frontend-only demo.</p>
        </ng-container>

        <ng-template #otpForm>
          <p class="eyebrow">Step 2 of 2</p>
          <h2>Check your messages</h2>
          <p class="card-description">Enter the code sent to <strong>{{ phone }}</strong>. For this demo, use <strong>123456</strong>.</p>
          <form (ngSubmit)="verifyCode()" #otpNgForm="ngForm">
            <label for="otp">One-time code</label>
            <input id="otp" name="otp" [(ngModel)]="otp" inputmode="numeric" autocomplete="one-time-code" required minlength="6" maxlength="6" placeholder="6-digit code" />
            <label class="captcha-label">Human verification</label>
            <div #otpCaptcha class="captcha-slot" aria-label="ARCaptcha verification"></div>
            <p class="form-message" *ngIf="errorMessage">{{ errorMessage }}</p>
            <p class="form-message success-message" *ngIf="successMessage">{{ successMessage }}</p>
            <button class="button button-primary button-full" type="submit" [disabled]="!otpNgForm.valid">Verify and sign in</button>
          </form>
          <button class="back-link" type="button" (click)="editPhone()">← Change phone number</button>
        </ng-template>
      </div>
    </section>
  `,
})
export class LoginComponent implements OnDestroy {
  @ViewChild('otpCaptcha') private captchaHost?: ElementRef<HTMLDivElement>;

  step: LoginStep = 'phone';
  phone = '';
  otp = '';
  errorMessage = '';
  successMessage = '';
  captchaToken = '';
  private captcha?: RenderedCaptcha;

  constructor(private readonly arcaptcha: ArcaptchaService) {}

  requestCode(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.step = 'otp';
    window.setTimeout(() => this.mountCaptcha(), 0);
  }

  verifyCode(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.captchaToken) {
      this.errorMessage = 'Complete the ARCaptcha challenge before continuing.';
      return;
    }
    if (this.otp !== '123456') {
      this.errorMessage = 'That code is incorrect. Use 123456 in this demo.';
      return;
    }
    this.successMessage = 'You’re signed in for this demo. A real app should verify the OTP and captcha token on its backend.';
  }

  editPhone(): void {
    this.captcha?.destroy();
    this.captcha = undefined;
    this.captchaToken = '';
    this.otp = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.step = 'phone';
  }

  ngOnDestroy(): void {
    this.captcha?.destroy();
  }

  private mountCaptcha(): void {
    const host = this.captchaHost?.nativeElement;
    if (!host) return;
    this.captcha?.destroy();
    this.captchaToken = '';
    void this.arcaptcha
      .render(
        host,
        (token) => {
          this.captchaToken = token;
          this.errorMessage = '';
        },
        (error) => (this.errorMessage = error),
      )
      .then((captcha) => (this.captcha = captcha))
      .catch((error: unknown) => {
        this.errorMessage = error instanceof Error ? error.message : 'Unable to render ARCaptcha.';
      });
  }
}
