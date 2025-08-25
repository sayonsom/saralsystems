// src/app/blog/[slug]/page.js
import React from 'react';
import Image from "next/image";
import { notFound } from 'next/navigation';
import { getPost } from '@/lib/contentful';
import NewsletterForm from '@/components/NewsletterForm';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  if (!slug) {
    return {
      title: 'Post Not Found | Gridleaf Blog',
      description: 'The requested blog post could not be found.',
    };
  }

  const post = await getPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Gridleaf Blog',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | Gridleaf Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['Sayonsom Chanda'],
      images: (post.coverImage || post.featuredImage) ? [
        {
          url: post.coverImage ? `https:${post.coverImage.fields.file.url}` : post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.coverImage?.fields?.title || post.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [`https:${post.coverImage.fields.file.url}`] : (post.featuredImage ? [post.featuredImage] : []),
    },
  };
}

// Rich text rendering options
const renderOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => {
      return <p className="mb-6 leading-relaxed font-[family-name:var(--font-pt-serif)] text-lg leading-[1.8] !text-[#242424] dark:!text-gray-300">{children}</p>;
    },
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className="text-2xl font-bold mt-8 mb-4 font-[family-name:var(--font-sen)] !text-[#242424] dark:!text-gray-100">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className="text-xl font-semibold mt-6 mb-3 font-[family-name:var(--font-sen)] !text-[#242424] dark:!text-gray-100">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <ul className="list-disc list-inside mb-6 !text-[#242424] dark:!text-gray-300 font-[family-name:var(--font-pt-serif)] text-lg leading-[1.8]">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
      <ol className="list-decimal list-inside mb-6 !text-[#242424] dark:!text-gray-300 font-[family-name:var(--font-pt-serif)] text-lg leading-[1.8]">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => (
      <li className="mb-2">{children}</li>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { title, description, file } = node.data.target.fields;
      return (
        <figure className="my-8">
          <div className="relative aspect-video">
            <Image
              src={`https:${file.url}`}
              alt={description || title}
              fill
              className="object-cover rounded-none"
              sizes="(max-width: 1280px) 100vw, 1280px" />
          </div>
          {description && (
            <figcaption className="text-sm text-[#6b6b6b] dark:text-gray-600 mt-2 text-center font-[family-name:var(--font-pt-serif)]">
              {description}
            </figcaption>
          )}
        </figure>
      );
    },
    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 my-6 italic font-[family-name:var(--font-pt-serif)] text-lg leading-[1.8] !text-[#242424] dark:!text-gray-300">
        {children}
      </blockquote>
    ),
    [BLOCKS.TABLE]: (node, children) => (
      <div className="my-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {children}
          </tbody>
        </table>
      </div>
    ),
    [BLOCKS.TABLE_ROW]: (node, children) => <tr>{children}</tr>,
    [BLOCKS.TABLE_CELL]: (node, children) => {
      const isHeader = node.content && 
                       node.content[0] && 
                       node.content[0].content && 
                       node.content[0].content[0] && 
                       node.content[0].content[0].marks && 
                       node.content[0].content[0].marks.some(mark => mark.type === 'bold');
      
      return isHeader ? (
        <th className="px-4 py-3 text-left text-sm font-medium bg-gray-50 dark:bg-gray-800">
          {children}
        </th>
      ) : (
        <td className="px-4 py-3 text-base font-[family-name:var(--font-pt-serif)] !text-[#242424] dark:!text-gray-300">{children}</td>
      );
    },
    [BLOCKS.CODE]: (node) => {
      return (
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-none my-6 overflow-x-auto">
          <code className="!text-[#242424] dark:!text-gray-300">{node.value}</code>
        </pre>
      );
    },
    [INLINES.HYPERLINK]: (node, children) => {
      const { uri } = node.data;
      return (
        <a 
          href={uri} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 hover:border-emerald-700 transition-colors font-[family-name:var(--font-pt-serif)]"
        >
          {children}
        </a>
      );
    },
  },
  renderMark: {
    [MARKS.BOLD]: text => <strong className="!text-[#242424] dark:!text-gray-100 !font-bold">{text}</strong>,
    [MARKS.CODE]: text => (
                <code className="bg-gray-100 dark:bg-gray-800 rounded-none px-2 py-1 !text-[#242424] dark:!text-gray-300">{text}</code>
    ),
  },
};

// Schema.org structured data
function generateStructuredData(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? `https:${post.coverImage.fields.file.url}` : post.featuredImage,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: 'Sayonsom Chanda',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Gridleaf',
      logo: {
        '@type': 'ImageObject',
        url: 'https://gridleaf.org/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://gridleaf.org/blog/${post.slug}`
    }
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  try {
    const post = await getPost(slug);

    if (!post) {
      notFound();
    }

    // If you want to manually add a table section for testing
    const hasMarkdownTable = false; // Set to true to add a manual table
    const manualTable = hasMarkdownTable ? (
      <div className="my-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium bg-gray-50 dark:bg-gray-800">Country</th>
              <th className="px-4 py-3 text-left text-sm font-medium bg-gray-50 dark:bg-gray-800">DQI</th>
              <th className="px-4 py-3 text-left text-sm font-medium bg-gray-50 dark:bg-gray-800">α</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td className="px-4 py-3 text-sm">USA</td>
              <td className="px-4 py-3 text-sm">0.98</td>
              <td className="px-4 py-3 text-sm">0.2</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Canada</td>
              <td className="px-4 py-3 text-sm">0.95</td>
              <td className="px-4 py-3 text-sm">0.2</td>
            </tr>
          </tbody>
        </table>
      </div>
    ) : null;

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData(post))
          }}
        />
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-24">
          <header className="mb-12">
            <div className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
              {post.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-[family-name:var(--font-sen)]">{post.title}</h1>
            <p className="text-xl text-[#6b6b6b] dark:text-gray-400 mb-8 font-[family-name:var(--font-sen)]">
              {post.excerpt}
            </p>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Sayonsom Chanda</span>
              <span className="mx-2">·</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
              <span className="mx-2">·</span>
              <span>{post.readingTime} min read</span>
            </div>
          </header>

          {(post.coverImage || post.featuredImage) && (
            <figure className="mb-12">
              <div className="relative aspect-[16/9] overflow-hidden rounded-none">
                <Image
                  src={post.coverImage ? `https:${post.coverImage.fields.file.url}` : post.featuredImage}
                  alt={post.coverImage?.fields?.title || post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1280px) 100vw, 1280px" />
              </div>
              {post.coverImage?.fields?.description && (
                <figcaption className="text-sm text-[#6b6b6b] dark:text-gray-600 mt-2 text-center font-[family-name:var(--font-pt-serif)]">
                  {post.coverImage?.fields?.description}
                </figcaption>
              )}
            </figure>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none font-[family-name:var(--font-pt-serif)] !prose-p:text-[#242424] dark:!prose-p:text-gray-300 prose-p:text-lg prose-p:leading-[1.8] !prose-strong:text-[#242424] dark:!prose-strong:text-gray-100 !prose-strong:font-bold !prose-headings:text-[#242424] dark:!prose-headings:text-gray-100 !prose-li:text-[#242424] dark:!prose-li:text-gray-300 !prose-td:text-[#242424] dark:!prose-td:text-gray-300 !prose-blockquote:text-[#242424] dark:!prose-blockquote:text-gray-300">
            {manualTable}
            {documentToReactComponents(post.content, renderOptions)}
          </div>

          <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
            <NewsletterForm />
          </footer>
        </article>
      </>
    );
  } catch (error) {
    console.error('Error rendering blog post:', error);
    notFound();
  }
}