import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ArcaptchaService, RenderedCaptcha } from '../services/arcaptcha.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <div class="nav-shell">
        <a class="brand" routerLink="/" aria-label="Arcaptcha demo home">
          <span class="brand-mark">A</span>
          <span>arcaptcha<span class="brand-light">.demo</span></span>
        </a>

        <nav class="main-nav" aria-label="Main navigation">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/login" routerLinkActive="active">Login</a>
          <a routerLink="/signup" routerLinkActive="active">Sign up</a>
        </nav>

        <div class="header-actions">
          <button class="button button-dark header-login" type="button" (click)="toggleLogin()">
            {{ showLogin ? 'Close' : 'Login' }}
          </button>
          <a class="button button-primary header-signup" routerLink="/signup">Create account</a>
        </div>
      </div>

      <div class="header-login-panel" *ngIf="showLogin">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Welcome back</p>
            <h2>Log in to your account</h2>
          </div>
          <button class="icon-button" type="button" aria-label="Close login form" (click)="closeLogin()">×</button>
        </div>
        <form (ngSubmit)="submitLogin()" #headerForm="ngForm">
          <label for="header-username">Username</label>
          <input id="header-username" name="username" [(ngModel)]="username" autocomplete="username" required placeholder="Your username" />
          <label for="header-password">Password</label>
          <input id="header-password" name="password" [(ngModel)]="password" type="password" autocomplete="current-password" required placeholder="Your password" />
          <div #headerCaptcha class="captcha-slot" aria-label="ARCaptcha verification"></div>
          <p class="form-message" *ngIf="captchaError">{{ captchaError }}</p>
          <p class="form-message success-message" *ngIf="message">{{ message }}</p>
          <button class="button button-primary button-full" type="submit" [disabled]="!headerForm.valid">Log in</button>
          <p class="panel-footnote">Demo form — connect it to your authentication API.</p>
        </form>
      </div>
    </header>
  `,
})
export class HeaderComponent implements OnDestroy {
  @ViewChild('headerCaptcha') private captchaHost?: ElementRef<HTMLDivElement>;

  showLogin = false;
  username = '';
  password = '';
  captchaToken = '';
  captchaError = '';
  message = '';
  private captcha?: RenderedCaptcha;

  constructor(private readonly arcaptcha: ArcaptchaService) {}

  toggleLogin(): void {
    if (this.showLogin) {
      this.closeLogin();
      return;
    }
    this.showLogin = true;
    this.message = '';
    this.captchaError = '';
    window.setTimeout(() => this.mountCaptcha(), 0);
  }

  closeLogin(): void {
    this.showLogin = false;
    this.captcha?.destroy();
    this.captcha = undefined;
    this.captchaToken = '';
  }

  submitLogin(): void {
    this.message = '';
    if (!this.captchaToken) {
      this.captchaError = 'Complete the ARCaptcha challenge before continuing.';
      return;
    }
    this.captchaError = '';
    this.message = 'Demo login submitted. Your backend should verify the ARCaptcha token.';
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
          this.captchaError = '';
        },
        (error) => (this.captchaError = error),
      )
      .then((captcha) => (this.captcha = captcha))
      .catch((error: unknown) => {
        this.captchaError = error instanceof Error ? error.message : 'Unable to render ARCaptcha.';
      });
  }
}
