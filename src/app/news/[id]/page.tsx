'use client';

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  Tag, 
  Clock, 
  Loader2,
  ChevronRight,
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language-provider";

export default function NewsArticleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();
  const { t } = useLanguage();

  const articleRef = React.useMemo(() => {
    if (!db || !id) return null;
    return doc(db, "news", id as string);
  }, [db, id]);

  const { data: article, loading } = useDoc(articleRef);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: t.newsPage.detailLinkCopiedTitle, description: t.newsPage.detailLinkCopiedDesc });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">{t.newsPage.detailLoading}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-6">
        <h1 className="text-4xl font-headline font-bold">{t.newsPage.detailNotFoundTitle}</h1>
        <p className="text-muted-foreground">{t.newsPage.detailNotFoundText}</p>
        <Link href="/news">
          <Button variant="outline" className="rounded-full h-12 px-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.newsPage.detailBackToNews}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 animate-in fade-in duration-700">
      {/* Hero Header */}
      <div className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden">
        <Image 
          src={article.image || "https://picsum.photos/seed/news/1200/800"} 
          alt={article.title} 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20">
          <div className="container mx-auto max-w-4xl space-y-6">
            <Link href="/news" className="inline-flex items-center text-white/70 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest gap-2 group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> {t.newsPage.detailBackToBlog}
            </Link>
            
            <div className="space-y-4">
              <Badge className="bg-primary text-white border-none rounded-full px-4 py-1 uppercase text-[10px] font-bold tracking-widest">
                {article.category}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-headline font-bold text-white leading-tight">
                {article.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-medium pt-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{t.newsPage.detailReadingTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Text */}
          <div className="lg:col-span-8 bg-white dark:bg-zinc-900 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-xl">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-headline prose-headings:font-bold prose-p:leading-relaxed prose-p:text-zinc-600 dark:prose-p:text-zinc-300">
              <p className="text-xl font-medium text-primary leading-relaxed italic border-l-4 border-primary pl-6 mb-10">
                {article.excerpt}
              </p>
              
              <div className="whitespace-pre-wrap">
                {article.content}
              </div>
            </div>
            
            <div className="mt-16 pt-8 border-t flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{article.category}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar / More Info */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="border-none shadow-lg rounded-[2rem] bg-primary text-white overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <HeartIcon className="h-10 w-10 text-white/20" />
                <h3 className="text-2xl font-headline font-bold">{t.newsPage.detailHelpCta}</h3>
                <p className="text-primary-foreground/80 leading-relaxed">
                  {t.newsPage.detailHelpText}
                </p>
                <Link href="/donate" className="block">
                  <Button className="w-full bg-white text-primary hover:bg-zinc-100 font-bold h-12 rounded-xl">
                    {t.newsPage.detailDonateBtn}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <div className="p-8 bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 space-y-6">
              <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">{t.newsPage.detailAboutAuthor}</h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {article.author?.[0]}
                </div>
                <div>
                  <p className="font-bold">{article.author}</p>
                  <p className="text-xs text-muted-foreground">{t.newsPage.detailAuthorRole}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                {t.newsPage.detailAuthorBio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function HeartIcon({ className }: { className?: string }) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
  );
}
