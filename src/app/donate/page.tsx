
"use client"

import * as React from "react"
import { 
  CreditCard, 
  Wallet, 
  Smartphone, 
  ShieldCheck, 
  Info, 
  Package, 
  Stethoscope, 
  BookOpen, 
  Apple, 
  Shirt, 
  PlusCircle,
  CheckCircle2,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useDoc } from "@/firebase"
import { doc } from "firebase/firestore"

const donationAmounts = [
  { value: "30", label: "30 €", impact: "Fournit du matériel scolaire pour 2 enfants." },
  { value: "50", label: "50 €", impact: "Finance les soins médicaux d'une famille pendant un mois." },
  { value: "100", label: "100 €", impact: "Contribue à la construction d'un puit d'eau potable." },
  { value: "250", label: "250 €", impact: "Parraine la scolarité complète d'un enfant pour un an." },
]

const defaultReasons = [
  "82% des fonds sont reversés directement aux programmes.",
  "Dons en nature : redistribution directe aux communautés locales.",
  "Déduction fiscale : 66% de votre don financier est déductible.",
  "Transparence certifiée par des audits indépendants."
];

export default function DonatePage() {
  const { toast } = useToast()
  const db = useFirestore()
  const [amount, setAmount] = React.useState("50")
  const [customAmount, setCustomAmount] = React.useState("")
  const [frequency, setFrequency] = React.useState("once")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const settingsRef = React.useMemo(() => {
    if (!db) return null;
    return doc(db, "site_settings", "general");
  }, [db]);

  const { data: settings } = useDoc(settingsRef);

  const donationReasons = settings?.donationReasons?.length > 0 
    ? settings.donationReasons 
    : defaultReasons;

  const handleMonetaryDonation = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Merci pour votre générosité !",
        description: `Votre don de ${amount || customAmount}€ a été enregistré avec succès.`,
      })
    }, 1500)
  }

  const handleInKindDonation = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Proposition de don reçue",
        description: "Un responsable logistique vous contactera pour organiser la réception.",
      })
    }, 1500)
  }

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 py-12 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Information Side */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-primary">Chaque geste compte.</h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Que ce soit un soutien financier ou un don matériel, votre contribution est le moteur de notre action sur le terrain.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-headline font-bold">Pourquoi nous soutenir ?</h2>
            <div className="space-y-4">
              {donationReasons.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-secondary flex-shrink-0" />
                  <p className="text-muted-foreground font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-primary text-white p-6 border-none rounded-3xl shadow-xl relative overflow-hidden">
            <CardContent className="p-0 flex gap-4 items-start relative z-10">
              <ShieldCheck className="h-8 w-8 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Engagement de Transparence</h3>
                <p className="text-primary-foreground/80 text-sm">
                  Nous vous informons de l'utilisation précise de vos dons, qu'ils soient monétaires ou matériels.
                </p>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -mr-16 -mt-16 rounded-full blur-2xl" />
          </Card>
        </div>

        {/* Form Side */}
        <Card className="shadow-2xl border-none rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden bg-white dark:bg-zinc-900">
          <Tabs defaultValue="once" onValueChange={setFrequency} className="w-full">
            <TabsList className="grid grid-cols-3 h-14 sm:h-16 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-none">
              <TabsTrigger value="once" className="text-xs sm:text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary rounded-2xl transition-all">
                Unique
              </TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs sm:text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary rounded-2xl transition-all">
                Mensuel
              </TabsTrigger>
              <TabsTrigger value="nature" className="text-xs sm:text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary rounded-2xl transition-all">
                En Nature
              </TabsTrigger>
            </TabsList>

            {(frequency === "once" || frequency === "monthly") && (
              <TabsContent value={frequency} className="p-6 sm:p-8 md:p-12 space-y-8 sm:space-y-10 mt-0">
                <form onSubmit={handleMonetaryDonation} className="space-y-8">
                  <div className="space-y-6">
                    <Label className="text-lg font-bold">Choisissez un montant</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {donationAmounts.map((opt) => (
                        <Button
                          key={opt.value}
                          type="button"
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
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-dashed border-primary/20">
                      <p className="text-sm text-primary font-medium italic flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        {amount ? donationAmounts.find(a => a.value === amount)?.impact : "Votre don fera une grande différence sur le terrain."}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Label className="text-lg font-bold">Mode de paiement</Label>
                    <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-3 sm:gap-4">
                      <Label className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 border rounded-2xl cursor-pointer hover:border-primary transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                        <RadioGroupItem value="card" className="sr-only" />
                        <CreditCard className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                        <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">Carte</span>
                      </Label>
                      <Label className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 border rounded-2xl cursor-pointer hover:border-primary transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                        <RadioGroupItem value="paypal" className="sr-only" />
                        <Wallet className="h-7 w-7 sm:h-8 sm:w-8 text-[#003087]" />
                        <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">PayPal</span>
                      </Label>
                      <Label className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 border rounded-2xl cursor-pointer hover:border-primary transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                        <RadioGroupItem value="mobile" className="sr-only" />
                        <Smartphone className="h-7 w-7 sm:h-8 sm:w-8 text-secondary" />
                        <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">Mobile</span>
                      </Label>
                    </RadioGroup>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-white text-base sm:text-xl font-bold h-16 rounded-2xl shadow-xl transition-all hover:-translate-y-1 whitespace-normal text-center leading-tight"
                  >
                    {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : `Valider mon don de ${amount || customAmount || "0"} €`}
                  </Button>
                </form>
              </TabsContent>
            )}

            <TabsContent value="nature" className="p-6 sm:p-8 md:p-12 space-y-8 sm:space-y-10 mt-0 animate-in fade-in slide-in-from-right-4">
              <form onSubmit={handleInKindDonation} className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-secondary">
                    <Package className="h-6 w-6" />
                    <h3 className="text-xl font-headline font-bold">Détails du don matériel</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Catégorie de matériel</Label>
                      <Select required>
                        <SelectTrigger className="h-14 rounded-2xl">
                          <SelectValue placeholder="Sélectionnez un type de don" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="medical"><div className="flex items-center gap-2"><Stethoscope className="h-4 w-4" /> Matériel Médical</div></SelectItem>
                          <SelectItem value="education"><div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> Fournitures Scolaires</div></SelectItem>
                          <SelectItem value="food"><div className="flex items-center gap-2"><Apple className="h-4 w-4" /> Denrées Alimentaires</div></SelectItem>
                          <SelectItem value="clothes"><div className="flex items-center gap-2"><Shirt className="h-4 w-4" /> Vêtements & Textile</div></SelectItem>
                          <SelectItem value="other"><div className="flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Autre matériel</div></SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="item-desc">Description & Quantité</Label>
                      <Textarea 
                        id="item-desc" 
                        required 
                        placeholder="Ex: 50 kits de premiers secours, 10 cartons de cahiers..." 
                        className="min-h-[120px] rounded-2xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="item-status">État du matériel</Label>
                      <Select required defaultValue="new">
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="État" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="new">Neuf / Sous emballage</SelectItem>
                          <SelectItem value="excellent">Excellent état</SelectItem>
                          <SelectItem value="good">Bon état (Fonctionnel)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="donor-email">Votre Email pour la logistique</Label>
                      <Input id="donor-email" type="email" required placeholder="contact@exemple.com" className="h-12 rounded-xl" />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-secondary hover:bg-secondary/90 text-white text-xl font-bold h-16 rounded-2xl shadow-xl transition-all hover:-translate-y-1"
                >
                  {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Proposer mon don matériel"}
                </Button>

                <p className="text-center text-xs text-muted-foreground leading-relaxed">
                  Après validation, un membre de notre équipe logistique vous contactera pour organiser l'enlèvement ou le dépôt de votre don.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
