import { getPostBySlug, getContentByType } from '@/lib/mdx'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { Calendar, ArrowLeft, Tag, FileText, Share2, Home, Twitter, Linkedin, Facebook } from 'lucide-react'
import Image from 'next/image'
import { AIOptions } from '@/components/AIOptions'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'

export async function generateStaticParams() {
  const posts = getContentByType('blog')
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug('blog', slug)

  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  return {
    title: `${post.title} - Vibe Code Phoenix`,
    description: post.description
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug('blog', slug)

  if (!post) {
    notFound()
  }

  const currentUrl = `https://vibecodephx.com/blog/${post.slug}`
  const shareText = `Check out: ${post.title}`

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          {/* Main Content */}
          <div className="md:col-span-8 lg:col-span-9">
            <article>
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                {post.author && <div>By {post.author}</div>}
              </div>

              <Separator className="mb-8" />

              {/* Featured Image */}
              {post.image && (
                <div className="relative w-full h-64 md:h-96 bg-gray-800 rounded-lg overflow-hidden mb-8">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* MDX Content */}
              <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-orange-500 prose-strong:text-white prose-code:text-orange-400 prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700">
                <MDXRemote source={post.content} />
              </div>

              {/* Back Link */}
              <div className="mt-12">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-4 lg:col-span-3">
            <aside className="flex flex-col gap-2 sticky top-24">
              {/* Blog Post Info */}
              <div className="mb-6 overflow-hidden rounded-lg border border-gray-800 bg-gray-900/30 shadow-sm">
                <div className="border-b border-gray-800 bg-gray-800/50 px-5 py-4">
                  <h3 className="flex items-center text-sm font-semibold text-white">
                    <FileText className="mr-2.5 h-3.5 w-3.5 text-gray-400" />
                    Blog Post
                  </h3>
                </div>
                <div className="p-5">
                  <p className="text-lg font-semibold leading-snug text-white">
                    {post.title}
                  </p>
                </div>
              </div>

              {/* AI Options */}
              <AIOptions title={post.title} content={post.content} />

              {/* Share */}
              <div className="mb-6 overflow-hidden rounded-lg border border-gray-800 bg-gray-900/30 shadow-sm">
                <div className="border-b border-gray-800 bg-gray-800/50 px-5 py-4">
                  <h3 className="flex items-center text-sm font-semibold text-white">
                    <Share2 className="mr-2.5 h-3.5 w-3.5 text-gray-400" />
                    Share this article
                  </h3>
                </div>
                <div className="p-5">
                  <ul className="flex items-center gap-2">
                    <li>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-gray-800/50 transition-colors hover:bg-gray-700"
                        aria-label="Share on Twitter"
                      >
                        <Twitter className="h-5 w-5 text-gray-400" />
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-gray-800/50 transition-colors hover:bg-gray-700"
                        aria-label="Share on LinkedIn"
                      >
                        <Linkedin className="h-5 w-5 text-gray-400" />
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-gray-800/50 transition-colors hover:bg-gray-700"
                        aria-label="Share on Facebook"
                      >
                        <Facebook className="h-5 w-5 text-gray-400" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
