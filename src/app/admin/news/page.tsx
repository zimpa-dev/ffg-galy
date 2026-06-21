
'use client';

import * as React from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
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
  Tag
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

export default function AdminNewsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    
    setIsSubmitting(true);
    try {
      addDoc(collection(db, "news"), {
        ...formData,
        status: "published",
        createdAt: new Date().toISOString()
      });
      
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        author: "",
        category: "Santé",
        image: "",
        date: new Date().toISOString().split('T')[0]
      });
      
      toast({
        title: "Article publié",
        description: "L'article a été ajouté aux actualités.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de publier l'article.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    try {
      deleteDoc(doc(db, "news", id));
      toast({
        title: "Supprimé",
        description: "L'article a été retiré.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'article.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-headline font-bold">Gestion des Actualités</h1>
          <p className="text-muted-foreground">Publiez les dernières nouvelles et témoignages de FFG-VE.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 shadow-xl border-none h-fit">
          <CardHeader>
            <CardTitle>Nouvel Article</CardTitle>
            <CardDescription>Utilisez l'assistant IA pour le contenu si besoin.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <Type className="h-4 w-4" /> Titre
                </Label>
                <Input 
                  id="title" 
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Titre de l'article" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author" className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Auteur
                  </Label>
                  <Input 
                    id="author" 
                    required 
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    placeholder="Nom" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Date
                  </Label>
                  <Input 
                    id="date" 
                    type="date"
                    required 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Catégorie
                </Label>
                <Input 
                  id="category" 
                  required 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="Ex: Santé, Éducation" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt" className="flex items-center gap-2">
                  <AlignLeft className="h-4 w-4" /> Extrait (Résumé)
                </Label>
                <Textarea 
                  id="excerpt" 
                  required 
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  placeholder="Bref résumé pour la liste..." 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="flex items-center gap-2">
                  <AlignLeft className="h-4 w-4" /> Contenu complet
                </Label>
                <Textarea 
                  id="content" 
                  required 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Texte intégral de l'article..." 
                  className="min-h-[150px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" /> Image URL
                </Label>
                <Input 
                  id="image" 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://images.unsplash.com/..." 
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Publier l'article
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-xl border-none">
          <CardHeader>
            <CardTitle>Articles récents</CardTitle>
            <CardDescription>Liste de tous les articles publiés sur le site.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : news && news.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {news.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-bold">{item.title}</TableCell>
                      <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center p-8 text-muted-foreground italic">Aucun article enregistré.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
