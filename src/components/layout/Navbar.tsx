
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

type Language = "de" | "en" | "fr"

const translations = {
  de: {
    home: "Startseite",
    about: "Über uns",
    programs: "Programme",
    gallery: "Galerie",
    news: "Aktuelles",
    contact: "Kontakt",
    donate: "Spenden",
    theme: "Erscheinungsbild",
    lang: "Sprache"
  },
  en: {
    home: "Home",
    about: "About Us",
    programs: "Programs",
    gallery: "Gallery",
    news: "News",
    contact: "Contact",
    donate: "Donate Now",
    theme: "Appearance",
    lang: "Language"
  },
  fr: {
    home: "Accueil",
    about: "À Propos",
    programs: "Nos Programmes",
    gallery: "Galerie",
    news: "Actualités",
    contact: "Contact",
    donate: "Faire un don",
    theme: "Apparence",
    lang: "Langue"
  }
}

const languages = [
  { code: "de", name: "Deutsch" },
  { code: "en", name: "English" },
  { code: "fr", name: "Français" }
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentLang, setCurrentLang] = React.useState<Language>("de")
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const db = useFirestore()
  
  const settingsRef = React.useMemo(() => {
    if (!db) return null;
    return doc(db, "site_settings", "general");
  }, [db]);

  const { data: settings } = useDoc(settingsRef);

  const t = translations[currentLang];

  const navLinks = [
    { name: t.home, href: "/" },
    { name: t.about, href: "/about" },
    { name: t.programs, href: "/programs" },
    { name: t.gallery, href: "/transparency" },
    { name: t.news, href: "/news" },
    { name: t.contact, href: "/contact" },
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
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 px-2 md:px-4">
                <Globe className="h-4 w-4" />
                <span className="hidden md:inline-block uppercase font-bold text-xs">{currentLang}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl">
              {languages.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code} 
                  onClick={() => setCurrentLang(lang.code as Language)}
                  className="justify-between cursor-pointer"
                >
                  {lang.name}
                  {currentLang === lang.code && <Check className="h-4 w-4 text-primary" />}
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
              <span className="sr-only">{t.theme}</span>
            </Button>
          </div>

          <Link href="/donate">
            <Button className="hidden sm:flex font-semibold shadow-md bg-secondary hover:bg-secondary/90 text-white rounded-full px-6">
              <Heart className="mr-2 h-4 w-4 fill-current" />
              {t.donate}
            </Button>
          </Link>

          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-background border-b animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-lg font-medium hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t flex items-center justify-between gap-4 flex-wrap">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? "Hell" : "Dunkel"}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Globe className="h-4 w-4" /> {currentLang.toUpperCase()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl">
                    {languages.map((lang) => (
                      <DropdownMenuItem key={lang.code} onClick={() => setCurrentLang(lang.code as Language)}>
                        {lang.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link href="/donate" onClick={() => setIsOpen(false)}>
                <Button className="bg-secondary text-white font-bold rounded-full">{t.donate}</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
