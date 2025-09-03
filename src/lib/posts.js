import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';

const postsDirectory = path.join(process.cwd(), 'src/app/posts');

export async function getPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

export async function getPostData(slug) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const { data, content } = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
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

  // Calculate reading time
  const wordsPerMinute = 200;
  const textContent = content.replace(/[^\w\s]/g, '').split(/\s+/);
  const readingTime = Math.ceil(textContent.length / wordsPerMinute);

  return {
    slug,
    title,
    excerpt,
    contentHtml,
    readingTime,
    date: data.date || new Date().toISOString(),
    author: data.author || 'Saral Team',
    tags: data.tags || [],
    categories: data.categories || [],
    description: data.description || excerpt,
    // New: cover image metadata from frontmatter
    coverImage: data.coverImage || null,
    coverAlt: data.coverAlt || '',
    ...data,
  };
}

export async function getAllPosts() {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const postData = await getPostData(slug);
      return postData;
    })
  );

  // Filter out null posts and sort by date
  return posts
    .filter(post => post !== null)
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
}

export async function getPostsByTag(tag) {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => 
    post.tags.some(postTag => 
      postTag.toLowerCase() === tag.toLowerCase()
    )
  );
}

export async function getPostsByCategory(category) {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => 
    post.categories.some(postCategory => 
      postCategory.toLowerCase() === category.toLowerCase()
    )
  );
}

export async function getAllTags() {
  const allPosts = await getAllPosts();
  const tags = new Set();
  
  allPosts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => tags.add(tag));
    }
  });
  
  return Array.from(tags).sort();
}

export async function getAllCategories() {
  const allPosts = await getAllPosts();
  const categories = new Set();
  
  allPosts.forEach(post => {
    if (post.categories) {
      post.categories.forEach(category => categories.add(category));
    }
  });
  
  return Array.from(categories).sort();
}
