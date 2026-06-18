
import Image from "next/image"
import { Shield, Target, Eye, Users2, ChevronRight } from "lucide-react"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  const values = [
    { title: "Solidarité", desc: "Nous croyons en la force du collectif pour surmonter les défis.", icon: HeartIcon },
    { title: "Transparence", desc: "Une gestion rigoureuse et des comptes ouverts à tous.", icon: Shield },
    { title: "Intégrité", desc: "Nos actions reflètent nos paroles, partout dans le monde.", icon: Target },
    { title: "Inclusion", desc: "Aider sans distinction de race, de religion ou de genre.", icon: Users2 },
  ]

  const team = [
    { name: "Dr. Amadou Diallo", role: "Président Fondateur", img: PlaceHolderImages.find(i => i.id === "team-leader")?.imageUrl },
    { name: "Marie Dubois", role: "Directrice des Programmes", img: "https://picsum.photos/seed/team2/400/400" },
    { name: "Sven Müller", role: "Trésorier", img: "https://picsum.photos/seed/team3/400/400" },
    { name: "Fatima Al-Sayed", role: "Responsable Logistique", img: "https://picsum.photos/seed/team4/400/400" },
  ]

  return (
    <div className="flex flex-col gap-0">
      {/* Intro section */}
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 max-w-4xl space-y-6">
          <h1 className="text-5xl md:text-7xl font-headline font-bold">Notre Engagement</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/80 leading-relaxed">
            Fondée en 2005, FFG-VE est née d'une vision simple : aucune souffrance ne devrait rester sans réponse. 
            Aujourd'hui, nous sommes une force de changement dans plus de 35 pays.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-20" />
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="bg-secondary/10 p-4 inline-block rounded-2xl mb-4">
              <Eye className="h-10 w-10 text-secondary" />
            </div>
            <h2 className="text-4xl font-headline font-bold">Notre Vision</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nous imaginons un monde où chaque individu, peu importe son lieu de naissance, a accès aux droits fondamentaux : une éducation de qualité, des soins de santé dignes et un environnement durable. Nous aspirons à éradiquer la pauvreté extrême par le développement communautaire.
            </p>
          </div>
          <div className="space-y-8">
            <div className="bg-primary/10 p-4 inline-block rounded-2xl mb-4">
              <Target className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-4xl font-headline font-bold">Notre Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Mobiliser les ressources humaines et financières pour répondre aux urgences humanitaires et accompagner les populations vers l'autonomie. FFG-VE agit sur le terrain avec les communautés locales pour garantir la pérennité de chaque projet.
            </p>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-headline font-bold text-center mb-16">Nos Valeurs Fondamentales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <Card key={i} className="border-none shadow-md hover:shadow-xl transition-shadow rounded-2xl">
                <CardContent className="p-8 space-y-4 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-2">
                    <v.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-headline font-bold">L'Équipe Dirigeante</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Des professionnels passionnés engagés pour la cause humanitaire.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {team.map((m, i) => (
              <div key={i} className="space-y-4 text-center group">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <Image src={m.img || ""} alt={m.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{m.name}</h3>
                  <p className="text-primary font-medium text-sm">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function HeartIcon(props: any) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}
