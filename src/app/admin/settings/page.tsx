
'use client';

import * as React from "react";
import { useFirestore, useDoc } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { 
  Globe, 
  Palette, 
  Save, 
  Loader2, 
  Image as ImageIcon,
  CheckCircle2,
  Coins,
  Plus,
  Trash2,
  ListChecks,
  TrendingUp,
  Heart,
  Users
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
  const [newReason, setNewReason] = React.useState("");

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
    contactAddress: "75001 Paris, France",
    donationReasons: [] as string[],
    stats: {
      beneficiaries: "2.5M+",
      countries: "35",
      projects: "1,200+",
      volunteers: "15,000+"
    }
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
        contactAddress: settingsData.contactAddress || "75001 Paris, France",
        donationReasons: settingsData.donationReasons || [],
        stats: settingsData.stats || {
          beneficiaries: "2.5M+",
          countries: "35",
          projects: "1,200+",
          volunteers: "15,000+"
        }
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

  const addDonationReason = () => {
    if (!newReason.trim()) return;
    setFormData({
      ...formData,
      donationReasons: [...formData.donationReasons, newReason.trim()]
    });
    setNewReason("");
  };

  const removeDonationReason = (index: number) => {
    setFormData({
      ...formData,
      donationReasons: formData.donationReasons.filter((_, i) => i !== index)
    });
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
          <TabsTrigger value="impact" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
            <TrendingUp className="h-4 w-4" /> Impact & Chiffres
          </TabsTrigger>
          <TabsTrigger value="donations" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
            <Coins className="h-4 w-4" /> Dons
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
              <div className="space-y-4">
                <Label className="text-lg font-bold flex items-center gap-2">
                  Logo Officiel <CheckCircle2 className="h-4 w-4 text-secondary" />
                </Label>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-40 h-40 bg-muted rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden relative group">
                    {formData.logoUrl ? (
                      <>
                        <img src={formData.logoUrl} alt="Logo Preview" className="w-full h-full object-contain p-4" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Aperçu Actuel</span>
                        </div>
                      </>
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-grow space-y-4 w-full">
                    <div className="space-y-2">
                      <Label>Télécharger le nouveau logo</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'logoUrl')}
                          className="rounded-xl cursor-pointer file:bg-primary file:text-white file:border-none file:rounded-lg file:px-3 file:py-1 file:mr-3 file:hover:bg-primary/90"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Ou spécifier une URL directe</Label>
                      <Input 
                        placeholder="https://..." 
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                        className="rounded-xl h-11"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-lg font-bold">Image de Bienvenue (Hero)</Label>
                <div className="space-y-6">
                  <div className="aspect-[21/9] w-full bg-muted rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden relative shadow-inner">
                    {formData.heroImageUrl ? (
                      <img src={formData.heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Aucun visuel configuré</span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Mettre à jour l'image Hero</Label>
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'heroImageUrl')}
                        className="rounded-xl cursor-pointer file:bg-primary file:text-white file:border-none file:rounded-lg file:px-3 file:py-1 file:mr-3 file:hover:bg-primary/90"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Lien de l'image</Label>
                      <Input 
                        placeholder="https://..." 
                        value={formData.heroImageUrl}
                        onChange={(e) => setFormData({...formData, heroImageUrl: e.target.value})}
                        className="rounded-xl h-11"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-6">
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle>Impact Global</CardTitle>
              <CardDescription>Mettez à jour les chiffres clés affichés sur la page d'accueil.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Heart className="h-4 w-4 text-primary" /> Bénéficiaires</Label>
                  <Input 
                    value={formData.stats.beneficiaries} 
                    onChange={(e) => setFormData({
                      ...formData, 
                      stats: { ...formData.stats, beneficiaries: e.target.value }
                    })}
                    className="rounded-xl h-11"
                    placeholder="Ex: 2.5M+"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Pays d'intervention</Label>
                  <Input 
                    value={formData.stats.countries} 
                    onChange={(e) => setFormData({
                      ...formData, 
                      stats: { ...formData.stats, countries: e.target.value }
                    })}
                    className="rounded-xl h-11"
                    placeholder="Ex: 35"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Projets réalisés</Label>
                  <Input 
                    value={formData.stats.projects} 
                    onChange={(e) => setFormData({
                      ...formData, 
                      stats: { ...formData.stats, projects: e.target.value }
                    })}
                    className="rounded-xl h-11"
                    placeholder="Ex: 1,200+"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Bénévoles actifs</Label>
                  <Input 
                    value={formData.stats.volunteers} 
                    onChange={(e) => setFormData({
                      ...formData, 
                      stats: { ...formData.stats, volunteers: e.target.value }
                    })}
                    className="rounded-xl h-11"
                    placeholder="Ex: 15,000+"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donations" className="space-y-6">
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <ListChecks className="h-5 w-5" />
                <CardTitle>Arguments de Don</CardTitle>
              </div>
              <CardDescription>Gérez les raisons pour lesquelles vos donateurs devraient vous soutenir.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input 
                  placeholder="Nouvel argument (ex: 82% des fonds sont reversés...)" 
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="rounded-xl"
                  onKeyPress={(e) => e.key === 'Enter' && addDonationReason()}
                />
                <Button onClick={addDonationReason} className="rounded-xl gap-2">
                  <Plus className="h-4 w-4" /> Ajouter
                </Button>
              </div>

              <div className="space-y-3">
                {formData.donationReasons.length > 0 ? (
                  formData.donationReasons.map((reason, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border group">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-secondary" />
                        <span className="text-sm font-medium">{reason}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeDonationReason(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground italic border-2 border-dashed rounded-xl">
                    Aucun argument configuré. Les valeurs par défaut seront affichées sur le site.
                  </div>
                )}
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
