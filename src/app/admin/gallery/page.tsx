'use client';

import * as React from "react";
import { useFirestore, useCollection, errorEmitter, FirestorePermissionError } from "@/firebase";
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
  X,
  Images as ImagesIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const emptyForm = {
  title: "",
  category: "health",
  images: [] as string[],
  location: "",
  date: "",
  description: ""
};

export default function AdminGalleryPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [urlInput, setUrlInput] = React.useState("");

  const galleryQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "gallery"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: galleryItems, loading } = useCollection(galleryQuery);

  const [formData, setFormData] = React.useState(emptyForm);

  const addImage = (src: string) => {
    const clean = src.trim();
    if (!clean) return;
    setFormData(prev => (prev.images.includes(clean) ? prev : { ...prev, images: [...prev.images, clean] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const moveImageToFront = (index: number) => {
    setFormData(prev => {
      const next = [...prev.images];
      const [picked] = next.splice(index, 1);
      next.unshift(picked);
      return { ...prev, images: next };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    files.forEach(file => {
      // Limit per image to 500KB so the base64 array stays under the Firestore 1MB doc limit.
      if (file.size > 0.5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Image trop lourde",
          description: `"${file.name}" dépasse 500 Ko. Utilisez plutôt une URL Cloudinary pour les grosses images.`,
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => addImage(reader.result as string);
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleAddUrl = () => {
    addImage(urlInput);
    setUrlInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || formData.images.length === 0) return;

    setIsSubmitting(true);
    const galleryRef = collection(db, "gallery");
    const newDocData = {
      ...formData,
      // Keep `image` as the cover for backward compatibility with existing views.
      image: formData.images[0],
      createdAt: new Date().toISOString()
    };

    addDoc(galleryRef, newDocData)
      .then(() => {
        setFormData(emptyForm);
        setUrlInput("");
        toast({
          title: formData.images.length > 1 ? "Groupe de photos ajouté" : "Photo ajoutée",
          description: `${formData.images.length} image(s) intégrée(s) à la galerie.`,
        });
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: 'gallery',
          operation: 'create',
          requestResourceData: newDocData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleDelete = (id: string) => {
    if (!db) return;
    const docRef = doc(db, "gallery", id);

    deleteDoc(docRef)
      .then(() => {
        toast({
          title: "Supprimé",
          description: "L'élément a été retiré.",
        });
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `gallery/${id}`,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const categories = [
    { id: "health", label: "Santé" },
    { id: "education", label: "Éducation" },
    { id: "water", label: "Eau & Hygiène" },
    { id: "emergency", label: "Urgences" },
    { id: "events", label: "Événements" },
  ];

  const itemImages = (item: any): string[] =>
    Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : item.image
        ? [item.image]
        : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold">Gestion de la Galerie</h1>
          <p className="text-muted-foreground text-sm">Ajoutez les moments forts de FFG-VE. Regroupez plusieurs photos d'un même événement.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 shadow-xl border-none h-fit rounded-2xl">
          <CardHeader>
            <CardTitle>Nouvel élément</CardTitle>
            <CardDescription>Une ou plusieurs photos pour un même moment.</CardDescription>
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-2"><Tag className="h-4 w-4" /> Catégorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({...formData, category: v})}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><ImagesIcon className="h-4 w-4" /> Photos ({formData.images.length})</Label>
                <div className="space-y-3">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="rounded-xl cursor-pointer file:bg-primary file:text-white file:border-none file:rounded-lg file:px-3 file:py-1 file:mr-3"
                  />
                  <div className="text-center text-[10px] text-muted-foreground font-bold">OU AJOUTER UNE URL</div>
                  <div className="flex gap-2">
                    <Input
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddUrl();
                        }
                      }}
                      className="rounded-xl"
                      placeholder="https://res.cloudinary.com/..."
                    />
                    <Button type="button" onClick={handleAddUrl} variant="outline" className="rounded-xl shrink-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {formData.images.map((src, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border bg-muted group">
                          <img src={src} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                          {idx === 0 ? (
                            <span className="absolute bottom-0 inset-x-0 bg-primary/90 text-white text-[9px] font-bold text-center py-0.5">
                              Couverture
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => moveImageToFront(idx)}
                              className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-bold text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Mettre en couverture
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Date</Label>
                  <Input
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="rounded-xl"
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
                />
              </div>

              <Button type="submit" disabled={isSubmitting || formData.images.length === 0} className="w-full rounded-xl h-12 shadow-lg">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Ajouter à la galerie
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-xl border-none rounded-2xl">
          <CardHeader>
            <CardTitle>Éléments de la Galerie</CardTitle>
            <CardDescription>Gérez les éléments publics.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : galleryItems && galleryItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {galleryItems.map((item: any) => {
                  const imgs = itemImages(item);
                  return (
                    <Card key={item.id} className="overflow-hidden group rounded-2xl border bg-muted/20">
                      <div className="relative aspect-video">
                        <img src={imgs[0]} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 flex gap-1">
                          <Badge className="bg-primary/90 text-white border-none text-[10px] uppercase font-bold">
                            {categories.find(c => c.id === item.category)?.label}
                          </Badge>
                          {imgs.length > 1 && (
                            <Badge className="bg-black/70 text-white border-none text-[10px] font-bold gap-1">
                              <ImagesIcon className="h-3 w-3" /> {imgs.length}
                            </Badge>
                          )}
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
                      <CardContent className="p-4 space-y-1">
                        <p className="font-bold truncate text-sm">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-2 w-2" /> {item.location || "-"}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 opacity-50 italic">
                <ImageIcon className="h-12 w-12 mx-auto mb-4" />
                <p>Aucun élément.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
