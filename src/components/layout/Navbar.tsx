
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Globe, Moon, Sun, Heart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useFirestore, useDoc } from "@/firebase"
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

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-3">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-headline font-bold text-xl">F</span>
              </div>
            )}
            <span className="font-headline font-bold text-2xl hidden sm:inline-block">
              {settings?.orgName || "FFG-VE"}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary font-bold" : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 px-2 md:px-4">
                <Globe className="h-4 w-4" />
                <span className="hidden md:inline-block uppercase font-bold text-xs">{language}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl">
              {languages.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code} 
                  onClick={() => setLanguage(lang.code as Language)}
                  className="justify-between cursor-pointer"
                >
                  {lang.name}
                  {language === lang.code && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>

          <Link href="/donate">
            <Button className="hidden sm:flex font-semibold shadow-md bg-secondary hover:bg-secondary/90 text-white rounded-full px-6">
              <Heart className="mr-2 h-4 w-4 fill-current" />
              {t.nav.donate}
            </Button>
          </Link>

          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-background border-b animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-medium hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t flex flex-col gap-4">
              <Link href="/donate" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-secondary text-white font-bold rounded-full">{t.nav.donate}</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
