
'use client';

import * as React from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { 
  HeartHandshake, 
  Plus, 
  Trash2, 
  Loader2, 
  Image as ImageIcon,
  Type,
  AlignLeft,
  Palette
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

export default function AdminProgramsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const programsQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "programs"), orderBy("title", "asc"));
  }, [db]);

  const { data: programs, loading } = useCollection(programsQuery);

  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    imageUrl: "",
    icon: "HeartHandshake",
    color: "bg-primary/10 text-primary"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    
    setIsSubmitting(true);
    try {
      addDoc(collection(db, "programs"), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        icon: "HeartHandshake",
        color: "bg-primary/10 text-primary"
      });
      
      toast({
        title: "Succès",
        description: "Le programme a été ajouté avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le programme.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    try {
      deleteDoc(doc(db, "programs", id));
      toast({
        title: "Supprimé",
        description: "Le programme a été supprimé.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le programme.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold">Gestion des Programmes</h1>
          <p className="text-muted-foreground text-sm">Ajoutez ou modifiez les actions humanitaires de FFG-VE.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Form Column */}
        <Card className="lg:col-span-1 shadow-xl border-none h-fit">
          <CardHeader>
            <CardTitle>Nouveau Programme</CardTitle>
            <CardDescription>Remplissez les détails pour l'affichage public.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <Type className="h-4 w-4" /> Titre
                </Label>
                <Input 
                  id="title" 
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Aide Alimentaire" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <AlignLeft className="h-4 w-4" /> Description
                </Label>
                <Textarea 
                  id="description" 
                  required 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Décrivez l'impact du programme..." 
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" /> URL de l'image
                </Label>
                <Input 
                  id="imageUrl" 
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://images.unsplash.com/..." 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon" className="flex items-center gap-2">
                    <HeartHandshake className="h-4 w-4" /> Icône
                  </Label>
                  <Input 
                    id="icon" 
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    placeholder="Nom Lucide (ex: Heart)" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" /> Couleur (CSS)
                  </Label>
                  <Input 
                    id="color" 
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    placeholder="bg-blue-50 text-blue-600" 
                  />
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Créer le programme
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* List Column */}
        <Card className="lg:col-span-2 shadow-xl border-none">
          <CardHeader>
            <CardTitle>Programmes Existants</CardTitle>
            <CardDescription>Visualisez et gérez les programmes en ligne.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : programs && programs.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programs.map((prog) => (
                      <TableRow key={prog.id}>
                        <TableCell className="font-bold text-primary">{prog.title}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate">
                          {prog.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(prog.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center p-8 text-muted-foreground italic">Aucun programme enregistré pour le moment.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
