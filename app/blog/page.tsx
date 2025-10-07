import { getContentByType } from '@/lib/mdx'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Blog - Vibe Code Phoenix',
  description: 'Read our latest articles about tech, community, and learning'
}

export default function BlogPage() {
  const posts = getContentByType('blog')

  return (
    <section className="min-h-screen bg-black py-32">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20">
            Latest Updates
          </Badge>
          <h2 className="mb-3 text-3xl font-semibold text-pretty text-white md:mb-4 md:text-5xl lg:mb-6">
            Blog Posts
          </h2>
          <p className="mb-12 text-gray-400 md:text-base lg:text-lg">
            Discover the latest trends, tips, and insights from the Vibe Code Phoenix community.
            Stay updated with our expert content on tech, development, and community building.
          </p>
        </div>

        {/* Blog Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="mx-auto max-w-5xl space-y-12">
            {posts.map((post) => (
              <Card
                key={post.slug}
                className="overflow-hidden border-0 bg-transparent shadow-none"
              >
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="shrink-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block transition-opacity duration-200 hover:opacity-90"
                    >
                      {post.image && (
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={260}
                          height={146}
                          className="aspect-video w-full rounded-lg object-cover object-center sm:w-[260px]"
                        />
                      )}
                    </Link>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      {post.tags && post.tags[0] && (
                        <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                          {post.tags[0].charAt(0).toUpperCase() + post.tags[0].slice(1)}
                        </Badge>
                      )}
                      {post.author && <span>{post.author}</span>}
                      <span>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold leading-tight text-white lg:text-2xl">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:underline"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-base text-gray-400">
                      {post.description}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-orange-400 hover:underline"
                    >
                      Read more
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
