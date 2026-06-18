
'use client';

import * as React from "react"
import { 
  LayoutDashboard, 
  Newspaper, 
  HeartHandshake, 
  Users, 
  Coins, 
  Plus, 
  Trash2, 
  ExternalLink,
  TrendingUp,
  FileText
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

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-headline font-bold">Administration FFG-VE</h1>
          <p className="text-muted-foreground">Gérez le contenu et les opérations de votre ONG.</p>
        </div>
        <Button className="bg-primary gap-2">
          <Plus className="h-4 w-4" /> Nouvel Article
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Dons" value="45,280 €" icon={Coins} trend="+12% ce mois" />
        <StatsCard title="Bénévoles" value="1,240" icon={Users} trend="+5 nouveaux" />
        <StatsCard title="Articles" value="84" icon={Newspaper} trend="3 en brouillon" />
        <StatsCard title="Impact" value="2.5M" icon={TrendingUp} trend="Bénéficiaires" />
      </div>

      <Tabs defaultValue="news" className="space-y-6">
        <TabsList className="bg-background border h-12 p-1">
          <TabsTrigger value="news" className="gap-2 px-6">
            <Newspaper className="h-4 w-4" /> Actualités
          </TabsTrigger>
          <TabsTrigger value="volunteers" className="gap-2 px-6">
            <Users className="h-4 w-4" /> Candidatures
          </TabsTrigger>
          <TabsTrigger value="donations" className="gap-2 px-6">
            <Coins className="h-4 w-4" /> Dons
          </TabsTrigger>
          <TabsTrigger value="programs" className="gap-2 px-6">
            <HeartHandshake className="h-4 w-4" /> Programmes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Gestion des Articles</CardTitle>
              <CardDescription>Modifiez ou publiez vos derniers témoignages terrain.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Mission vaccination Togo</TableCell>
                    <TableCell><Badge variant="outline">Santé</Badge></TableCell>
                    <TableCell>12 Mars 2024</TableCell>
                    <TableCell><Badge className="bg-green-500">Publié</Badge></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon"><FileText className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">École Solidaire Bamako</TableCell>
                    <TableCell><Badge variant="outline">Éducation</Badge></TableCell>
                    <TableCell>5 Mars 2024</TableCell>
                    <TableCell><Badge className="bg-green-500">Publié</Badge></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon"><FileText className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volunteers">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Candidatures Bénévoles</CardTitle>
              <CardDescription>Consultez et traitez les demandes d'engagement.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Compétences</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Jean Dupont</TableCell>
                    <TableCell>jean.d@example.com</TableCell>
                    <TableCell>Logistique, Santé</TableCell>
                    <TableCell><Badge variant="secondary">À réviser</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Voir profil</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold">{value}</h3>
            <p className="text-xs text-primary font-medium">{trend}</p>
          </div>
          <div className="p-3 bg-primary/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 h-1 bg-primary w-0 group-hover:w-full transition-all duration-500" />
    </Card>
  )
}
