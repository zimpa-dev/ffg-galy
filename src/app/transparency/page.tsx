
"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Download, ShieldCheck, FileText, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { summarizeImpactReport } from "@/ai/flows/ai-impact-report-summarizer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const expenseData = [
  { name: "Programmes Humanitaires", value: 82, color: "hsl(var(--primary))" },
  { name: "Frais de Gestion", value: 12, color: "hsl(var(--secondary))" },
  { name: "Collecte de Fonds", value: 6, color: "#94a3b8" },
]

const reports = [
  { title: "Rapport Annuel 2023", size: "4.2 MB", date: "Janvier 2024" },
  { title: "États Financiers 2023", size: "2.1 MB", date: "Janvier 2024" },
  { title: "Rapport d'Impact 2022", size: "3.8 MB", date: "Janvier 2023" },
]

export default function TransparencyPage() {
  const [summarizing, setSummarizing] = React.useState(false)
  const [summary, setSummary] = React.useState<string | null>(null)

  const handleSummarize = async () => {
    setSummarizing(true)
    try {
      const result = await summarizeImpactReport({
        reportContent: "FFG-VE a atteint 2.5 millions de personnes en 2023. 82% des fonds sont allés directement aux programmes. Nous avons construit 15 écoles et 4 cliniques. Notre gouvernance est certifiée par des auditeurs externes indépendants."
      })
      setSummary(result.summary)
    } catch (error) {
      console.error(error)
    } finally {
      setSummarizing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20 space-y-16">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-5xl font-headline font-bold text-primary">Transparence Financière</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Chez FFG-VE, nous croyons que la confiance est le fondement de la solidarité. Nous nous engageons à une transparence totale sur l'utilisation de chaque euro confié.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <Card className="shadow-xl border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Répartition des Dépenses 2023</CardTitle>
            <CardDescription>Où vont vos dons ?</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-headline font-bold">Un Engagement Certifié</h2>
            <p className="text-muted-foreground">
              Nos comptes sont audités annuellement par un cabinet indépendant de renommée internationale pour garantir une gestion exemplaire.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-primary/5 rounded-2xl flex flex-col gap-2">
              <ShieldCheck className="text-primary h-8 w-8" />
              <h3 className="font-bold">Audit Externe</h3>
              <p className="text-sm text-muted-foreground">Certification annuelle par un tiers indépendant.</p>
            </div>
            <div className="p-6 bg-secondary/5 rounded-2xl flex flex-col gap-2">
              <Sparkles className="text-secondary h-8 w-8" />
              <h3 className="font-bold">Efficacité</h3>
              <p className="text-sm text-muted-foreground">Maximisation de l'impact direct sur le terrain.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] p-8 md:p-12 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-bold">Analyse Intelligente des Rapports</h2>
            <p className="text-muted-foreground">Utilisez notre IA pour obtenir un résumé rapide de nos derniers impacts.</p>
          </div>
          <Button 
            onClick={handleSummarize} 
            disabled={summarizing}
            className="bg-primary text-white font-bold h-12 px-8"
          >
            {summarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {summary ? "Actualiser le résumé" : "Générer un résumé IA"}
          </Button>
        </div>

        {summary && (
          <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border shadow-inner animate-in fade-in slide-in-from-top-4">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
              <FileText className="h-5 w-5" /> Synthèse de l'Impact 2023
            </h3>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {summary}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-headline font-bold">Documents Téléchargeables</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reports.map((report, idx) => (
            <Card key={idx} className="hover:border-primary transition-colors cursor-pointer group">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold group-hover:text-primary transition-colors">{report.title}</h3>
                  <p className="text-sm text-muted-foreground">{report.date} • {report.size}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
