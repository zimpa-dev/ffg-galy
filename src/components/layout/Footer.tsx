
import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, Lock } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary font-headline font-bold text-xl">F</span>
              </div>
              <span className="font-headline font-bold text-2xl">FFG-VE</span>
            </Link>
            <p className="text-primary-foreground/80 leading-relaxed">
              Ensemble pour un monde plus solidaire. Nous œuvrons pour un impact durable à travers l'éducation, la santé et le développement communautaire.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-secondary transition-colors"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-secondary transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-secondary transition-colors"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-secondary transition-colors"><Linkedin className="h-5 w-5" /></Link>
            </div>
          </div>

          <div>
            <h3 className="font-headline font-bold text-lg mb-6">Liens Rapides</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="hover:text-secondary transition-colors">Notre Histoire</Link></li>
              <li><Link href="/programs" className="hover:text-secondary transition-colors">Nos Programmes</Link></li>
              <li><Link href="/news" className="hover:text-secondary transition-colors">Actualités</Link></li>
              <li><Link href="/transparency" className="hover:text-secondary transition-colors">Transparence</Link></li>
              <li><Link href="/volunteer" className="hover:text-secondary transition-colors">Devenir Bénévole</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline font-bold text-lg mb-6">Contactez-nous</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                <span>123 Avenue de la Solidarité, 75001 Paris, France</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>contact@ffg-ve.org</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline font-bold text-lg mb-6">Newsletter</h3>
            <p className="text-primary-foreground/80 mb-4">Restez informé de nos actions et de notre impact.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="bg-white/10 border-white/20 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
              />
              <button className="bg-secondary px-4 py-2 rounded-md font-bold text-sm hover:bg-secondary/90 transition-colors">S'inscrire</button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} FFG-VE Horizon. Tous droits réservés.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/legal" className="hover:text-white">Mentions légales</Link>
            <Link href="/privacy" className="hover:text-white">Confidentialité</Link>
            <Link href="/admin" className="hover:text-secondary flex items-center gap-1 font-bold">
              <Lock className="h-3 w-3" /> Espace Administration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
