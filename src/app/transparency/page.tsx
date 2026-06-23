
'use client';

import * as React from "react";
import Image from "next/image";
import { 
  Loader2, 
  Search, 
  Filter, 
  Maximize2, 
  Calendar, 
  MapPin, 
  X,
  Heart,
  Droplets,
  BookOpen,
  Siren,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog";

const galleryCategories = [
  { id: "all", label: "Toutes", icon: Filter },
  { id: "health", label: "Santé", icon: Heart },
  { id: "education", label: "Éducation", icon: BookOpen },
  { id: "water", label: "Eau & Hygiène", icon: Droplets },
  { id: "emergency", label: "Urgences", icon: Siren },
  { id: "events", label: "Événements", icon: Sparkles },
];

const galleryItems = [
  {
    id: "1",
    title: "Mission Médicale Togo",
    category: "health",
    image: "https://picsum.photos/seed/med1/800/600",
    location: "Lomé, Togo",
    date: "Mars 2024",
    description: "Distribution de kits de premiers secours et consultations gratuites pour plus de 500 familles.",
  },
  {
    id: "2",
    title: "Gala de Charité Annuel",
    category: "events",
    image: "https://picsum.photos/seed/event1/800/600",
    location: "Paris, France",
    date: "Juin 2024",
    description: "Notre grand gala annuel pour lever des fonds destinés aux programmes d'éducation en Afrique de l'Ouest.",
  },
  {
    id: "3",
    title: "Construction École Primaire",
    category: "education",
    image: "https://picsum.photos/seed/edu1/800/600",
    location: "Bamako, Mali",
    date: "Janvier 2024",
    description: "Inauguration de 3 nouvelles classes équipées de panneaux solaires et de matériel pédagogique moderne.",
  },
  {
    id: "4",
    title: "Forum de la Solidarité",
    category: "events",
    image: "https://picsum.photos/seed/event2/800/600",
    location: "Genève, Suisse",
    date: "Mai 2024",
    description: "Échange avec nos partenaires internationaux sur les nouvelles stratégies de développement durable.",
  },
  {
    id: "5",
    title: "Nouveau Puits d'Eau Potable",
    category: "water",
    image: "https://picsum.photos/seed/wat1/800/600",
    location: "District de Turkana, Kenya",
    date: "Février 2024",
    description: "Forage d'un puits profond alimenté par énergie solaire, fournissant de l'eau propre à 2000 personnes.",
  },
  {
    id: "6",
    title: "Réponse Séisme",
    category: "emergency",
    image: "https://picsum.photos/seed/eme1/800/600",
    location: "Zone rurale, Maroc",
    date: "Novembre 2023",
    description: "Déploiement d'abris temporaires et de stocks de nourriture suite aux catastrophes naturelles.",
  },
  {
    id: "7",
    title: "Atelier de Vaccination",
    category: "health",
    image: "https://picsum.photos/seed/med2/800/600",
    location: "Cotonou, Bénin",
    date: "Décembre 2023",
    description: "Campagne de sensibilisation et vaccination infantile contre les maladies endémiques.",
  },
  {
    id: "8",
    title: "Marathon pour l'Eau",
    category: "events",
    image: "https://picsum.photos/seed/event3/800/600",
    location: "Berlin, Allemagne",
    date: "Avril 2024",
    description: "Course solidaire organisée par nos bénévoles locaux pour financer des projets d'assainissement.",
  },
  {
    id: "9",
    title: "Bibliothèque Mobile",
    category: "education",
    image: "https://picsum.photos/seed/edu2/800/600",
    location: "Région de Dakar, Sénégal",
    date: "Octobre 2023",
    description: "Mise en place d'un bus itinérant transportant plus de 2000 livres pour les zones isolées.",
  },
  {
    id: "10",
    title: "Conférence Presse Impact",
    category: "events",
    image: "https://picsum.photos/seed/event4/800/600",
    location: "Bruxelles, Belgique",
    date: "Janvier 2024",
    description: "Présentation de notre rapport d'impact annuel aux médias et aux donateurs institutionnels.",
  },
  {
    id: "11",
    title: "Fête des Bénévoles",
    category: "events",
    image: "https://picsum.photos/seed/event5/800/600",
    location: "Lyon, France",
    date: "Décembre 2023",
    description: "Moment de partage et de remerciement pour tous ceux qui donnent de leur temps pour FFG-VE.",
  },
  {
    id: "12",
    title: "Inauguration Centre Santé",
    category: "health",
    image: "https://picsum.photos/seed/med3/800/600",
    location: "Kigali, Rwanda",
    date: "Août 2023",
    description: "Ouverture d'un centre de santé maternelle et infantile de proximité.",
  },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Chargement de la galerie d'impact...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary">Galerie d'Impact</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Explorez en images nos missions terrain et nos événements. Chaque cliché est une fenêtre sur la solidarité que nous construisons ensemble.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-zinc-50 dark:bg-zinc-900 p-6 rounded-[2.5rem] border shadow-sm sticky top-24 z-30 backdrop-blur-md bg-opacity-80">
        <div className="flex flex-wrap justify-center gap-2">
          {galleryCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "ghost"}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-6 transition-all ${
                activeCategory === cat.id ? "shadow-lg scale-105 bg-primary text-white" : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <cat.icon className="mr-2 h-4 w-4" />
              {cat.label}
            </Button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une mission ou un événement..."
            className="w-full bg-white dark:bg-zinc-800 rounded-full py-2.5 pl-12 pr-6 border-none focus:ring-2 focus:ring-primary/20 text-sm transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <div className="group cursor-pointer relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="space-y-2">
                      <Badge className="bg-white/20 backdrop-blur-md border-none text-white font-bold uppercase tracking-wider text-[9px] px-2 py-0.5">
                        {galleryCategories.find(c => c.id === item.category)?.label}
                      </Badge>
                      <h3 className="text-xl font-headline font-bold leading-tight">{item.title}</h3>
                      <div className="flex items-center gap-1.5 text-white/70 text-xs">
                        <MapPin className="h-3 w-3" /> {item.location}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                      <span className="text-[10px] font-medium text-white/50">{item.date}</span>
                      <div className="bg-white/90 p-2 rounded-full text-primary">
                        <Maximize2 className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl rounded-[3rem] p-0 overflow-hidden border-none bg-zinc-950 text-white shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative aspect-square md:aspect-auto">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="p-8 md:p-12 space-y-8 flex flex-col justify-center">
                    <div className="space-y-4">
                      <Badge className="bg-primary/30 text-primary-foreground border-none text-xs font-bold uppercase px-3 py-1 rounded-full">
                        {galleryCategories.find(c => c.id === item.category)?.label}
                      </Badge>
                      <DialogTitle className="text-3xl md:text-4xl font-headline font-bold">{item.title}</DialogTitle>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-6 text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" /> {item.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" /> {item.date}
                        </div>
                      </div>
                      
                      <p className="text-lg leading-relaxed text-zinc-300 font-light">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-8 border-t border-white/10">
                      <Button className="w-full bg-white text-black hover:bg-zinc-200 rounded-full h-14 font-bold text-lg shadow-lg transition-transform hover:-translate-y-1" onClick={() => (window.location.href = '/donate')}>
                        Soutenir nos actions
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
          <div className="bg-white dark:bg-zinc-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Aucun moment trouvé</h3>
          <p className="text-muted-foreground">Ajustez vos filtres ou lancez une nouvelle recherche.</p>
          <Button variant="link" className="mt-4 text-primary font-bold" onClick={() => {setActiveCategory("all"); setSearchQuery("");}}>
            Réinitialiser la galerie
          </Button>
        </div>
      )}

      {/* Professional Call to Action */}
      <section className="bg-primary p-12 md:p-20 rounded-[4rem] text-white overflow-hidden relative group shadow-2xl">
        <div className="relative z-10 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-headline font-bold max-w-3xl mx-auto leading-tight">
            Chaque image est un espoir que vous avez aidé à semer.
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <Button size="lg" className="bg-white text-primary hover:bg-zinc-100 rounded-full px-12 h-16 font-bold text-xl shadow-xl transition-all hover:scale-105" onClick={() => (window.location.href = '/donate')}>
              Soutenir nos missions
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-12 h-16 font-bold text-xl backdrop-blur-sm" onClick={() => (window.location.href = '/volunteer')}>
              Devenir bénévole
            </Button>
          </div>
        </div>
        {/* Abstract design elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 -mr-40 -mt-40 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 -ml-40 -mb-40 rounded-full blur-[80px]" />
      </section>
    </div>
  );
}
