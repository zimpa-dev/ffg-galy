
import { 
  LayoutDashboard, 
  Newspaper, 
  HeartHandshake, 
  Users, 
  Coins, 
  Settings,
  LogOut,
  Bell
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Admin Sidebar */}
      <aside className="w-72 bg-white dark:bg-zinc-900 border-r flex flex-col hidden lg:flex">
        <div className="p-8 border-b">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="font-headline font-bold text-xl">Admin Panel</span>
          </Link>
        </div>
        
        <nav className="flex-grow p-6 space-y-2">
          <SidebarLink href="/admin" icon={LayoutDashboard} label="Tableau de bord" active />
          <SidebarLink href="/admin/news" icon={Newspaper} label="Actualités" />
          <SidebarLink href="/admin/programs" icon={HeartHandshake} label="Programmes" />
          <SidebarLink href="/admin/volunteers" icon={Users} label="Bénévoles" />
          <SidebarLink href="/admin/donations" icon={Coins} label="Dons" />
          <div className="pt-4 border-t mt-4">
            <SidebarLink href="/admin/settings" icon={Settings} label="Paramètres" />
          </div>
        </nav>

        <div className="p-6 border-t space-y-4">
          <div className="flex items-center gap-3 px-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              AD
            </div>
            <div className="flex-grow">
              <p className="text-sm font-bold">Admin FFG-VE</p>
              <p className="text-xs text-muted-foreground">admin@ffg-ve.org</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/5 gap-3">
            <LogOut className="h-4 w-4" /> Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col">
        <header className="h-20 bg-white dark:bg-zinc-900 border-b flex items-center justify-between px-8">
          <h2 className="text-sm font-medium text-muted-foreground">Vue d'ensemble</h2>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="h-4 w-4" /> Voir le site
              </Button>
            </Link>
          </div>
        </header>
        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {children}
        </div>
      </main>
    </div>
  )
}

function SidebarLink({ href, icon: Icon, label, active = false }: { href: string, icon: any, label: string, active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        active 
          ? "bg-primary text-white shadow-md shadow-primary/20" 
          : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground"
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  )
}

function ExternalLink(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  )
}
