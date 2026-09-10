
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
  Sparkles,
  Images as ImagesIcon
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi
} from "@/components/ui/carousel";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { useLanguage } from "@/components/language-provider";

function getImages(item: any): string[] {
  if (Array.isArray(item.images) && item.images.length > 0) return item.images;
  if (item.image) return [item.image];
  return [];
}

export default function GalleryPage() {
  const db = useFirestore();
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const galleryCategories = [
    { id: "all", label: t.gallery.filters.all, icon: Filter },
    { id: "health", label: t.gallery.filters.health, icon: Heart },
    { id: "education", label: t.gallery.filters.education, icon: BookOpen },
    { id: "water", label: t.gallery.filters.water, icon: Droplets },
    { id: "emergency", label: t.gallery.filters.emergency, icon: Siren },
    { id: "events", label: t.gallery.filters.events, icon: Sparkles },
  ];

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
        <p className="text-muted-foreground animate-pulse font-medium">{t.galleryPage.loading}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary">{t.gallery.title}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          {t.gallery.subtitle}
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
            placeholder={t.galleryPage.searchPlaceholder}
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
            <GalleryCard
              key={item.id}
              item={item}
              categoryLabel={galleryCategories.find(c => c.id === item.category)?.label}
              noDescription={t.galleryPage.noDescription}
              supportLabel={t.galleryPage.supportBtn}
            />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
          <div className="bg-white dark:bg-zinc-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold mb-2">{t.galleryPage.emptyTitle}</h3>
          <p className="text-muted-foreground">{t.galleryPage.emptyText}</p>
        </div>
      )}

      {/* Call to Action */}
      <section className="bg-primary p-8 sm:p-12 md:p-20 rounded-[2rem] sm:rounded-[4rem] text-white overflow-hidden relative group shadow-2xl">
        <div className="relative z-10 text-center space-y-8">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-headline font-bold max-w-3xl mx-auto leading-tight">
            {t.galleryPage.ctaTitle}
          </h2>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6">
            <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-zinc-100 rounded-full px-8 sm:px-12 h-14 sm:h-16 font-bold text-lg sm:text-xl shadow-xl transition-all hover:scale-105" onClick={() => (window.location.href = '/donate')}>
              {t.galleryPage.ctaSupportBtn}
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 rounded-full px-8 sm:px-12 h-14 sm:h-16 font-bold text-lg sm:text-xl backdrop-blur-sm" onClick={() => (window.location.href = '/volunteer')}>
              {t.galleryPage.ctaVolunteerBtn}
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 -mr-40 -mt-40 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 -ml-40 -mb-40 rounded-full blur-[80px]" />
      </section>
    </div>
  );
}

function GalleryCard({
  item,
  categoryLabel,
  noDescription,
  supportLabel,
}: {
  item: any;
  categoryLabel?: string;
  noDescription: string;
  supportLabel: string;
}) {
  const images = getImages(item);
  const multiple = images.length > 1;
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group cursor-pointer relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
          <Image
            src={images[0]}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />

          {multiple && (
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <ImagesIcon className="h-3.5 w-3.5" /> {images.length}
            </div>
          )}

          <div className="absolute inset-0 p-6 flex flex-col justify-end text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <div className="space-y-2">
              <Badge className="bg-white/20 backdrop-blur-md border-none text-white font-bold uppercase tracking-wider text-[9px] px-2 py-0.5">
                {categoryLabel}
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
      <DialogContent className="max-w-4xl rounded-[1.5rem] sm:rounded-[3rem] p-0 overflow-y-auto border-none bg-zinc-950 text-white shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative bg-black">
            {multiple ? (
              <Carousel setApi={setApi} opts={{ loop: true }} className="h-full">
                <CarouselContent className="ml-0 h-full">
                  {images.map((src, i) => (
                    <CarouselItem key={i} className="pl-0">
                      <div className="relative aspect-square md:aspect-auto md:h-full min-h-[240px]">
                        <Image src={src} alt={`${item.title} ${i + 1}`} fill className="object-cover" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-3 bg-white/85 text-black border-none hover:bg-white" />
                <CarouselNext className="right-3 bg-white/85 text-black border-none hover:bg-white" />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${i === current ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
                    />
                  ))}
                </div>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {current + 1} / {images.length}
                </div>
              </Carousel>
            ) : (
              <div className="relative aspect-square md:aspect-auto md:h-full min-h-[240px]">
                <Image src={images[0]} alt={item.title} fill className="object-cover" />
              </div>
            )}
          </div>
          <div className="p-6 sm:p-8 md:p-12 space-y-6 sm:space-y-8 flex flex-col justify-center">
            <div className="space-y-4">
              <Badge className="bg-primary/30 text-primary-foreground border-none text-xs font-bold uppercase px-3 py-1 rounded-full">
                {categoryLabel}
              </Badge>
              <DialogTitle className="text-3xl md:text-4xl font-headline font-bold">{item.title}</DialogTitle>
              <DialogDescription className="sr-only">{item.title}</DialogDescription>
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
                {item.description || noDescription}
              </p>
            </div>

            <div className="pt-8 border-t border-white/10">
              <Button className="w-full bg-white text-black hover:bg-zinc-200 rounded-full h-14 font-bold text-lg shadow-lg transition-transform hover:-translate-y-1" onClick={() => (window.location.href = '/donate')}>
                {supportLabel}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
