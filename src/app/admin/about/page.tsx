
'use client';

import * as React from "react";
import { useFirestore, useDoc } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { 
  Info, 
  Save, 
  Loader2, 
  Eye, 
  Target, 
  History, 
  Users2,
  ListOrdered,
  Type,
  AlignLeft,
  Image as ImageIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function AdminAboutManagementPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);

  const aboutDocRef = React.useMemo(() => {
    if (!db) return null;
    return doc(db, "site_content", "about");
  }, [db]);

  const { data: aboutData, loading } = useDoc(aboutDocRef);

  const [formData, setFormData] = React.useState({
    heroTitle: "Notre Engagement",
    heroSubtitle: "Depuis 2005, nous bâtissons un monde plus juste.",
    history: "",
    mission: "",
    vision: "",
    teamIntro: "Des professionnels passionnés engagés pour la cause humanitaire.",
  });

  React.useEffect(() => {
    if (aboutData) {
      setFormData({
        heroTitle: aboutData.heroTitle || "Notre Engagement",
        heroSubtitle: aboutData.heroSubtitle || "",
        history: aboutData.history || "",
        mission: aboutData.mission || "",
        vision: aboutData.vision || "",
        teamIntro: aboutData.teamIntro || "",
      });
    }
  }, [aboutData]);

  const handleSave = async () => {
    if (!db) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, "site_content", "about"), {
        ...formData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      toast({
        title: "Contenu mis à jour",
        description: "La page À Propos a été actualisée avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Chargement de l'éditeur...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Éditeur "À Propos"</h1>
          <p className="text-muted-foreground text-sm">Personnalisez l'histoire et les valeurs de votre organisation.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-primary rounded-xl px-8 h-12 font-bold shadow-lg gap-2"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer les modifications
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white dark:bg-zinc-900 border p-1 h-auto rounded-2xl flex flex-wrap justify-start gap-1">
          <TabsTrigger value="general" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
            <Type className="h-4 w-4" /> En-tête
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
            <History className="h-4 w-4" /> Notre Histoire
          </TabsTrigger>
          <TabsTrigger value="mission" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
            <Target className="h-4 w-4" /> Mission & Vision
          </TabsTrigger>
          <TabsTrigger value="team" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
            <Users2 className="h-4 w-4" /> Équipe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle>Introduction de la page</CardTitle>
              <CardDescription>Modifiez le titre principal et le sous-titre de la section hero.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="heroTitle">Titre de la page</Label>
                <Input 
                  id="heroTitle" 
                  value={formData.heroTitle} 
                  onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="heroSubtitle">Sous-titre d'accroche</Label>
                <Textarea 
                  id="heroSubtitle" 
                  value={formData.heroSubtitle} 
                  onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})}
                  className="rounded-xl min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle>Récit Historique</CardTitle>
              <CardDescription>Racontez la genèse de FFG-VE pour inspirer vos visiteurs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>Contenu textuel (Mise en forme libre)</Label>
              <Textarea 
                value={formData.history} 
                onChange={(e) => setFormData({...formData, history: e.target.value})}
                placeholder="Racontez comment tout a commencé..."
                className="min-h-[300px] rounded-xl font-body leading-relaxed"
              />
              <div className="p-4 bg-muted/30 rounded-xl border flex items-center gap-3">
                <Info className="h-5 w-5 text-primary" />
                <p className="text-xs text-muted-foreground italic">Conseil : Divisez votre texte en paragraphes pour une meilleure lisibilité sur mobile.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mission" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Target className="h-5 w-5" /> Notre Mission
                </div>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={formData.mission} 
                  onChange={(e) => setFormData({...formData, mission: e.target.value})}
                  placeholder="Expliquez vos actions concrètes..."
                  className="min-h-[200px] rounded-xl"
                />
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-2 text-secondary font-bold">
                  <Eye className="h-5 w-5" /> Notre Vision
                </div>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={formData.vision} 
                  onChange={(e) => setFormData({...formData, vision: e.target.value})}
                  placeholder="Décrivez le monde que vous voulez bâtir..."
                  className="min-h-[200px] rounded-xl"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle>Introduction de l'Équipe</CardTitle>
              <CardDescription>Texte de présentation des membres du bureau et du terrain.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input 
                value={formData.teamIntro} 
                onChange={(e) => setFormData({...formData, teamIntro: e.target.value})}
                className="rounded-xl h-12"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
