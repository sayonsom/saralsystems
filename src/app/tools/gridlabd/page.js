import Hero from '@/components/gridlabd-cloud/Hero';
import Overview from '@/components/gridlabd-cloud/Overview';
import Features from '@/components/gridlabd-cloud/Features';
import AIFeatures from '@/components/gridlabd-cloud/AIFeatures';
import UseCases from '@/components/gridlabd-cloud/UseCases';
import DashboardMock from '@/components/gridlabd-cloud/DashboardMock';
import Pricing from '@/components/gridlabd-cloud/Pricing';
import CTA from '@/components/gridlabd-cloud/CTA';
import { getPostsByTag } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import Utilities from '@/components/gridlabd-cloud/Utilities';
import Researchers from '@/components/gridlabd-cloud/Researchers';

export default async function Page() {
  const gridlabdPosts = (await getPostsByTag('GridSpeed')).slice(0, 6);

  return (
    <main className="bg-white text-gray-900">
      {/* Hero */}
      <Hero />
      {/* Overview */}
      <Overview />
      {/* Audience Sections */}
      <Utilities />
      <Researchers />
      {/* Features */}
      <Features />
      {/* AI */}
      <AIFeatures />
      {/* Use Cases */}
      <UseCases />
      {/* Dashboard */}
      <DashboardMock />

      {/* Technical Posts: GridSpeed */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Latest on GridSpeed</h2>
            <Link href="/posts" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Read More →
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {gridlabdPosts.map((post, index) => (
              <PostCard key={post.slug} post={post} delay={index * 0.05} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <Pricing />
      {/* CTA */}
      <CTA />
    </main>
  );
}