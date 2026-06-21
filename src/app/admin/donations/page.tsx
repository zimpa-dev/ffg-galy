'use client';

import * as React from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { 
  Coins, 
  Search, 
  TrendingUp, 
  Users, 
  Calendar,
  CreditCard,
  Filter,
  Download,
  Loader2,
  ArrowUpRight,
  History
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
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function AdminDonationsPage() {
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = React.useState("");

  const donationsQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "donations"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: donations, loading } = useCollection(donationsQuery);

  const filteredDonations = React.useMemo(() => {
    if (!donations) return [];
    return donations.filter((d: any) => 
      d.donorEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [donations, searchTerm]);

  // Statistics calculation
  const stats = React.useMemo(() => {
    if (!donations) return { total: 0, count: 0, average: 0, monthly: 0 };
    const total = donations.reduce((acc: number, d: any) => acc + (Number(d.amount) || 0), 0);
    const monthlyCount = donations.filter((d: any) => d.frequency === 'monthly').length;
    return {
      total,
      count: donations.length,
      average: donations.length > 0 ? total / donations.length : 0,
      monthly: monthlyCount
    };
  }, [donations]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Gestion des Dons</h1>
          <p className="text-muted-foreground text-sm">Suivez l'impact financier et la générosité de vos donateurs.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button className="bg-primary rounded-xl gap-2">
            <Calendar className="h-4 w-4" /> Rapport Mensuel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <DonationStatCard 
          title="Total Collecté" 
          value={`${stats.total.toLocaleString()} €`} 
          icon={Coins} 
          trend="+14% vs mois dernier" 
          color="text-primary"
        />
        <DonationStatCard 
          title="Nombre de Dons" 
          value={stats.count.toString()} 
          icon={Users} 
          trend="Donateurs uniques" 
          color="text-secondary"
        />
        <DonationStatCard 
          title="Don Moyen" 
          value={`${Math.round(stats.average)} €`} 
          icon={TrendingUp} 
          trend="Panier moyen stable" 
          color="text-orange-500"
        />
        <DonationStatCard 
          title="Soutiens Mensuels" 
          value={stats.monthly.toString()} 
          icon={History} 
          trend="Engagement récurrent" 
          color="text-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par email de donateur..." 
            className="pl-10 h-12 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 rounded-xl gap-2">
          <Filter className="h-4 w-4" /> Filtres Avancés
        </Button>
      </div>

      {/* List */}
      <Card className="border-none shadow-xl overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse">Chargement des transactions...</p>
            </div>
          ) : filteredDonations.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Donateur</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Fréquence</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDonations.map((d: any) => (
                    <TableRow key={d.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold">{d.donorEmail}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Ref: {d.id.slice(0, 8)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-headline font-bold text-lg text-primary">
                          {d.amount} €
                        </div>
                      </TableCell>
                      <TableCell>
                        {d.frequency === 'monthly' ? (
                          <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-none">Mensuel</Badge>
                        ) : (
                          <Badge variant="secondary">Ponctuel</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground text-xs">
                          <CreditCard className="h-3 w-3" />
                          {d.paymentMethod || "Carte Bancaire"}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {d.createdAt ? format(new Date(d.createdAt), "dd MMM yyyy, HH:mm", { locale: fr }) : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold tracking-widest hover:bg-primary/10 hover:text-primary">
                          Détails <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Coins className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground italic">Aucun don enregistré pour le moment.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DonationStatCard({ title, value, icon: Icon, trend, color }: { title: string, value: string, icon: any, trend: string, color: string }) {
  return (
    <Card className="border-none shadow-md overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-headline font-bold">{value}</h3>
            <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-secondary" /> {trend}
            </p>
          </div>
          <div className={`p-4 bg-muted/50 rounded-2xl group-hover:scale-110 transition-transform ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
