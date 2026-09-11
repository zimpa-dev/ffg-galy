import type { Metadata } from 'next';
import { getPublicDoc } from '@/lib/firestore-rest';
import { SITE_NAME, absoluteUrl } from '@/lib/site';

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await getPublicDoc('news', id);

  if (!article) {
    return {
      title: 'Artikel nicht gefunden',
      robots: { index: false, follow: true },
    };
  }

  const title = typeof article.title === 'string' ? article.title : 'Aktuelles';
  const description =
    typeof article.excerpt === 'string'
      ? article.excerpt
      : `Lesen Sie den vollständigen Artikel auf ${SITE_NAME}.`;
  const image = typeof article.image === 'string' ? article.image : undefined;
  const url = `/news/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      images: image ? [{ url: image }] : undefined,
      publishedTime: typeof article.date === 'string' ? article.date : undefined,
      authors: typeof article.author === 'string' ? [article.author] : undefined,
      section: typeof article.category === 'string' ? article.category : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function NewsArticleLayout({ params, children }: Props) {
  const { id } = await params;
  const article = await getPublicDoc('news', id);

  const articleJsonLd = article
    ? {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title,
        description: article.excerpt,
        image: article.image ? [article.image] : undefined,
        datePublished: article.date,
        author: article.author ? { '@type': 'Person', name: article.author } : undefined,
        articleSection: article.category,
        mainEntityOfPage: absoluteUrl(`/news/${id}`),
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
        },
      }
    : null;

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
