
'use client';

import * as React from "react";
import { useAuth, useUser } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";
import Link from "next/link";

export default function LoginPage() {
  const auth = useAuth();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setError(null);
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push('/admin');
    } catch (err: any) {
      const code = err?.code ?? "unknown";
      console.error("Login failed", code, err);
      if (code === "auth/operation-not-allowed") {
        setError("Le fournisseur Email/Mot de passe n'est pas activé dans Firebase (Authentication → Sign-in method).");
      } else if (code === "auth/invalid-email") {
        setError("Adresse email invalide.");
      } else if (code === "auth/too-many-requests") {
        setError("Trop de tentatives. Réessayez plus tard ou réinitialisez le mot de passe.");
      } else {
        setError(`${t.auth.errorInvalid} (${code})`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    setError(null);
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/admin');
    } catch (err) {
      console.error("Login failed", err);
      setError(t.auth.errorInvalid);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium">
        <ArrowLeft className="h-4 w-4" /> {t.auth.backHome}
      </Link>

      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
        <div className="bg-primary p-8 text-white text-center space-y-2">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold">{t.auth.loginTitle}</CardTitle>
          <CardDescription className="text-primary-foreground/80">{t.auth.loginSubtitle}</CardDescription>
        </div>
        <CardContent className="p-8 md:p-12 space-y-6">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder={t.auth.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-2xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.auth.passwordLabel}</Label>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder={t.auth.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-2xl"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}
            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-md"
            >
              {isLoggingIn ? <Loader2 className="h-5 w-5 animate-spin" /> : t.auth.signInBtn}
            </Button>
          </form>

          <div className="flex items-center gap-4">
            <div className="h-px flex-grow bg-border" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground">{t.auth.orDivider}</span>
            <div className="h-px flex-grow bg-border" />
          </div>

          <Button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full h-14 rounded-2xl bg-white border-2 hover:bg-zinc-50 text-zinc-900 font-bold flex items-center justify-center gap-3 shadow-md"
          >
            {isLoggingIn ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {t.auth.googleBtn}
          </Button>

          <p className="text-center text-xs text-muted-foreground leading-relaxed">
            {t.auth.restricted}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
