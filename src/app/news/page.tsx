
"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight, Sparkles, Loader2, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { draftContent } from "@/ai/flows/ai-content-drafting-assistant"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const blogPosts = [
  {
    title: "Succès de la mission de vaccination au Togo",
    excerpt: "Plus de 50 000 enfants ont été vaccinés grâce à votre soutien et à nos équipes mobiles.",
    date: "12 Mars 2024",
    author: "Dr. Elena Rossi",
    category: "Santé",
    image: PlaceHolderImages.find(i => i.id === "program-health")?.imageUrl
  },
  {
    title: "Inauguration de l'école Solidaire à Bamako",
    excerpt: "Une nouvelle structure moderne accueillant 400 élèves a ouvert ses portes cette semaine.",
    date: "5 Mars 2024",
    author: "Marc Lefebvre",
    category: "Éducation",
    image: PlaceHolderImages.find(i => i.id === "program-education")?.imageUrl
  },
  {
    title: "Rapport d'Impact Trimestriel : T1 2024",
    excerpt: "Découvrez les chiffres clés et les histoires humaines de nos interventions récentes.",
    date: "28 Février 2024",
    author: "Sarah Mendy",
    category: "Impact",
    image: PlaceHolderImages.find(i => i.id === "project-gallery-1")?.imageUrl
  }
]

export default function NewsPage() {
  const [drafting, setDrafting] = React.useState(false)
  const [topic, setTopic] = React.useState("")
  const [aiDraft, setAiDraft] = React.useState<string | null>(null)

  const handleAIDraft = async () => {
    if (!topic) return
    setDrafting(true)
    try {
      const result = await draftContent({
        contentType: "article de blog",
        topic: topic,
        desiredTone: "inspirant et professionnel",
        keyPoints: "Impact positif, appel aux dons, collaboration locale"
      })
      setAiDraft(result.draftedContent)
    } catch (error) {
      console.error(error)
    } finally {
      setDrafting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20 space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-4 max-w-2xl text-center md:text-left">
          <h1 className="text-5xl font-headline font-bold text-primary">Actualités & Témoignages</h1>
          <p className="text-xl text-muted-foreground">Suivez notre action au quotidien et découvrez les visages de la solidarité.</p>
        </div>

        {/* AI Assistant Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-secondary text-white font-bold h-14 px-8 rounded-full shadow-lg group">
              <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Assistant de Rédaction IA
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline">Aide à la Rédaction</DialogTitle>
              <DialogDescription>Générez un brouillon d'article impactant en quelques secondes.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Sujet de l'article</Label>
                <Input 
                  placeholder="Ex: L'impact de l'eau potable dans le village de X" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <Button onClick={handleAIDraft} disabled={drafting} className="w-full">
                {drafting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Générer le brouillon
              </Button>
              {aiDraft && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <Label>Brouillon généré</Label>
                  <Textarea 
                    value={aiDraft} 
                    onChange={(e) => setAiDraft(e.target.value)} 
                    className="min-h-[300px] text-sm leading-relaxed font-body p-4 bg-zinc-50 dark:bg-zinc-900 border-none rounded-xl"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setAiDraft(null)}>Effacer</Button>
                    <Button onClick={() => {
                      navigator.clipboard.writeText(aiDraft)
                      alert("Copié dans le presse-papier !")
                    }}>Copier le texte</Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, idx) => (
          <Card key={idx} className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all group flex flex-col">
            <div className="relative h-56">
              <Image 
                src={post.image || ""} 
                alt={post.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                {post.category}
              </div>
            </div>
            <CardContent className="p-6 space-y-4 flex-grow">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {post.date}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {post.author}
                </div>
              </div>
              <h3 className="text-xl font-headline font-bold group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Link href="#" className="inline-flex items-center text-primary font-bold hover:underline group/link">
                Lire la suite <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] p-12 text-center space-y-8">
        <h2 className="text-3xl font-headline font-bold">Inscrivez-vous à notre Journal</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Recevez chaque mois les témoignages de ceux que nous aidons directement dans votre boîte mail.</p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <Input placeholder="Votre adresse email" className="h-14 rounded-full px-8" />
          <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-full h-14 px-8 font-bold shadow-lg">S'abonner</Button>
        </div>
      </div>
    </div>
  )
}
