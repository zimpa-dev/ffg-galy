
'use client';

import * as React from "react"
import { 
  LayoutDashboard, 
  Newspaper, 
  HeartHandshake, 
  Users, 
  Coins, 
  Settings,
  LogOut,
  Bell,
  Menu,
  ExternalLink as ExternalLinkIcon,
  Info,
  Image as ImageIcon,
  ShieldCheck,
  FileText
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useAuth, useUser } from "@/firebase"
import { signOut } from "firebase/auth"
import { Loader2 } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const auth = useAuth()
  const { user, loading } = useUser()

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [loading, user, router])

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth)
    }
    router.replace("/login")
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  const sidebarLinks = [
    { href: "/admin", icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/admin/news", icon: Newspaper, label: "Actualités" },
    { href: "/admin/programs", icon: HeartHandshake, label: "Programmes" },
    { href: "/admin/about", icon: Info, label: "À Propos" },
    { href: "/admin/blog", icon: FileText, label: "Blog" },
    { href: "/admin/gallery", icon: ImageIcon, label: "Galerie" },
    { href: "/admin/volunteers", icon: Users, label: "Bénévoles" },
    { href: "/admin/donations", icon: Coins, label: "Dons" },
    { href: "/admin/privacy", icon: ShieldCheck, label: "Confidentialité" },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-8 border-b">
        <Link href="/admin" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-headline font-bold text-xl">Admin FFG</span>
        </Link>
      </div>
      
      <nav className="flex-grow p-6 space-y-2">
        {sidebarLinks.map((link) => (
          <SidebarLink 
            key={link.href}
            href={link.href} 
            icon={link.icon} 
            label={link.label} 
            active={pathname === link.href}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        ))}
        <div className="pt-4 border-t mt-4">
          <SidebarLink 
            href="/admin/settings" 
            icon={Settings} 
            label="Paramètres" 
            active={pathname === "/admin/settings"}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </div>
      </nav>

      <div className="p-6 border-t space-y-4">
        <div className="flex items-center gap-3 px-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            AD
          </div>
          <div className="flex-grow overflow-hidden">
            <p className="text-sm font-bold truncate">Admin FFG-VE</p>
            <p className="text-xs text-muted-foreground truncate">admin@ffg-ve.org</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-destructive transition-colors rounded-xl hover:bg-destructive/5 gap-3"
        >
          <LogOut className="h-4 w-4" /> Déconnexion
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-white dark:bg-zinc-900 border-r hidden lg:flex flex-col fixed inset-y-0">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow lg:pl-72 flex flex-col min-h-screen">
        <header className="h-20 bg-white dark:bg-zinc-900 border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu de navigation</SheetTitle>
                  <SheetDescription>Accédez aux différentes sections de l'administration</SheetDescription>
                </SheetHeader>
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h2 className="text-sm md:text-base font-bold text-foreground">
              {sidebarLinks.find(l => l.href === pathname)?.label || "Administration"}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="relative hidden sm:flex">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLinkIcon className="h-4 w-4" /> <span className="hidden sm:inline">Voir le site</span>
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-grow p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarLink({ href, icon: Icon, label, active = false, onClick }: { href: string, icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
        active 
          ? "bg-primary text-white shadow-md shadow-primary/20" 
          : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  )
}
