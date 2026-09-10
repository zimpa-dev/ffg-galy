
"use client"

import * as React from "react"
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"
import { useFirestore, useDoc } from "@/firebase"
import { doc } from "firebase/firestore"

export default function ContactPage() {
  const { toast } = useToast()
  const { t } = useLanguage()
  const db = useFirestore()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const settingsRef = React.useMemo(() => {
    if (!db) return null
    return doc(db, "site_settings", "general")
  }, [db])

  const { data: settings } = useDoc(settingsRef)

  const contactEmail = settings?.contactEmail || t.contactPage.emailValue
  const contactPhone = settings?.contactPhone || t.contactPage.phoneValue
  const contactAddress = settings?.contactAddress || t.contactPage.addressValue

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: t.contactPage.toastSentTitle,
        description: t.contactPage.toastSentDesc,
      })
    }, 1500)
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl space-y-14 md:space-y-20">
        <div className="text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-primary">{t.contactPage.title}</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.contactPage.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Contact Info */}
          <div className="space-y-8 md:space-y-10">
            <h2 className="text-2xl sm:text-3xl font-headline font-bold">{t.contactPage.coordsTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <MapPin className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-bold">{t.contactPage.addressLabel}</h3>
                <p className="text-sm text-muted-foreground">{contactAddress}</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
                  <Phone className="text-secondary h-6 w-6" />
                </div>
                <h3 className="font-bold">{t.contactPage.phoneLabel}</h3>
                <p className="text-sm text-muted-foreground">{contactPhone}</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Mail className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-bold">{t.contactPage.emailLabel}</h3>
                <p className="text-sm text-muted-foreground">{contactEmail}</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="text-secondary h-6 w-6" />
                </div>
                <h3 className="font-bold">{t.contactPage.socialLabel}</h3>
                <p className="text-sm text-muted-foreground">{t.contactPage.socialValue}</p>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden h-72 relative shadow-lg">
              <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                <MapPin className="h-10 w-10 text-muted-foreground animate-bounce" />
                <span className="text-sm font-bold text-muted-foreground ml-2">{t.contactPage.mapPlaceholder}</span>
              </div>
              {/* Note: This is a placeholder for the actual map integration */}
            </div>
          </div>

          {/* Form */}
          <Card className="shadow-2xl border-none rounded-[1.5rem] sm:rounded-[2.5rem]">
            <CardContent className="p-6 sm:p-8 md:p-12 space-y-8">
              <h2 className="text-2xl font-headline font-bold">{t.contactPage.formTitle}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t.contactPage.nameLabel}</Label>
                    <Input id="name" required placeholder={t.contactPage.namePlaceholder} className="rounded-2xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t.contactPage.emailFieldLabel}</Label>
                    <Input id="email" type="email" required placeholder={t.contactPage.emailPlaceholder} className="rounded-2xl h-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">{t.contactPage.subjectLabel}</Label>
                  <Input id="subject" required placeholder={t.contactPage.subjectPlaceholder} className="rounded-2xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t.contactPage.messageLabel}</Label>
                  <Textarea id="message" required placeholder={t.contactPage.messagePlaceholder} className="min-h-[180px] rounded-2xl" />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-2xl text-lg shadow-xl">
                  {isSubmitting ? t.contactPage.submitting : t.contactPage.submitBtn}
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
