
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
  AlertCircle
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

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-headline font-bold">Administration FFG-VE</h1>
          <p className="text-muted-foreground text-sm md:text-base">Gérez le contenu et les opérations de votre ONG.</p>
        </div>
        <Button className="bg-primary gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" /> Nouvel Article
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard title="Total Dons" value="45,280 €" icon={Coins} trend="+12% ce mois" />
        <StatsCard title="Bénévoles" value="1,240" icon={Users} trend="+5 nouveaux" />
        <StatsCard title="Articles" value="84" icon={Newspaper} trend="3 en brouillon" />
        <StatsCard title="Impact" value="2.5M" icon={TrendingUp} trend="Bénéficiaires" />
      </div>

      <Tabs defaultValue="news" className="space-y-6">
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <TabsList className="inline-flex w-full md:w-auto bg-background border h-12 p-1">
            <TabsTrigger value="news" className="gap-2 px-4 md:px-6">
              <Newspaper className="h-4 w-4" /> Actualités
            </TabsTrigger>
            <TabsTrigger value="volunteers" className="gap-2 px-4 md:px-6">
              <Users className="h-4 w-4" /> Candidatures
            </TabsTrigger>
            <TabsTrigger value="donations" className="gap-2 px-4 md:px-6">
              <Coins className="h-4 w-4" /> Dons
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        <TabsContent value="news" className="space-y-4">
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="p-4 md:p-6">
              <CardTitle>Gestion des Articles</CardTitle>
              <CardDescription>Modifiez ou publiez vos derniers témoignages terrain.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Titre</TableHead>
                      <TableHead className="hidden md:table-cell">Catégorie</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Mission vaccination Togo</TableCell>
                      <TableCell className="hidden md:table-cell"><Badge variant="outline">Santé</Badge></TableCell>
                      <TableCell><Badge className="bg-green-500">Publié</Badge></TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><FileText className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">École Solidaire Bamako</TableCell>
                      <TableCell className="hidden md:table-cell"><Badge variant="outline">Éducation</Badge></TableCell>
                      <TableCell><Badge className="bg-green-500">Publié</Badge></TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><FileText className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volunteers" className="space-y-4">
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="p-4 md:p-6">
              <CardTitle>Candidatures Bénévoles</CardTitle>
              <CardDescription>Consultez et traitez les demandes d'engagement.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead className="hidden sm:table-cell">Compétences</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Jean Dupont</TableCell>
                      <TableCell className="hidden sm:table-cell">Logistique, Santé</TableCell>
                      <TableCell><Badge variant="secondary">À réviser</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="h-8 text-xs">Voir profil</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatsCard({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend: string }) {
  return (
    <Card className="border-none shadow-md overflow-hidden relative group">
      <CardContent className="p-5 md:p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs md:text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl md:text-3xl font-bold">{value}</h3>
            <p className="text-[10px] md:text-xs text-primary font-medium">{trend}</p>
          </div>
          <div className="p-2 md:p-3 bg-primary/5 rounded-xl md:rounded-2xl group-hover:bg-primary/10 transition-colors">
            <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 h-1 bg-primary w-0 group-hover:w-full transition-all duration-500" />
    </Card>
  )
}
