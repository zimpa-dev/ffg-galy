'use client';

import * as React from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, query, orderBy, setDoc } from "firebase/firestore";
import { 
  Newspaper, 
  Plus, 
  Trash2, 
  Loader2, 
  Image as ImageIcon,
  Type,
  AlignLeft,
  Calendar,
  User,
  Tag,
  Sparkles,
  Pencil,
  Eye,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { draftContent } from "@/ai/flows/ai-content-drafting-assistant";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

export default function AdminNewsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDrafting, setIsDrafting] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const newsQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "news"), orderBy("date", "desc"));
  }, [db]);

  const { data: news, loading } = useCollection(newsQuery);

  const [formData, setFormData] = React.useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "Santé",
    image: "",
    date: ""
  });

  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      date: new Date().toISOString().split('T')[0]
    }));
  }, []);

  const handleAIDraft = async () => {
    if (!formData.title) {
      toast({
        variant: "destructive",
        title: "Titre requis",
        description: "Veuillez donner un titre pour aider l'IA à rédiger.",
      });
      return;
    }
    setIsDrafting(true);
    try {
      const result = await draftContent({
        contentType: "article de blog",
        topic: formData.title,
        desiredTone: "inspirational and professional",
        keyPoints: "Impact positif, solidarité internationale, témoignages locaux"
      });
      setFormData(prev => ({ ...prev, content: result.draftedContent }));
      toast({
        title: "Brouillon généré",
        description: "L'IA a terminé la rédaction du contenu.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur IA",
        description: "L'assistant n'a pas pu générer le texte.",
      });
    } finally {
      setIsDrafting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    
    setIsSubmitting(true);
    try {
      if (editingId) {
        await setDoc(doc(db, "news", editingId), {
          ...formData,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        toast({ title: "Article mis à jour" });
      } else {
        await addDoc(collection(db, "news"), {
          ...formData,
          status: "published",
          createdAt: new Date().toISOString()
        });
        toast({ title: "Article publié" });
      }
      
      resetForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Action impossible pour le moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      category: "Santé",
      image: "",
      date: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || "",
      excerpt: item.excerpt || "",
      content: item.content || "",
      author: item.author || "",
      category: item.category || "Santé",
      image: item.image || "",
      date: item.date || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "news", id));
      toast({ title: "Article supprimé" });
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur de suppression" });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold">Gestion des Actualités</h1>
          <p className="text-muted-foreground text-sm">Rédigez et publiez les récits qui font l'histoire de FFG-VE.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Form */}
        <Card className="lg:col-span-5 shadow-xl border-none h-fit rounded-2xl overflow-hidden">
          <CardHeader className="bg-muted/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {editingId ? "Modifier l'article" : "Nouvel Article"}
              </CardTitle>
              {editingId && (
                <Button variant="ghost" size="sm" onClick={resetForm} className="h-8 gap-1">
                  <X className="h-4 w-4" /> Annuler
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2"><Type className="h-4 w-4" /> Titre</Label>
                <Input 
                  id="title" 
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author" className="flex items-center gap-2"><User className="h-4 w-4" /> Auteur</Label>
                  <Input 
                    id="author" 
                    required 
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Date</Label>
                  <Input 
                    id="date" 
                    type="date"
                    required 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-2"><Tag className="h-4 w-4" /> Catégorie</Label>
                <Input 
                  id="category" 
                  required 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="rounded-xl"
                  placeholder="Ex: Santé, Éducation"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt" className="flex items-center gap-2"><AlignLeft className="h-4 w-4" /> Résumé court</Label>
                <Textarea 
                  id="excerpt" 
                  required 
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  className="rounded-xl min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="content" className="flex items-center gap-2"><AlignLeft className="h-4 w-4" /> Contenu de l'article</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAIDraft}
                    disabled={isDrafting}
                    className="h-8 rounded-full text-[10px] font-bold uppercase tracking-wider gap-2 border-primary/20 text-primary"
                  >
                    {isDrafting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                    Assistant IA
                  </Button>
                </div>
                <Textarea 
                  id="content" 
                  required 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="rounded-xl min-h-[300px] font-body leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> URL de l'image</Label>
                <Input 
                  id="image" 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="rounded-xl"
                  placeholder="https://..."
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl shadow-lg font-bold text-lg">
                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (editingId ? <Pencil className="mr-2 h-5 w-5" /> : <Plus className="mr-2 h-5 w-5" />)}
                {editingId ? "Enregistrer les modifications" : "Publier l'article"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* List Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-xl border-none rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-xl">Articles Récents</CardTitle>
              <CardDescription>Consultez et gérez vos publications en ligne.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-12 text-center"><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" /></div>
              ) : news && news.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Aperçu</TableHead>
                        <TableHead>Détails</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {news.map((item: any) => (
                        <TableRow key={item.id} className="group">
                          <TableCell className="w-24">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted">
                              {item.image ? (
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center"><Newspaper className="text-muted-foreground/30" /></div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-bold line-clamp-1">{item.title}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">{item.category}</Badge>
                                <span className="text-[10px] text-muted-foreground">{item.date}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => startEdit(item)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-20 text-center space-y-4">
                  <Newspaper className="h-12 w-12 text-muted-foreground/20 mx-auto" />
                  <p className="text-muted-foreground italic">Aucun article enregistré.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
