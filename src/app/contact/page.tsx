
"use client"

import * as React from "react"
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Message envoyé !",
        description: "Nous reviendrons vers vous dans les plus brefs délais.",
      })
    }, 1500)
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl space-y-14 md:space-y-20">
        <div className="text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-primary">Contactez-nous</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Une question sur nos projets ? Envie de nous soutenir ou de collaborer ? Notre équipe est à votre écoute.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Contact Info */}
          <div className="space-y-8 md:space-y-10">
            <h2 className="text-2xl sm:text-3xl font-headline font-bold">Nos Coordonnées</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <MapPin className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-bold">Adresse</h3>
                <p className="text-sm text-muted-foreground">123 Avenue de la Solidarité, 75001 Paris, France</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
                  <Phone className="text-secondary h-6 w-6" />
                </div>
                <h3 className="font-bold">Téléphone</h3>
                <p className="text-sm text-muted-foreground">+33 1 23 45 67 89</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Mail className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-bold">Email</h3>
                <p className="text-sm text-muted-foreground">contact@ffg-ve.org</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="text-secondary h-6 w-6" />
                </div>
                <h3 className="font-bold">Réseaux Sociaux</h3>
                <p className="text-sm text-muted-foreground">Retrouvez-nous sur @ffgve_ong</p>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden h-72 relative shadow-lg">
              <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                <MapPin className="h-10 w-10 text-muted-foreground animate-bounce" />
                <span className="text-sm font-bold text-muted-foreground ml-2">Carte Google Maps</span>
              </div>
              {/* Note: This is a placeholder for the actual map integration */}
            </div>
          </div>

          {/* Form */}
          <Card className="shadow-2xl border-none rounded-[1.5rem] sm:rounded-[2.5rem]">
            <CardContent className="p-6 sm:p-8 md:p-12 space-y-8">
              <h2 className="text-2xl font-headline font-bold">Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" required placeholder="Votre nom" className="rounded-2xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required placeholder="votre@email.com" className="rounded-2xl h-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input id="subject" required placeholder="De quoi souhaitez-vous parler ?" className="rounded-2xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" required placeholder="Votre message..." className="min-h-[180px] rounded-2xl" />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-2xl text-lg shadow-xl">
                  {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
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
