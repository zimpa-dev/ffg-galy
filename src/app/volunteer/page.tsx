
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
import { useLanguage } from "@/components/language-provider"

export default function VolunteerPage() {
  const { toast } = useToast()
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: t.volunteerPage.toastSentTitle,
        description: t.volunteerPage.toastSentDesc,
      })
    }, 1500)
  }

  const benefits = [
    { icon: Heart, title: t.volunteerPage.benefits.impactTitle, desc: t.volunteerPage.benefits.impactDesc },
    { icon: Award, title: t.volunteerPage.benefits.experienceTitle, desc: t.volunteerPage.benefits.experienceDesc },
    { icon: Clock, title: t.volunteerPage.benefits.flexibilityTitle, desc: t.volunteerPage.benefits.flexibilityDesc },
    { icon: MapPin, title: t.volunteerPage.benefits.networkTitle, desc: t.volunteerPage.benefits.networkDesc },
  ]

  const skills = [
    t.volunteerPage.skills.health,
    t.volunteerPage.skills.education,
    t.volunteerPage.skills.logistics,
    t.volunteerPage.skills.communication,
    t.volunteerPage.skills.it,
    t.volunteerPage.skills.agriculture,
    t.volunteerPage.skills.languages,
    t.volunteerPage.skills.legal,
    t.volunteerPage.skills.other,
  ]

  return (
    <div className="py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center space-y-6 mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-primary">{t.volunteerPage.title}</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.volunteerPage.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Why Volunteer */}
          <div className="lg:col-span-1 space-y-8">
            <h2 className="text-2xl font-headline font-bold mb-6">{t.volunteerPage.whyJoin}</h2>
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
              <CardTitle className="text-2xl font-headline">{t.volunteerPage.formTitle}</CardTitle>
              <CardDescription>{t.volunteerPage.formDesc}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstname">{t.volunteerPage.firstnameLabel}</Label>
                    <Input id="firstname" required placeholder={t.volunteerPage.firstnamePlaceholder} className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname">{t.volunteerPage.lastnameLabel}</Label>
                    <Input id="lastname" required placeholder={t.volunteerPage.lastnamePlaceholder} className="rounded-xl h-12" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t.volunteerPage.emailLabel}</Label>
                    <Input id="email" type="email" required placeholder={t.volunteerPage.emailPlaceholder} className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t.volunteerPage.phoneLabel}</Label>
                    <Input id="phone" required placeholder={t.volunteerPage.phonePlaceholder} className="rounded-xl h-12" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-bold">{t.volunteerPage.skillsLabel}</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {skills.map((skill) => (
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
                  <Label htmlFor="motivation">{t.volunteerPage.motivationLabel}</Label>
                  <Textarea id="motivation" placeholder={t.volunteerPage.motivationPlaceholder} className="min-h-[150px] rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cv">{t.volunteerPage.cvLabel}</Label>
                  <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary transition-colors cursor-pointer bg-zinc-50 dark:bg-zinc-900">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{t.volunteerPage.cvHint}</p>
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-xl text-lg shadow-lg">
                  {isSubmitting ? t.volunteerPage.submitting : t.volunteerPage.submitBtn}
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
