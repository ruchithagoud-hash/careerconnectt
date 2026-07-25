import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy · CareerConnect" },
      { name: "description", content: "How CareerConnect collects, uses, and protects your information." },
      { property: "og:title", content: "Privacy Policy · CareerConnect" },
      { property: "og:description", content: "How CareerConnect collects, uses, and protects your information." },
    ],
  }),
  component: PrivacyPage,
});

const LAST_UPDATED = "July 25, 2026";
const CONTACT_EMAIL = "privacy@careerconnect.app";

function PrivacyPage() {
  return (
    <AppShell>
      <main className="relative flex flex-1 flex-col px-5 pb-10 pt-6 sm:px-6">
        <div className="absolute inset-x-0 top-0 -z-0 h-32 bg-gradient-soft" />
        <div className="relative z-10 mx-auto w-full max-w-2xl">
          <Link to="/" className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold tracking-tight">CareerConnect</span>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight">CareerConnect Privacy Policy</h1>
          <p className="mt-2 text-xs text-muted-foreground">Last updated: {LAST_UPDATED}</p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground">
            <p className="text-muted-foreground">
              This Privacy Policy explains how CareerConnect ("we", "our", or "us") collects, uses, and protects
              information when you use our career recommendation application. By using CareerConnect, you agree
              to the practices described below.
            </p>

            <Section title="1. Information We Collect">
              <ul className="ml-5 list-disc space-y-1.5">
                <li><span className="font-semibold">Account information</span> — name, email address, and password (stored as a secure hash).</li>
                <li><span className="font-semibold">Assessment inputs</span> — education, technical skills, certifications, projects, interests, and experience you provide.</li>
                <li><span className="font-semibold">LinkedIn profile data</span> — name, email, and profile picture, only if you sign in with LinkedIn.</li>
                <li><span className="font-semibold">Usage data</span> — basic technical information such as device type, browser, and pages visited.</li>
              </ul>
            </Section>

            <Section title="2. How We Use Your Information">
              <ul className="ml-5 list-disc space-y-1.5">
                <li>Generate personalized career recommendations and roadmaps.</li>
                <li>Authenticate you and maintain secure sessions.</li>
                <li>Improve the accuracy of our recommendation engine.</li>
                <li>Communicate account-related notifications (verification, password reset).</li>
              </ul>
              <p className="mt-2 text-muted-foreground">We do not sell your personal information.</p>
            </Section>

            <Section title="3. Email Authentication">
              <p>
                When you register with an email and password, we send a verification link to confirm your address.
                Passwords are never stored in plain text. You can reset your password at any time through the
                "Forgot password" flow, which delivers a secure reset link to your inbox.
              </p>
            </Section>

            <Section title="4. LinkedIn Authentication">
              <p>
                If you choose "Continue with LinkedIn", we use LinkedIn's OpenID Connect flow to obtain your
                name, email, and profile picture. We only request the minimum scopes required to identify you
                (<code className="rounded bg-secondary px-1 py-0.5 text-xs">openid</code>,{" "}
                <code className="rounded bg-secondary px-1 py-0.5 text-xs">profile</code>,{" "}
                <code className="rounded bg-secondary px-1 py-0.5 text-xs">email</code>). We do not post to
                LinkedIn on your behalf and do not access your connections.
              </p>
            </Section>

            <Section title="5. Cookies and Local Storage">
              <p>
                CareerConnect uses local storage and cookies set by our authentication provider to keep you
                signed in across sessions. These are strictly necessary for the app to function. We do not use
                third-party advertising cookies.
              </p>
            </Section>

            <Section title="6. Data Security">
              <p>
                Data is transmitted over HTTPS and stored on managed infrastructure with encryption at rest.
                Access to production data is restricted and audited. While we take reasonable measures to
                protect your information, no method of transmission or storage is 100% secure.
              </p>
            </Section>

            <Section title="7. Third-Party Services">
              <ul className="ml-5 list-disc space-y-1.5">
                <li>
                  <span className="font-semibold">Supabase</span> — provides authentication and database services.
                  Your account and assessment data are stored securely on Supabase infrastructure.
                </li>
                <li>
                  <span className="font-semibold">LinkedIn</span> — used only when you elect to sign in with
                  LinkedIn. Their use of your data is governed by the{" "}
                  <a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">LinkedIn Privacy Policy</a>.
                </li>
              </ul>
            </Section>

            <Section title="8. Your Rights">
              <ul className="ml-5 list-disc space-y-1.5">
                <li>Access the personal information associated with your account.</li>
                <li>Correct or update inaccurate information.</li>
                <li>Request deletion of your account and associated data.</li>
                <li>Withdraw consent for optional processing at any time.</li>
              </ul>
              <p className="mt-2 text-muted-foreground">
                To exercise any of these rights, contact us using the details below.
              </p>
            </Section>

            <Section title="9. Contact">
              <p>
                Questions about this policy or your data? Reach us at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary hover:underline">{CONTACT_EMAIL}</a>.
              </p>
            </Section>

            <p className="pt-4 text-xs text-muted-foreground">
              We may update this policy from time to time. Material changes will be reflected by an updated
              "Last updated" date at the top of this page.
            </p>
          </div>
        </div>
      </main>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-bold tracking-tight text-foreground">{title}</h2>
      <div className="mt-2 space-y-2 text-sm text-foreground/90">{children}</div>
    </section>
  );
}
