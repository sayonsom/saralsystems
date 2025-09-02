import { NextResponse } from 'next/server';
import { getAllPosts, getPostsByTag, getPostsByCategory } from '@/lib/posts';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit')) || 50;

    let posts;

    if (tag) {
      posts = await getPostsByTag(tag);
    } else if (category) {
      posts = await getPostsByCategory(category);
    } else {
      posts = await getAllPosts();
    }

    // Limit results
    const limitedPosts = posts.slice(0, limit);

    // Return simplified post data for API responses
    const simplifiedPosts = limitedPosts.map(post => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      date: post.date,
      readingTime: post.readingTime,
      tags: post.tags,
      categories: post.categories,
      description: post.description
    }));

    return NextResponse.json(simplifiedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
