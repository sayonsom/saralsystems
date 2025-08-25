// src/lib/contentful.js
import { createClient } from 'contentful';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';

// Initialize Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// Fetch all blog posts from energyAnalysis model
export async function getAllEnergyAnalysisPosts(limit = 10) {
  try {
    const response = await client.getEntries({
      content_type: 'energyAnalysis',
      order: '-sys.createdAt',
      limit: limit,
      // Only fetch published entries
      'sys.publishedVersion[exists]': true,
    });

    console.log(`Fetched ${response.items.length} energy analysis posts`);
    return response.items.map(transformPost);
  } catch (error) {
    console.error('Error fetching energy analysis posts:', error);
    console.error('Error details:', error.message);
    return [];
  }
}

// Fetch a single post by slug
export async function getEnergyAnalysisPostBySlug(slug) {
  try {
    console.log('Fetching post with slug:', slug, 'Type:', typeof slug);
    
    // Ensure slug is a string
    const slugString = typeof slug === 'object' ? slug.slug : slug;
    
    const response = await client.getEntries({
      content_type: 'energyAnalysis',
      'fields.slug': slugString,
      limit: 1,
    });

    if (response.items.length === 0) {
      return null;
    }

    return transformPost(response.items[0]);
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

// Transform Contentful response to a cleaner format
function transformPost(post) {
  const fields = post.fields;
  
  // Generate slug from title if not present
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };
  
  // Extract plain text from rich text content
  let plainTextContent = '';
  let excerpt = '';
  
  if (fields.content && fields.content.nodeType === 'document') {
    // Content is in Contentful Rich Text format
    plainTextContent = documentToPlainTextString(fields.content);
    // Generate excerpt from the first 200 characters of plain text
    excerpt = plainTextContent.substring(0, 200).trim() + (plainTextContent.length > 200 ? '...' : '');
  } else if (typeof fields.content === 'string') {
    // Content is already plain text
    plainTextContent = fields.content;
    excerpt = plainTextContent.substring(0, 200).trim() + (plainTextContent.length > 200 ? '...' : '');
  }
  
  // Use system ID as part of slug to ensure uniqueness
  const uniqueSlug = fields.slug || `${generateSlug(fields.title || 'post')}-${post.sys.id.substring(0, 8)}`;
  
  return {
    id: post.sys.id,
    title: fields.title || '',
    slug: uniqueSlug,
    excerpt: fields.excerpt || excerpt,
    content: fields.content || '', // Keep original rich text for blog detail page
    plainTextContent: plainTextContent, // Plain text version for reading time calculation
    date: fields.publishDate || post.sys.createdAt,
    updatedAt: post.sys.updatedAt,
    author: fields.author || 'Saral',
    category: 'Energy Analysis',
    tags: fields.tags || [],
    priority: fields.priority || 'normal',
    featuredImage: fields.featuredImage?.fields?.file?.url 
      ? `https:${fields.featuredImage.fields.file.url}` 
      : null,
    readingTime: calculateReadingTime(plainTextContent),
  };
}

// Calculate reading time based on content
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min read`;
}

// Fetch posts by category (returns all posts since category field doesn't exist)
export async function getEnergyAnalysisPostsByCategory(category, limit = 10) {
  try {
    // Since category field doesn't exist in the content model,
    // we return all posts for now. You can filter client-side if needed.
    const response = await client.getEntries({
      content_type: 'energyAnalysis',
      order: '-sys.createdAt',
      limit: limit,
      // Only fetch published entries
      'sys.publishedVersion[exists]': true,
    });

    console.log(`Fetched ${response.items.length} posts for category: ${category}`);
    return response.items.map(transformPost);
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    console.error('Error details:', error.message);
    return [];
  }
}

// Alias functions for blog page compatibility
export const getAllPosts = getAllEnergyAnalysisPosts;
export const fetchCategoryPosts = getEnergyAnalysisPostsByCategory;

// Get single post (for blog detail page)
export const getPost = getEnergyAnalysisPostBySlug;

// Get total count of posts
export async function getTotalPostsCount() {
  try {
    const response = await client.getEntries({
      content_type: 'energyAnalysis',
      limit: 1000, // High limit to get total count
      select: 'sys.id', // Only fetch IDs to reduce payload
      'sys.publishedVersion[exists]': true,
    });
    
    return response.total;
  } catch (error) {
    console.error('Error fetching total posts count:', error);
    return 0;
  }
}