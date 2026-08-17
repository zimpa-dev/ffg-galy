
'use client';

import * as React from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Loader2, 
  MapPin, 
  Calendar, 
  Tag, 
  Type, 
  AlignLeft,
  Upload
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function AdminGalleryPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const galleryQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "gallery"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: galleryItems, loading } = useCollection(galleryQuery);

  const [formData, setFormData] = React.useState({
    title: "",
    category: "health",
    image: "",
    location: "",
    date: "",
    description: ""
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Fichier trop volumineux",
          description: "Veuillez choisir une image de moins de 2 Mo.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "gallery"), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      
      setFormData({
        title: "",
        category: "health",
        image: "",
        location: "",
        date: "",
        description: ""
      });
      
      toast({
        title: "Photo ajoutée",
        description: "L'image a été intégrée à la galerie avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter l'image.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "gallery", id));
      toast({
        title: "Supprimé",
        description: "L'image a été retirée de la galerie.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'image.",
      });
    }
  };

  const categories = [
    { id: "health", label: "Santé" },
    { id: "education", label: "Éducation" },
    { id: "water", label: "Eau & Hygiène" },
    { id: "emergency", label: "Urgences" },
    { id: "events", label: "Événements" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold">Gestion de la Galerie</h1>
          <p className="text-muted-foreground text-sm">Ajoutez les moments forts de FFG-VE pour témoigner de votre impact.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <Card className="lg:col-span-1 shadow-xl border-none h-fit rounded-2xl">
          <CardHeader>
            <CardTitle>Nouvelle Image</CardTitle>
            <CardDescription>Remplissez les détails du projet ou de l'événement.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2"><Type className="h-4 w-4" /> Titre</Label>
                <Input 
                  id="title" 
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="rounded-xl"
                  placeholder="Ex: Mission Togo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-2"><Tag className="h-4 w-4" /> Catégorie</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(v) => setFormData({...formData, category: v})}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Image</Label>
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="rounded-xl cursor-pointer file:bg-primary file:text-white file:border-none file:rounded-lg file:px-3 file:py-1 file:mr-3 file:hover:bg-primary/90"
                    />
                    <div className="text-center text-[10px] text-muted-foreground uppercase font-bold">Ou utiliser une URL</div>
                    <Input 
                      required 
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="rounded-xl"
                      placeholder="https://..."
                    />
                  </div>
                  {formData.image && (
                    <div className="relative aspect-video rounded-xl overflow-hidden border bg-muted group">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Aperçu de l'image</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Lieu</Label>
                  <Input 
                    id="location" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="rounded-xl"
                    placeholder="Ville, Pays"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Date</Label>
                  <Input 
                    id="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="rounded-xl"
                    placeholder="Mois Année"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2"><AlignLeft className="h-4 w-4" /> Description</Label>
                <Textarea 
                  id="description" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="rounded-xl min-h-[100px]"
                  placeholder="Détails de l'action..."
                />
              </div>

              <Button type="submit" disabled={isSubmitting || !formData.image} className="w-full rounded-xl h-12 shadow-lg transition-all hover:scale-[1.02]">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Ajouter à la galerie
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* List Column */}
        <Card className="lg:col-span-2 shadow-xl border-none rounded-2xl">
          <CardHeader>
            <CardTitle>Images de la Galerie</CardTitle>
            <CardDescription>Visualisez et gérez les éléments affichés publiquement.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : galleryItems && galleryItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {galleryItems.map((item: any) => (
                  <Card key={item.id} className="overflow-hidden group rounded-2xl border bg-muted/20">
                    <div className="relative aspect-video">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary/90 text-white border-none text-[10px] uppercase font-bold">
                          {categories.find(c => c.id === item.category)?.label}
                        </Badge>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <p className="font-bold truncate">{item.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {item.location || "-"}
                        <span className="mx-1">•</span>
                        <Calendar className="h-3 w-3" /> {item.date || "-"}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground italic">Aucune image dans la galerie pour le moment.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
