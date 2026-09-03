"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
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
import { useFirestore, useCollection } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"

export default function NewsPage() {
  const db = useFirestore()
  const { toast } = useToast()
  const [drafting, setDrafting] = React.useState(false)
  const [topic, setTopic] = React.useState("")
  const [aiDraft, setAiDraft] = React.useState<string | null>(null)

  const newsQuery = React.useMemo(() => {
    if (!db) return null
    return query(collection(db, "news"), orderBy("date", "desc"))
  }, [db])

  const { data: newsArticles, loading } = useCollection(newsQuery)

  const handleAIDraft = async () => {
    if (!topic) {
      toast({
        variant: "destructive",
        title: "Thema erforderlich",
        description: "Bitte geben Sie ein Thema an, um den Entwurf zu erstellen.",
      })
      return
    }
    setDrafting(true)
    try {
      const result = await draftContent({
        contentType: "article de blog",
        topic: topic,
        desiredTone: "inspirational and professional",
        keyPoints: "Positive Auswirkung, internationale Solidarität, lokale Zeugnisse"
      })
      setAiDraft(result.draftedContent)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Der KI-Assistent konnte den Entwurf nicht erstellen.",
      })
    } finally {
      setDrafting(false)
    }
  }

  const copyToClipboard = () => {
    if (aiDraft) {
      navigator.clipboard.writeText(aiDraft)
      toast({
        title: "Kopiert!",
        description: "Der Entwurf wurde in die Zwischenablage kopiert.",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-20 space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-4 max-w-2xl text-center md:text-left">
          <h1 className="text-5xl font-headline font-bold text-primary">Aktuelles & Berichte</h1>
          <p className="text-xl text-muted-foreground">Verfolgen Sie unsere tägliche Arbeit und entdecken Sie die Gesichter der Solidarität.</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-secondary text-white font-bold h-14 px-8 rounded-full shadow-lg group">
              <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              KI-Schreibassistent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline">Schreibhilfe</DialogTitle>
              <DialogDescription>Erstellen Sie in Sekundenschnelle einen eindrucksvollen Artikelentwurf.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Thema des Artikels</Label>
                <Input 
                  placeholder="Z.B.: Die Auswirkungen von sauberem Trinkwasser im Dorf X" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <Button onClick={handleAIDraft} disabled={drafting} className="w-full rounded-xl h-12">
                {drafting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Entwurf generieren
              </Button>
              {aiDraft && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <Label>Generierter Entwurf</Label>
                  <Textarea 
                    value={aiDraft} 
                    onChange={(e) => setAiDraft(e.target.value)} 
                    className="min-h-[300px] text-sm leading-relaxed font-body p-4 bg-zinc-50 dark:bg-zinc-900 border-none rounded-xl"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setAiDraft(null)} className="rounded-xl">Löschen</Button>
                    <Button onClick={copyToClipboard} className="rounded-xl">Text kopieren</Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles && newsArticles.map((post) => (
            <Card key={post.id} className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all group flex flex-col rounded-[2rem]">
              <div className="relative h-56">
                <Image 
                  src={post.image || "https://picsum.photos/seed/news/600/400"} 
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
                <Link href={`/news/${post.id}`} className="inline-flex items-center text-primary font-bold hover:underline group/link">
                  Mehr lesen <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </CardFooter>
            </Card>
          ))}
          {(!newsArticles || newsArticles.length === 0) && (
            <div className="col-span-full text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem]">
              <p className="text-muted-foreground italic">Noch keine Nachrichten veröffentlicht.</p>
            </div>
          )}
        </div>
      )}

      <div className="bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] p-12 text-center space-y-8">
        <h2 className="text-3xl font-headline font-bold">Abonnieren Sie unser Journal</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Erhalten Sie jeden Monat Berichte von den Menschen, denen wir direkt in Ihr Postfach helfen.</p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <Input placeholder="Ihre E-Mail-Adresse" className="h-14 rounded-full px-8" />
          <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-full h-14 px-8 font-bold shadow-lg">Abonnieren</Button>
        </div>
      </div>
    </div>
  )
}
