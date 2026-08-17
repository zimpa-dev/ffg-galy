
'use client';

import * as React from "react";
import { useFirestore, useDoc } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { 
  Settings, 
  Globe, 
  Shield, 
  Bell, 
  Palette, 
  Share2, 
  Save, 
  Loader2, 
  Mail, 
  Phone, 
  Image as ImageIcon,
  Layout,
  Upload
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettingsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);

  const settingsRef = React.useMemo(() => {
    if (!db) return null;
    return doc(db, "site_settings", "general");
  }, [db]);

  const { data: settingsData, loading } = useDoc(settingsRef);

  const [formData, setFormData] = React.useState({
    orgName: "FFG-VE Horizon",
    slogan: "Ensemble pour un monde plus solidaire",
    logoUrl: "",
    heroImageUrl: "",
    contactEmail: "contact@ffg-ve.org",
    contactPhone: "+33 1 23 45 67 89",
    contactAddress: "75001 Paris, France"
  });

  React.useEffect(() => {
    if (settingsData) {
      setFormData({
        orgName: settingsData.orgName || "FFG-VE Horizon",
        slogan: settingsData.slogan || "Ensemble pour un monde plus solidaire",
        logoUrl: settingsData.logoUrl || "",
        heroImageUrl: settingsData.heroImageUrl || "",
        contactEmail: settingsData.contactEmail || "contact@ffg-ve.org",
        contactPhone: settingsData.contactPhone || "+33 1 23 45 67 89",
        contactAddress: settingsData.contactAddress || "75001 Paris, France"
      });
    }
  }, [settingsData]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'heroImageUrl') => {
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
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
        toast({
          title: "Image chargée",
          description: "L'aperçu a été mis à jour. N'oubliez pas d'enregistrer.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!db) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, "site_settings", "general"), {
        ...formData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      toast({
        title: "Paramètres enregistrés",
        description: "Les modifications globales ont été appliquées avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Paramètres du Système</h1>
          <p className="text-muted-foreground text-sm">Configurez l'identité, les images et les options globales.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 rounded-xl px-8 h-12 font-bold shadow-lg gap-2"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Sauvegarder tout
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white dark:bg-zinc-900 border p-1 h-auto rounded-2xl flex flex-wrap justify-start gap-1">
          <TabsTrigger value="general" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
            <Globe className="h-4 w-4" /> Organisation
          </TabsTrigger>
          <TabsTrigger value="media" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
            <ImageIcon className="h-4 w-4" /> Logo & Images
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
            <Palette className="h-4 w-4" /> Apparence
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle>Identité de l'Organisation</CardTitle>
              <CardDescription>Informations de base affichées sur tout le site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nom de l'ONG</Label>
                  <Input 
                    value={formData.orgName} 
                    onChange={(e) => setFormData({...formData, orgName: e.target.value})}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slogan Officiel</Label>
                  <Input 
                    value={formData.slogan} 
                    onChange={(e) => setFormData({...formData, slogan: e.target.value})}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Email Public</Label>
                  <Input 
                    value={formData.contactEmail} 
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input 
                    value={formData.contactPhone} 
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Siège Social</Label>
                  <Input 
                    value={formData.contactAddress} 
                    onChange={(e) => setFormData({...formData, contactAddress: e.target.value})}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle>Logo & Médias</CardTitle>
              <CardDescription>Gérez l'image de marque et les visuels principaux.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Logo Upload Section */}
              <div className="space-y-4">
                <Label className="text-lg font-bold">Logo de l'ONG</Label>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 bg-muted rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-grow space-y-4 w-full">
                    <div className="space-y-2">
                      <Label>Télécharger le logo (PNG ou SVG)</Label>
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'logoUrl')}
                        className="rounded-xl cursor-pointer file:bg-primary file:text-white file:border-none file:rounded-lg file:px-3 file:py-1 file:mr-3 file:hover:bg-primary/90"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ou URL du Logo</Label>
                      <Input 
                        placeholder="https://..." 
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                        className="rounded-xl h-11"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground italic">S'affichera dans la barre de navigation et le pied de page.</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Hero Image Upload Section */}
              <div className="space-y-4">
                <Label className="text-lg font-bold">Image de la Page d'Accueil (Hero)</Label>
                <div className="space-y-6">
                  <div className="aspect-[21/9] w-full bg-muted rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden relative">
                    {formData.heroImageUrl ? (
                      <img src={formData.heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Layout className="h-12 w-12 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Aucune image configurée</span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Télécharger une nouvelle image Hero</Label>
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'heroImageUrl')}
                        className="rounded-xl cursor-pointer file:bg-primary file:text-white file:border-none file:rounded-lg file:px-3 file:py-1 file:mr-3 file:hover:bg-primary/90"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL de l'image Hero</Label>
                      <Input 
                        placeholder="https://..." 
                        value={formData.heroImageUrl}
                        onChange={(e) => setFormData({...formData, heroImageUrl: e.target.value})}
                        className="rounded-xl h-11"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic text-center">Image grand format affichée à l'ouverture du site.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle>Interface & Thème</CardTitle>
              <CardDescription>Gérez l'apparence de l'interface utilisateur.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-primary/5 rounded-2xl border-2 border-primary/10">
                <div>
                  <p className="font-bold">Mode Sombre Automatique</p>
                  <p className="text-sm text-muted-foreground">Synchroniser avec les paramètres du système de l'utilisateur.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
