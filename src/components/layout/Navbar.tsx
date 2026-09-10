
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Globe, Moon, Sun, Heart, Check, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useFirestore, useDoc, useUser } from "@/firebase"
import { doc } from "firebase/firestore"
import { useLanguage } from "@/components/language-provider"
import { Language } from "@/lib/translations"

const languages = [
  { code: "de", name: "Deutsch" },
  { code: "en", name: "English" },
  { code: "fr", name: "Français" }
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const { language, setLanguage, t } = useLanguage()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const db = useFirestore()
  const { user } = useUser()
  
  const settingsRef = React.useMemo(() => {
    if (!db) return null;
    return doc(db, "site_settings", "general");
  }, [db]);

  const { data: settings } = useDoc(settingsRef);

  const navLinks = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.about, href: "/about" },
    { name: t.nav.programs, href: "/programs" },
    { name: t.nav.gallery, href: "/transparency" },
    { name: t.nav.news, href: "/news" },
    { name: t.nav.contact, href: "/contact" },
  ]

  const isAdminPath = pathname.startsWith('/admin')

  if (isAdminPath) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center space-x-3 group transition-transform hover:scale-105">
            {settings?.logoUrl ? (
              <div className="relative h-12 w-auto min-w-[40px] flex items-center">
                <img 
                  src={settings.logoUrl} 
                  alt={settings?.orgName || "Logo"} 
                  className={cn(
                    "h-10 w-auto object-contain transition-all",
                    theme === 'dark' && !settings.logoUrl.includes('data:') && "brightness-0 invert"
                  )} 
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-headline font-bold text-xl">F</span>
              </div>
            )}
            <span className="font-headline font-bold text-2xl tracking-tight hidden sm:inline-block">
              {settings?.orgName || "FFG-VE"}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-semibold transition-all hover:text-primary relative py-2",
                  pathname === link.href 
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full" 
                    : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full gap-2 px-3 h-10 border border-transparent hover:border-border transition-all">
                <Globe className="h-4 w-4" />
                <span className="uppercase font-bold text-xs">{language}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-2xl p-2 shadow-2xl border-none">
              {languages.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code} 
                  onClick={() => setLanguage(lang.code as Language)}
                  className="rounded-xl py-2.5 px-3 cursor-pointer focus:bg-primary focus:text-white transition-colors flex justify-between items-center"
                >
                  <span className="font-medium">{lang.name}</span>
                  {language === lang.code && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 border border-transparent hover:border-border transition-all"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-500" />
            </Button>
            
            {user ? (
              <Link href="/admin">
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10" title={t.nav.admin}>
                  <Lock className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 border border-transparent hover:border-border transition-all" title={t.nav.login}>
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>

          <Link href="/donate">
            <Button className="hidden sm:flex font-bold shadow-xl shadow-secondary/20 bg-secondary hover:bg-secondary/90 text-white rounded-full px-5 lg:px-8 h-12 transition-all hover:scale-105 active:scale-95">
              <Heart className="mr-2 h-4 w-4 fill-current" />
              {t.nav.donate}
            </Button>
          </Link>

          <button
            className="lg:hidden p-2 rounded-xl bg-muted/50 text-foreground transition-colors hover:bg-muted"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bg-background border-b shadow-2xl animate-in slide-in-from-top duration-300 overflow-y-auto max-h-[calc(100vh-80px)]">
          <div className="container mx-auto px-6 py-8 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "text-xl font-bold p-3 rounded-2xl transition-all",
                    pathname === link.href 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="pt-6 border-t flex flex-col gap-4">
              <Link href="/donate" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-secondary text-white font-bold h-14 rounded-2xl shadow-xl shadow-secondary/20 text-lg">
                  {t.nav.donate}
                </Button>
              </Link>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-2xl gap-2"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <Sun className="h-4 w-4 dark:hidden text-amber-500" />
                  <Moon className="h-4 w-4 hidden dark:block text-blue-500" />
                  <span className="font-semibold">{theme === "dark" ? "Light" : "Dark"}</span>
                </Button>
                <Link
                  href={user ? "/admin" : "/login"}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full h-12 rounded-2xl gap-2">
                    {user ? <Lock className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    <span className="font-semibold">{user ? t.nav.admin : t.nav.login}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
