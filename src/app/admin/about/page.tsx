
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
  Type,
  AlignLeft,
  Plus,
  Trash2,
  Pencil,
  Facebook,
  Twitter,
  Linkedin,
  User
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  img: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
}

export default function AdminAboutManagementPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState<TeamMember | null>(null);

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
    teamMembers: [] as TeamMember[]
  });

  const [memberForm, setMemberForm] = React.useState<Omit<TeamMember, 'id'>>({
    name: "",
    role: "",
    img: "",
    facebook: "",
    twitter: "",
    linkedin: ""
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
        teamMembers: aboutData.teamMembers || []
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

  const handleAddOrUpdateMember = () => {
    if (editingMember) {
      const updatedMembers = formData.teamMembers.map(m => 
        m.id === editingMember.id ? { ...memberForm, id: m.id } : m
      );
      setFormData({ ...formData, teamMembers: updatedMembers });
    } else {
      const newMember = { ...memberForm, id: Math.random().toString(36).substr(2, 9) };
      setFormData({ ...formData, teamMembers: [...formData.teamMembers, newMember] });
    }
    setIsMemberDialogOpen(false);
    setEditingMember(null);
    setMemberForm({ name: "", role: "", img: "", facebook: "", twitter: "", linkedin: "" });
  };

  const removeMember = (id: string) => {
    setFormData({ ...formData, teamMembers: formData.teamMembers.filter(m => m.id !== id) });
  };

  const startEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      role: member.role,
      img: member.img,
      facebook: member.facebook || "",
      twitter: member.twitter || "",
      linkedin: member.linkedin || ""
    });
    setIsMemberDialogOpen(true);
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>L'Équipe Dirigeante</CardTitle>
                <CardDescription>Gérez les membres qui seront affichés sur la page.</CardDescription>
              </div>
              <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl gap-2" onClick={() => {
                    setEditingMember(null);
                    setMemberForm({ name: "", role: "", img: "", facebook: "", twitter: "", linkedin: "" });
                  }}>
                    <Plus className="h-4 w-4" /> Ajouter un membre
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-3xl max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingMember ? "Modifier le membre" : "Nouveau membre"}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nom complet</Label>
                        <Input 
                          value={memberForm.name} 
                          onChange={(e) => setMemberForm({...memberForm, name: e.target.value})}
                          placeholder="Ex: Dr. Amadou Diallo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Rôle / Fonction</Label>
                        <Input 
                          value={memberForm.role} 
                          onChange={(e) => setMemberForm({...memberForm, role: e.target.value})}
                          placeholder="Ex: Président"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>URL de l'image</Label>
                        <Input 
                          value={memberForm.img} 
                          onChange={(e) => setMemberForm({...memberForm, img: e.target.value})}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Facebook className="h-4 w-4 text-blue-600" /> Facebook</Label>
                        <Input 
                          value={memberForm.facebook} 
                          onChange={(e) => setMemberForm({...memberForm, facebook: e.target.value})}
                          placeholder="Lien optionnel"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Twitter className="h-4 w-4 text-sky-400" /> Twitter</Label>
                        <Input 
                          value={memberForm.twitter} 
                          onChange={(e) => setMemberForm({...memberForm, twitter: e.target.value})}
                          placeholder="Lien optionnel"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Linkedin className="h-4 w-4 text-blue-800" /> LinkedIn</Label>
                        <Input 
                          value={memberForm.linkedin} 
                          onChange={(e) => setMemberForm({...memberForm, linkedin: e.target.value})}
                          placeholder="Lien optionnel"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddOrUpdateMember} className="w-full rounded-xl">
                      {editingMember ? "Mettre à jour" : "Ajouter à l'équipe"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Introduction de la section équipe</Label>
                <Input 
                  value={formData.teamIntro} 
                  onChange={(e) => setFormData({...formData, teamIntro: e.target.value})}
                  className="rounded-xl h-12"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {formData.teamMembers.map((member) => (
                  <Card key={member.id} className="relative group overflow-hidden rounded-2xl border bg-muted/30">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-200 flex-shrink-0">
                        {member.img ? (
                          <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><User className="text-zinc-400" /></div>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="font-bold truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => startEditMember(member)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeMember(member.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
