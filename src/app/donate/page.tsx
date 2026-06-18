
"use client"

import * as React from "react"
import { CreditCard, Wallet, Smartphone, ShieldCheck, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const donationAmounts = [
  { value: "30", label: "30 €", impact: "Fournit du matériel scolaire pour 2 enfants." },
  { value: "50", label: "50 €", impact: "Finance les soins médicaux d'une famille pendant un mois." },
  { value: "100", label: "100 €", impact: "Contribue à la construction d'un puit d'eau potable." },
  { value: "250", label: "250 €", impact: "Parraine la scolarité complète d'un enfant pour un an." },
]

export default function DonatePage() {
  const [amount, setAmount] = React.useState("50")
  const [customAmount, setCustomAmount] = React.useState("")
  const [frequency, setFrequency] = React.useState("once")

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 py-12 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Information Side */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-headline font-bold text-primary">Votre don sauve des vies.</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Ensemble, nous pouvons apporter une aide concrète là où elle est le plus nécessaire. Votre générosité est le moteur de nos actions.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-headline font-bold">Pourquoi donner à FFG-VE ?</h2>
            <div className="space-y-4">
              {[
                "82% des fonds sont reversés directement aux programmes.",
                "Déduction fiscale : 66% de votre don est déductible d'impôts.",
                "Transparence totale sur l'utilisation des fonds.",
                "Suivi régulier de l'impact de vos dons."
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-secondary flex-shrink-0" />
                  <p className="text-muted-foreground font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-primary text-white p-6 border-none rounded-2xl">
            <CardContent className="p-0 flex gap-4 items-start">
              <Info className="h-6 w-6 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="font-bold">Sécurité Garantie</h3>
                <p className="text-primary-foreground/80 text-sm">
                  Toutes vos informations de paiement sont cryptées et traitées de manière sécurisée par nos partenaires bancaires.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Side */}
        <Card className="shadow-2xl border-none rounded-3xl overflow-hidden">
          <Tabs defaultValue="once" onValueChange={setFrequency} className="w-full">
            <TabsList className="grid grid-cols-2 h-14 bg-zinc-100 dark:bg-zinc-800 p-1">
              <TabsTrigger value="once" className="text-lg font-bold data-[state=active]:bg-white data-[state=active]:text-primary rounded-2xl transition-all">
                Don unique
              </TabsTrigger>
              <TabsTrigger value="monthly" className="text-lg font-bold data-[state=active]:bg-white data-[state=active]:text-primary rounded-2xl transition-all">
                Don mensuel
              </TabsTrigger>
            </TabsList>

            <CardContent className="p-8 md:p-12 space-y-10">
              {/* Amount Selection */}
              <div className="space-y-6">
                <Label className="text-lg font-bold">Choisissez un montant</Label>
                <div className="grid grid-cols-2 gap-4">
                  {donationAmounts.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={amount === opt.value ? "default" : "outline"}
                      onClick={() => {
                        setAmount(opt.value)
                        setCustomAmount("")
                      }}
                      className={`h-16 text-xl font-bold rounded-2xl transition-all ${
                        amount === opt.value ? "bg-primary shadow-lg scale-105" : "hover:border-primary"
                      }`}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Montant libre"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setAmount("")
                    }}
                    className="h-14 pl-12 text-lg rounded-2xl"
                  />
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">€</span>
                </div>
                <p className="text-sm text-secondary font-medium italic">
                  {amount ? donationAmounts.find(a => a.value === amount)?.impact : "Votre don fera une grande différence."}
                </p>
              </div>

              {/* Payment Methods */}
              <div className="space-y-6">
                <Label className="text-lg font-bold">Mode de paiement</Label>
                <RadioGroup defaultValue="card" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Label className="flex flex-col items-center gap-3 p-4 border rounded-2xl cursor-pointer hover:border-primary transition-colors">
                    <RadioGroupItem value="card" className="sr-only" />
                    <CreditCard className="h-8 w-8 text-primary" />
                    <span className="font-bold text-sm">Carte</span>
                  </Label>
                  <Label className="flex flex-col items-center gap-3 p-4 border rounded-2xl cursor-pointer hover:border-primary transition-colors">
                    <RadioGroupItem value="paypal" className="sr-only" />
                    <Wallet className="h-8 w-8 text-[#003087]" />
                    <span className="font-bold text-sm">PayPal</span>
                  </Label>
                  <Label className="flex flex-col items-center gap-3 p-4 border rounded-2xl cursor-pointer hover:border-primary transition-colors">
                    <RadioGroupItem value="mobile" className="sr-only" />
                    <Smartphone className="h-8 w-8 text-secondary" />
                    <span className="font-bold text-sm">Mobile Money</span>
                  </Label>
                </RadioGroup>
              </div>

              <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-white text-xl font-bold h-16 rounded-2xl shadow-xl">
                Valider mon don de {amount || customAmount || "0"} €
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                En cliquant sur valider, vous acceptez nos CGU et notre politique de confidentialité.
              </p>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
