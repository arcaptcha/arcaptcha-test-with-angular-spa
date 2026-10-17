import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="auth-layout page-shell signup-layout">
      <div class="auth-intro">
        <span class="eyebrow">Get started</span>
        <h1>Make yourself at home.</h1>
        <p>Create a demo account to explore the signup route. Connect this form to your own account API when you’re ready.</p>
      </div>
      <div class="auth-card">
        <p class="eyebrow">New account</p>
        <h2>Create your account</h2>
        <p class="card-description">It only takes a minute.</p>
        <form (ngSubmit)="submit()" #signupForm="ngForm">
          <label for="signup-name">Full name</label>
          <input id="signup-name" name="name" [(ngModel)]="name" autocomplete="name" required placeholder="Your name" />
          <label for="signup-email">Email address</label>
          <input id="signup-email" name="email" [(ngModel)]="email" type="email" autocomplete="email" required placeholder="you@example.com" />
          <label for="signup-password">Password</label>
          <input id="signup-password" name="password" [(ngModel)]="password" type="password" autocomplete="new-password" required minlength="8" placeholder="At least 8 characters" />
          <p class="form-message success-message" *ngIf="message">{{ message }}</p>
          <button class="button button-primary button-full" type="submit" [disabled]="!signupForm.valid">Create account</button>
        </form>
        <p class="panel-footnote">Signup is local-only; no account is created or stored.</p>
      </div>
    </section>
  `,
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  message = '';

  submit(): void {
    this.message = `Thanks, ${this.name}! This demo signup has been submitted.`;
  }
}
