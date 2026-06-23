
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
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";

const galleryCategories = [
  { id: "all", label: "Toutes", icon: Filter },
  { id: "health", label: "Santé", icon: Heart },
  { id: "education", label: "Éducation", icon: BookOpen },
  { id: "water", label: "Eau & Hygiène", icon: Droplets },
  { id: "emergency", label: "Urgences", icon: Siren },
  { id: "events", label: "Événements", icon: Sparkles },
];

export default function GalleryPage() {
  const db = useFirestore();
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const galleryQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "gallery"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: dbItems, loading } = useCollection(galleryQuery);

  const filteredItems = React.useMemo(() => {
    if (!dbItems) return [];
    return dbItems.filter((item: any) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [dbItems, activeCategory, searchQuery]);

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
            placeholder="Rechercher une mission..."
            className="w-full bg-white dark:bg-zinc-800 rounded-full py-2.5 pl-12 pr-6 border-none focus:ring-2 focus:ring-primary/20 text-sm transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item: any) => (
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
                      {item.location && (
                        <div className="flex items-center gap-1.5 text-white/70 text-xs">
                          <MapPin className="h-3 w-3" /> {item.location}
                        </div>
                      )}
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
                        {item.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" /> {item.location}
                          </div>
                        )}
                        {item.date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" /> {item.date}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-lg leading-relaxed text-zinc-300 font-light">
                        {item.description || "Aucune description supplémentaire fournie pour ce moment."}
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
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Aucun moment trouvé</h3>
          <p className="text-muted-foreground">La galerie est en cours d'alimentation par nos équipes.</p>
        </div>
      )}

      {/* Call to Action */}
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
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 -mr-40 -mt-40 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 -ml-40 -mb-40 rounded-full blur-[80px]" />
      </section>
    </div>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
      <circle cx="9" cy="9" r="2"/>
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
  );
}
