
"use client"

import * as React from "react"
import { Send, Upload, Heart, Award, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function VolunteerPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Candidature envoyée !",
        description: "Merci pour votre engagement. Nous vous recontacterons très bientôt.",
      })
    }, 1500)
  }

  const benefits = [
    { icon: Heart, title: "Impact Réel", desc: "Agissez directement sur le terrain pour aider ceux qui en ont besoin." },
    { icon: Award, title: "Expérience Unique", desc: "Développez de nouvelles compétences et enrichissez votre parcours." },
    { icon: Clock, title: "Flexibilité", desc: "Des missions adaptées à vos disponibilités et à vos envies." },
    { icon: MapPin, title: "Réseau Mondial", desc: "Rejoignez une communauté internationale de solidarité." },
  ]

  return (
    <div className="py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center space-y-6 mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-primary">Devenez Bénévole</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Votre temps est précieux. Mettez vos compétences au service d'une cause noble et rejoignez l'aventure FFG-VE.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Why Volunteer */}
          <div className="lg:col-span-1 space-y-8">
            <h2 className="text-2xl font-headline font-bold mb-6">Pourquoi nous rejoindre ?</h2>
            <div className="grid grid-cols-1 gap-6">
              {benefits.map((item, idx) => (
                <Card key={idx} className="border-none bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Form */}
          <Card className="lg:col-span-2 shadow-xl border-none rounded-2xl sm:rounded-3xl">
            <CardHeader className="p-6 sm:p-8 md:p-12 pb-0">
              <CardTitle className="text-2xl font-headline">Formulaire de Candidature</CardTitle>
              <CardDescription>Remplissez les informations ci-dessous pour postuler.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstname">Prénom</Label>
                    <Input id="firstname" required placeholder="Ex: Jean" className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname">Nom</Label>
                    <Input id="lastname" required placeholder="Ex: Dupont" className="rounded-xl h-12" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required placeholder="jean.dupont@mail.com" className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" required placeholder="+33 6 00 00 00 00" className="rounded-xl h-12" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-bold">Domaines de compétences</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {["Santé", "Éducation", "Logistique", "Communication", "Informatique", "Agriculture", "Langues", "Juridique", "Autre"].map((skill) => (
                      <div key={skill} className="flex items-center space-x-2 bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl border">
                        <Checkbox id={`skill-${skill}`} />
                        <label htmlFor={`skill-${skill}`} className="text-sm font-medium leading-none cursor-pointer">
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation">Motivations</Label>
                  <Textarea id="motivation" placeholder="Dites-nous pourquoi vous souhaitez nous rejoindre..." className="min-h-[150px] rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cv">Curriculum Vitae (PDF)</Label>
                  <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary transition-colors cursor-pointer bg-zinc-50 dark:bg-zinc-900">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Cliquez pour télécharger ou glissez-déposez</p>
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-xl text-lg shadow-lg">
                  {isSubmitting ? "Envoi en cours..." : "Soumettre ma candidature"}
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
