import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const insightsDirectory = path.join(process.cwd(), 'insights_content');

export async function getInsightSlugs() {
  const fileNames = fs.readdirSync(insightsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

export async function getInsightData(slug) {
  const fullPath = path.join(insightsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const { data, content } = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(content);
  const contentHtml = processedContent.toString();

  // Extract the first heading as title if not provided in frontmatter
  let title = data.title;
  if (!title) {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    title = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ');
  }

  // Extract the first paragraph as excerpt if not provided in frontmatter
  let excerpt = data.excerpt;
  if (!excerpt) {
    const paragraphMatch = content.match(/^(?!#|\s*$).+$/m);
    excerpt = paragraphMatch ? paragraphMatch[0].substring(0, 200) + '...' : '';
  }

  return {
    slug,
    title,
    excerpt,
    contentHtml,
    ...data,
  };
}

export async function getAllInsights() {
  const slugs = await getInsightSlugs();
  const insights = await Promise.all(
    slugs.map(async (slug) => {
      const { title, excerpt, date, author, tags } = await getInsightData(slug);
      return {
        slug,
        title,
        excerpt,
        date: date || new Date().toISOString(),
        author: author || 'Saral Team',
        tags: tags || [],
      };
    })
  );

  // Sort insights by date
  return insights.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}