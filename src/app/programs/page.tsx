
'use client';

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { 
  BookOpen, 
  Stethoscope, 
  Droplets, 
  Leaf, 
  Siren, 
  Salad, 
  ArrowRight,
  Loader2,
  HeartHandshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";

// Map string icons to Lucide components
const iconMap: Record<string, any> = {
  BookOpen,
  Stethoscope,
  Droplets,
  Leaf,
  Siren,
  Salad,
  HeartHandshake
};

export default function ProgramsPage() {
  const db = useFirestore();
  
  const programsQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "programs"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: dbPrograms, loading } = useCollection(programsQuery);

  return (
    <div className="py-20 space-y-24">
      <div className="container mx-auto px-4 text-center max-w-3xl space-y-6">
        <h1 className="text-5xl font-headline font-bold text-primary">Nos Programmes</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Nous intervenons à travers des programmes structurés pour répondre aux besoins fondamentaux tout en préparant un avenir autonome pour les populations.
        </p>
      </div>

      <div className="container mx-auto px-4">
        {loading ? (
          <div className="flex justify-center p-24">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {dbPrograms && dbPrograms.map((prog) => {
              const IconComponent = iconMap[prog.icon] || HeartHandshake;
              const colorClasses = prog.color || "bg-primary/10 text-primary";
              const bgColor = colorClasses.split(' ')[0];
              const textColor = colorClasses.split(' ')[1];

              return (
                <Card key={prog.id} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl flex flex-col group">
                  <div className="relative h-60">
                    <Image 
                      src={prog.imageUrl || "https://picsum.photos/seed/default/600/400"} 
                      alt={prog.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className={`absolute top-4 left-4 p-3 rounded-2xl ${bgColor} shadow-lg backdrop-blur-sm bg-opacity-90`}>
                      <IconComponent className={`h-6 w-6 ${textColor}`} />
                    </div>
                  </div>
                  <CardContent className="p-8 space-y-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-headline font-bold">{prog.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{prog.description}</p>
                    </div>
                    <div className="pt-4">
                      <Link href="/donate">
                        <Button variant="ghost" className="p-0 h-auto font-bold text-primary hover:bg-transparent hover:text-primary/80 group/btn">
                          Soutenir ce programme <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <section className="bg-primary text-white py-20 overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-xl">
            <h2 className="text-4xl font-headline font-bold">Vous souhaitez en faire plus ?</h2>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              Nous recherchons constamment des partenaires et des experts pour renforcer l'impact de nos programmes.
            </p>
            <div className="flex gap-4">
              <Link href="/volunteer">
                <Button className="bg-secondary text-white font-bold h-12 px-8">Devenir Partenaire</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-8 font-bold">Nous Contacter</Button>
              </Link>
            </div>
          </div>
          <div className="relative w-full max-w-md h-80 rounded-3xl overflow-hidden shadow-2xl rotate-2">
            <Image 
              src={PlaceHolderImages.find(i => i.id === "project-gallery-1")?.imageUrl || "https://picsum.photos/seed/ngo/600/400"} 
              alt="Community Work" 
              fill 
              className="object-cover" 
            />
          </div>
        </div>
      </section>
    </div>
  );
}
