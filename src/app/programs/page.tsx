
import Image from "next/image"
import Link from "next/link"
import { BookOpen, Stethoscope, Droplets, Leaf, Siren, Salad, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlaceHolderImages } from "@/lib/placeholder-images"

const programs = [
  {
    id: "aide-alimentaire",
    title: "Aide Alimentaire",
    icon: Salad,
    desc: "Distribution de repas chauds et de kits alimentaires aux familles en situation d'insécurité nutritionnelle.",
    img: "https://picsum.photos/seed/prog1/600/400",
    color: "bg-orange-50 text-orange-600"
  },
  {
    id: "sante",
    title: "Santé et Soins",
    icon: Stethoscope,
    desc: "Cliniques mobiles, programmes de vaccination et accès aux médicaments essentiels dans les zones reculées.",
    img: PlaceHolderImages.find(i => i.id === "program-health")?.imageUrl,
    color: "bg-blue-50 text-blue-600"
  },
  {
    id: "education",
    title: "Éducation",
    icon: BookOpen,
    desc: "Bourses d'études, construction d'écoles et formation continue pour les enseignants locaux.",
    img: PlaceHolderImages.find(i => i.id === "program-education")?.imageUrl,
    color: "bg-green-50 text-green-600"
  },
  {
    id: "eau",
    title: "Eau Potable",
    icon: Droplets,
    desc: "Forage de puits, systèmes de filtration d'eau et éducation à l'hygiène pour prévenir les maladies.",
    img: PlaceHolderImages.find(i => i.id === "program-water")?.imageUrl,
    color: "bg-cyan-50 text-cyan-600"
  },
  {
    id: "developpement",
    title: "Développement Durable",
    icon: Leaf,
    desc: "Soutien aux coopératives agricoles et micro-projets générateurs de revenus pour l'autonomie.",
    img: "https://picsum.photos/seed/prog5/600/400",
    color: "bg-emerald-50 text-emerald-600"
  },
  {
    id: "urgence",
    title: "Aide d'Urgence",
    icon: Siren,
    desc: "Intervention rapide lors de catastrophes naturelles ou de conflits pour sauver des vies immédiatement.",
    img: PlaceHolderImages.find(i => i.id === "hero-humanitarian")?.imageUrl,
    color: "bg-red-50 text-red-600"
  }
]

export default function ProgramsPage() {
  return (
    <div className="py-20 space-y-24">
      <div className="container mx-auto px-4 text-center max-w-3xl space-y-6">
        <h1 className="text-5xl font-headline font-bold text-primary">Nos Programmes</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Nous intervenons à travers des programmes structurés pour répondre aux besoins fondamentaux tout en préparant un avenir autonome pour les populations.
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {programs.map((prog) => (
            <Card key={prog.id} id={prog.id} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl flex flex-col group">
              <div className="relative h-60">
                <Image 
                  src={prog.img || ""} 
                  alt={prog.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className={`absolute top-4 left-4 p-3 rounded-2xl ${prog.color.split(' ')[0]} shadow-lg`}>
                  <prog.icon className={`h-6 w-6 ${prog.color.split(' ')[1]}`} />
                </div>
              </div>
              <CardContent className="p-8 space-y-6 flex-grow flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-2xl font-headline font-bold">{prog.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{prog.desc}</p>
                </div>
                <div className="pt-4">
                  <Link href="/donate">
                    <Button variant="ghost" className="p-0 h-auto font-bold text-primary hover:bg-transparent hover:text-primary/80 group/btn">
                      Soutenir ce programme <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <section className="bg-primary text-white py-20 overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-xl">
            <h2 className="text-4xl font-headline font-bold">Vous souhaitez en faire plus ?</h2>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              Nous recherchons constamment des partenaires et des experts pour renforcer l'impact de nos programmes.
            </p>
            <div className="flex gap-4">
              <Link href="/volunteer">
                <Button className="bg-secondary text-white font-bold h-12 px-8">Devenir Partenaire</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-8 font-bold">Nous Contacter</Button>
              </Link>
            </div>
          </div>
          <div className="relative w-full max-w-md h-80 rounded-3xl overflow-hidden shadow-2xl rotate-2">
            <Image 
              src={PlaceHolderImages.find(i => i.id === "project-gallery-1")?.imageUrl || ""} 
              alt="Community Work" 
              fill 
              className="object-cover" 
            />
          </div>
        </div>
      </section>
    </div>
  )
}
