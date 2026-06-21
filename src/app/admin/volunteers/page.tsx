'use client';

import * as React from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { 
  Users, 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Trash2, 
  Mail, 
  Phone,
  Filter,
  Loader2,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function AdminVolunteersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedVolunteer, setSelectedVolunteer] = React.useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  const volunteersQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "volunteers"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: volunteers, loading } = useCollection(volunteersQuery);

  const filteredVolunteers = React.useMemo(() => {
    if (!volunteers) return [];
    return volunteers.filter((v: any) => 
      `${v.firstName} ${v.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [volunteers, searchTerm]);

  const updateStatus = async (id: string, newStatus: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "volunteers", id), { status: newStatus });
      toast({
        title: "Statut mis à jour",
        description: `Le candidat est maintenant : ${newStatus}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
      });
    }
  };

  const deleteApplication = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "volunteers", id));
      toast({
        title: "Candidature supprimée",
        description: "Le dossier a été définitivement retiré.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la candidature.",
      });
    }
  };

  const stats = {
    total: volunteers?.length || 0,
    pending: volunteers?.filter((v: any) => v.status === "pending").length || 0,
    accepted: volunteers?.filter((v: any) => v.status === "accepted").length || 0,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-500 hover:bg-green-600 gap-1"><CheckCircle2 className="h-3 w-3" /> Accepté</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Refusé</Badge>;
      case "reviewed":
        return <Badge className="bg-blue-500 hover:bg-blue-600 gap-1"><Clock className="h-3 w-3" /> Examiné</Badge>;
      default:
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> En attente</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Gestion des Bénévoles</h1>
          <p className="text-muted-foreground text-sm">Consultez et gérez les engagements citoyens pour FFG-VE.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl shadow-sm border flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Total</p>
              <p className="text-lg font-bold leading-none">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl shadow-sm border flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">À traiter</p>
              <p className="text-lg font-bold leading-none">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par nom ou email..." 
            className="pl-10 h-12 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 rounded-xl gap-2">
          <Filter className="h-4 w-4" /> Filtres
        </Button>
      </div>

      {/* Main List */}
      <Card className="border-none shadow-xl overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse">Chargement des candidatures...</p>
            </div>
          ) : filteredVolunteers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Candidat</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Compétences</TableHead>
                    <TableHead>Date d'envoi</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVolunteers.map((v: any) => (
                    <TableRow key={v.id} className="hover:bg-muted/30 transition-colors group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-sm">
                            {v.firstName[0]}{v.lastName[0]}
                          </div>
                          <div>
                            <p className="font-bold">{v.firstName} {v.lastName}</p>
                            <p className="text-xs text-muted-foreground">ID: {v.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <Mail className="h-3 w-3 text-muted-foreground" /> {v.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Phone className="h-3 w-3 text-muted-foreground" /> {v.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {v.skills?.slice(0, 2).map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="text-[10px] px-1.5 py-0">
                              {skill}
                            </Badge>
                          ))}
                          {v.skills?.length > 2 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              +{v.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {v.createdAt ? format(new Date(v.createdAt), "dd MMM yyyy", { locale: fr }) : "-"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(v.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <DropdownMenuLabel>Actions Rapides</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => {
                              setSelectedVolunteer(v);
                              setIsDetailsOpen(true);
                            }}>
                              <Eye className="mr-2 h-4 w-4" /> Voir le dossier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase">Changer le statut</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => updateStatus(v.id, "accepted")} className="text-green-600">
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Accepter
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(v.id, "reviewed")} className="text-blue-600">
                              <Clock className="mr-2 h-4 w-4" /> Marquer examiné
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(v.id, "rejected")} className="text-destructive">
                              <XCircle className="mr-2 h-4 w-4" /> Refuser
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => deleteApplication(v.id)} className="text-destructive font-bold">
                              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground italic">Aucune candidature trouvée.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl rounded-[2rem] overflow-hidden p-0">
          <div className="bg-primary p-8 text-white relative">
            <DialogHeader>
              <DialogTitle className="text-3xl font-headline font-bold">
                Détails du Candidat
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/80">
                Consultez le profil complet et les motivations du bénévole.
              </DialogDescription>
            </DialogHeader>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -mr-16 -mt-16 rounded-full blur-3xl" />
          </div>

          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
            {selectedVolunteer && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" /> Informations Personnelles
                    </h4>
                    <div className="space-y-2">
                      <p className="text-lg font-bold">{selectedVolunteer.firstName} {selectedVolunteer.lastName}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-primary" /> {selectedVolunteer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-primary" /> {selectedVolunteer.phone}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase text-muted-foreground flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> État du dossier
                    </h4>
                    <div>
                      {getStatusBadge(selectedVolunteer.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Candidature reçue le {selectedVolunteer.createdAt ? format(new Date(selectedVolunteer.createdAt), "PPPP", { locale: fr }) : "-"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase text-muted-foreground">Compétences déclarées</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVolunteer.skills?.map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase text-muted-foreground">Motivations</h4>
                  <div className="p-6 bg-muted/30 rounded-2xl text-sm leading-relaxed border italic">
                    "{selectedVolunteer.motivation || "Aucune motivation fournie."}"
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <Button 
                    className="flex-grow bg-green-600 hover:bg-green-700 h-12 rounded-xl"
                    onClick={() => {
                      updateStatus(selectedVolunteer.id, "accepted");
                      setIsDetailsOpen(false);
                    }}
                  >
                    Accepter la candidature
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-grow h-12 rounded-xl text-destructive border-destructive hover:bg-destructive/5"
                    onClick={() => {
                      updateStatus(selectedVolunteer.id, "rejected");
                      setIsDetailsOpen(false);
                    }}
                  >
                    Refuser
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
