'use client';

import * as React from "react";
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
  MapPin, 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin 
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
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulation d'une sauvegarde asynchrone
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Paramètres enregistrés",
        description: "Les modifications globales ont été appliquées avec succès.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Paramètres du Système</h1>
          <p className="text-muted-foreground text-sm">Configurez l'identité, l'apparence et les options globales de FFG-VE.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 rounded-xl px-8 h-12 font-bold shadow-lg gap-2 hidden md:flex"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Sauvegarder
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white dark:bg-zinc-900 border p-1 h-auto rounded-2xl flex flex-wrap justify-start gap-1">
          <TabsTrigger value="general" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2 text-xs md:text-sm">
            <Globe className="h-4 w-4" /> Organisation
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2 text-xs md:text-sm">
            <Palette className="h-4 w-4" /> Apparence
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2 text-xs md:text-sm">
            <Shield className="h-4 w-4" /> Sécurité
          </TabsTrigger>
          <TabsTrigger value="social" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2 text-xs md:text-sm">
            <Share2 className="h-4 w-4" /> Réseaux Sociaux
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2 text-xs md:text-sm">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-headline">Identité de l'Organisation</CardTitle>
              <CardDescription>Informations de base affichées sur le site et dans les communications.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="org-name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Nom de l'ONG</Label>
                  <Input id="org-name" defaultValue="FFG-VE Horizon" className="rounded-xl h-12 text-lg font-medium focus:ring-primary" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="org-slogan" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Slogan Officiel</Label>
                  <Input id="org-slogan" defaultValue="Ensemble pour un monde plus solidaire" className="rounded-xl h-12 text-lg font-medium focus:ring-primary" />
                </div>
              </div>
              <Separator />
              <div className="space-y-6">
                <h3 className="font-headline font-bold text-xl flex items-center gap-2">
                  <Mail className="h-6 w-6 text-primary" /> Coordonnées de contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email Public</Label>
                    <Input id="contact-email" defaultValue="contact@ffg-ve.org" className="rounded-xl h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Standard Téléphonique</Label>
                    <Input id="contact-phone" defaultValue="+33 1 23 45 67 89" className="rounded-xl h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-address">Siège Social</Label>
                    <Input id="contact-address" defaultValue="75001 Paris, France" className="rounded-xl h-11" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-headline">Charte Graphique & Branding</CardTitle>
              <CardDescription>Configurez les couleurs basées sur votre logo officiel.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4 p-6 bg-muted/20 rounded-2xl border">
                  <Label className="font-bold flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" /> Couleur Primaire
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary shadow-xl border-4 border-white" />
                    <Input defaultValue="#3b82f6" className="rounded-xl h-12 font-mono" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Inspirée du bleu du globe.</p>
                </div>
                <div className="space-y-4 p-6 bg-muted/20 rounded-2xl border">
                  <Label className="font-bold flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary" /> Couleur Secondaire
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-secondary shadow-xl border-4 border-white" />
                    <Input defaultValue="#22c55e" className="rounded-xl h-12 font-mono" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Inspirée du vert du "G".</p>
                </div>
                <div className="space-y-4 p-6 bg-muted/20 rounded-2xl border">
                  <Label className="font-bold flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent" /> Couleur d'Accent
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-accent shadow-xl border-4 border-white" />
                    <Input defaultValue="#eab308" className="rounded-xl h-12 font-mono" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Inspirée du jaune central.</p>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col sm:flex-row items-center justify-between p-8 bg-primary/5 rounded-[2rem] border-2 border-primary/10 gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <p className="text-xl font-headline font-bold">Thème de l'interface</p>
                  <p className="text-sm text-muted-foreground">L'interface bascule automatiquement entre les modes clair et sombre.</p>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 p-2 rounded-2xl shadow-inner">
                  <span className="text-xs font-bold uppercase px-3">Sync Système</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-headline">Sécurité & Accès</CardTitle>
              <CardDescription>Configurez la protection des données et les accès administrateurs.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border-2 border-transparent hover:border-primary/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-zinc-800 shadow-md rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold">Google SSO</p>
                      <p className="text-xs text-muted-foreground">Connexion via compte G-Suite.</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border-2 border-transparent hover:border-primary/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-zinc-800 shadow-md rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="h-6 w-6 text-zinc-600" />
                    </div>
                    <div>
                      <p className="font-bold">Email / Password</p>
                      <p className="text-xs text-muted-foreground">Authentification classique.</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <Separator />
              <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/20 space-y-4">
                <h4 className="font-bold text-red-600 flex items-center gap-2">
                  <Shield className="h-5 w-5" /> Sécurité renforcée
                </h4>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Forcer l'authentification à deux facteurs (2FA)</p>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-headline">Réseaux Sociaux</CardTitle>
              <CardDescription>Gérez la présence digitale de FFG-VE Horizon.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-blue-600 font-bold"><Facebook className="h-5 w-5" /> Facebook</Label>
                  <Input placeholder="Lien vers la page" defaultValue="https://facebook.com/ffgve" className="rounded-xl h-12" />
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sky-400 font-bold"><Twitter className="h-5 w-5" /> Twitter / X</Label>
                  <Input placeholder="Lien vers le profil" defaultValue="https://twitter.com/ffgve" className="rounded-xl h-12" />
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-pink-600 font-bold"><Instagram className="h-5 w-5" /> Instagram</Label>
                  <Input placeholder="Lien vers le compte" defaultValue="https://instagram.com/ffgve" className="rounded-xl h-12" />
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-blue-800 font-bold"><Linkedin className="h-5 w-5" /> LinkedIn</Label>
                  <Input placeholder="Lien vers la page entreprise" defaultValue="https://linkedin.com/company/ffgve" className="rounded-xl h-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button for Mobile */}
      <div className="flex justify-end pt-10 md:hidden pb-10">
        <Button 
          size="lg" 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full bg-primary hover:bg-primary/90 rounded-2xl h-16 font-bold shadow-2xl gap-3 text-lg"
        >
          {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
          Enregistrer tout
        </Button>
      </div>
    </div>
  );
}
