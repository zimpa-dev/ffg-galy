'use client';

import * as React from "react"
import { 
  Newspaper, 
  HeartHandshake, 
  Users, 
  Coins, 
  Plus, 
  Trash2, 
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { useFirestore, useCollection } from "@/firebase"
import { collection, query, limit, orderBy } from "firebase/firestore"

export default function AdminDashboard() {
  const db = useFirestore();

  const newsQuery = React.useMemo(() => db ? query(collection(db, "news"), orderBy("date", "desc"), limit(5)) : null, [db]);
  const volQuery = React.useMemo(() => db ? query(collection(db, "volunteers"), orderBy("createdAt", "desc"), limit(5)) : null, [db]);
  const donQuery = React.useMemo(() => db ? query(collection(db, "donations"), orderBy("createdAt", "desc"), limit(5)) : null, [db]);

  const { data: recentNews, loading: loadingNews } = useCollection(newsQuery);
  const { data: recentVolunteers, loading: loadingVols } = useCollection(volQuery);
  const { data: recentDonations, loading: loadingDons } = useCollection(donQuery);

  return (
    <div className="flex flex-col gap-6 md:gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-headline font-bold text-foreground">Administration FFG-VE</h1>
          <p className="text-muted-foreground text-sm md:text-base">Gérez le contenu et les opérations de votre ONG.</p>
        </div>
        <Link href="/admin/news" className="w-full sm:w-auto">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 h-12 font-bold shadow-lg gap-2 w-full">
            <Plus className="h-4 w-4" /> Nouvel Article
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard title="Actualités" value={recentNews?.length.toString() || "0"} icon={Newspaper} trend="Articles récents" />
        <StatsCard title="Candidatures" value={recentVolunteers?.length.toString() || "0"} icon={Users} trend="Bénévoles" />
        <StatsCard title="Dons Récents" value={recentDonations?.length.toString() || "0"} icon={Coins} trend="Dernières transactions" />
        <StatsCard title="Impact Global" value="2.5M" icon={TrendingUp} trend="Bénéficiaires" />
      </div>

      <Tabs defaultValue="news" className="space-y-6">
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <TabsList className="inline-flex w-full md:w-auto bg-white dark:bg-zinc-900 border p-1 h-14 rounded-2xl">
            <TabsTrigger value="news" className="gap-2 px-6 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <Newspaper className="h-4 w-4" /> Actualités
            </TabsTrigger>
            <TabsTrigger value="volunteers" className="gap-2 px-6 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <Users className="h-4 w-4" /> Candidatures
            </TabsTrigger>
            <TabsTrigger value="donations" className="gap-2 px-6 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <Coins className="h-4 w-4" /> Dons
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        <TabsContent value="news" className="space-y-4">
          <Card className="border-none shadow-xl overflow-hidden rounded-2xl">
            <CardHeader className="p-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Dernières Actualités</CardTitle>
                <CardDescription>Visualisez vos publications les plus récentes.</CardDescription>
              </div>
              <Link href="/admin/news">
                <Button variant="ghost" className="text-primary font-bold">Tout voir</Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {loadingNews ? (
                <div className="p-12 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
              ) : recentNews && recentNews.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Auteur</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentNews.map((item: any) => (
                        <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="font-bold">{item.title}</TableCell>
                          <TableCell>{item.author}</TableCell>
                          <TableCell className="text-xs font-medium">{item.date}</TableCell>
                          <TableCell className="text-right">
                            <Link href="/admin/news">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground italic">Aucun article trouvé.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volunteers" className="space-y-4">
          <Card className="border-none shadow-xl overflow-hidden rounded-2xl">
            <CardHeader className="p-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Candidatures Récentes</CardTitle>
                <CardDescription>Derniers dossiers de bénévolat reçus.</CardDescription>
              </div>
              <Link href="/admin/volunteers">
                <Button variant="ghost" className="text-primary font-bold">Gérer les dossiers</Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {loadingVols ? (
                <div className="p-12 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
              ) : recentVolunteers && recentVolunteers.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Candidat</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Détails</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentVolunteers.map((v: any) => (
                        <TableRow key={v.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="font-bold">{v.firstName} {v.lastName}</TableCell>
                          <TableCell className="text-xs">{v.email}</TableCell>
                          <TableCell>
                            <Badge variant={v.status === 'accepted' ? 'default' : 'secondary'} className="text-[10px] uppercase font-bold px-2 py-0.5">
                              {v.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href="/admin/volunteers">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground italic">Aucune candidature reçue.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donations" className="space-y-4">
          <Card className="border-none shadow-xl overflow-hidden rounded-2xl">
            <CardHeader className="p-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Dons Récents</CardTitle>
                <CardDescription>Aperçu de la générosité des donateurs.</CardDescription>
              </div>
              <Link href="/admin/donations">
                <Button variant="ghost" className="text-primary font-bold">Voir tout le flux</Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {loadingDons ? (
                <div className="p-12 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
              ) : recentDonations && recentDonations.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Donateur</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentDonations.map((d: any) => (
                        <TableRow key={d.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="font-medium text-xs">{d.donorEmail}</TableCell>
                          <TableCell className="font-bold text-primary">{d.amount} €</TableCell>
                          <TableCell className="text-right">
                            <Link href="/admin/donations">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground italic">Aucun don enregistré.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatsCard({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend: string }) {
  return (
    <Card className="border-none shadow-md overflow-hidden relative group rounded-2xl">
      <CardContent className="p-5 md:p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
            <h3 className="text-2xl md:text-3xl font-headline font-bold">{value}</h3>
            <p className="text-[10px] md:text-xs text-primary font-bold">{trend}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 h-1 bg-primary w-0 group-hover:w-full transition-all duration-500" />
    </Card>
  )
}