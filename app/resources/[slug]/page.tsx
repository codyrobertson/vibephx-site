import { getPostBySlug, getContentByType } from '@/lib/mdx'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { Calendar, ArrowLeft, Tag, BookOpen, Share2, Home, Twitter, Linkedin, Facebook } from 'lucide-react'
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
  const resources = getContentByType('resources')
  return resources.map((resource) => ({
    slug: resource.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const resource = getPostBySlug('resources', slug)

  if (!resource) {
    return {
      title: 'Resource Not Found'
    }
  }

  return {
    title: `${resource.title} - Vibe Code Phoenix`,
    description: resource.description
  }
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const resource = getPostBySlug('resources', slug)

  if (!resource) {
    notFound()
  }

  const currentUrl = `https://vibecodephx.com/resources/${resource.slug}`
  const shareText = `Check out: ${resource.title}`

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
              <BreadcrumbLink href="/resources">Resources</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{resource.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          {/* Main Content */}
          <div className="md:col-span-8 lg:col-span-9">
            <article>
              {/* Tags */}
              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {resource.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {resource.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(resource.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                {resource.author && <div>By {resource.author}</div>}
              </div>

              <Separator className="mb-8" />

              {/* MDX Content */}
              <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-orange-500 prose-strong:text-white prose-code:text-orange-400 prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700">
                <MDXRemote source={resource.content} />
              </div>

              {/* Back Link */}
              <div className="mt-12">
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Resources
                </Link>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-4 lg:col-span-3">
            <aside className="flex flex-col gap-2 sticky top-24">
              {/* Resource Type */}
              <div className="mb-6 overflow-hidden rounded-lg border border-gray-800 bg-gray-900/30 shadow-sm">
                <div className="border-b border-gray-800 bg-gray-800/50 px-5 py-4">
                  <h3 className="flex items-center text-sm font-semibold text-white">
                    <BookOpen className="mr-2.5 h-3.5 w-3.5 text-gray-400" />
                    Learning Resource
                  </h3>
                </div>
                <div className="p-5">
                  <p className="text-lg font-semibold leading-snug text-white">
                    {resource.title}
                  </p>
                </div>
              </div>

              {/* AI Options */}
              <AIOptions title={resource.title} content={resource.content} />

              {/* Share */}
              <div className="mb-6 overflow-hidden rounded-lg border border-gray-800 bg-gray-900/30 shadow-sm">
                <div className="border-b border-gray-800 bg-gray-800/50 px-5 py-4">
                  <h3 className="flex items-center text-sm font-semibold text-white">
                    <Share2 className="mr-2.5 h-3.5 w-3.5 text-gray-400" />
                    Share this guide
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
