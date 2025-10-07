import { getContentByType } from '@/lib/mdx'
import Link from 'next/link'
import { Home, Slash, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Card, CardContent } from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'
import { ResourcesGrid } from '@/components/resources/ResourcesGrid'

export const metadata = {
  title: 'Resources - Vibe Code Phoenix',
  description: 'Curated learning resources, tutorials, and guides for developers'
}

export default function ResourcesPage() {
  const resources = getContentByType('resources')
  const featuredResource = resources[0]

  return (
    <div className="min-h-screen bg-black">
      {/* Header Section */}
      <div className="bg-gray-900/30 border-b border-gray-800">
        <div className="container mx-auto px-4 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-start">
            <div className="flex flex-col gap-8">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">
                      <Home className="h-4 w-4" />
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <Slash />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/resources">Resources</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex flex-col gap-5">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Learning Resources
                </h1>
                <p className="text-xl text-gray-400 font-medium leading-relaxed">
                  Curated tutorials, guides, and learning materials to level up your development skills
                </p>
              </div>
            </div>

            {featuredResource && (
              <Link
                href={`/resources/${featuredResource.slug}`}
                className="block"
              >
                <Card className="border-gray-800 bg-gray-900/50 hover:border-orange-500 transition-colors">
                  <CardContent className="p-0">
                    <div className="text-gray-400 border-b border-gray-800 p-2.5 text-sm font-medium">
                      Featured Guide
                    </div>
                    {featuredResource.image && (
                      <AspectRatio ratio={1.520833333} className="overflow-hidden">
                        <Image
                          src={featuredResource.image}
                          alt={featuredResource.title}
                          fill
                          className="object-cover"
                        />
                      </AspectRatio>
                    )}
                    <div className="flex flex-col gap-5 p-5">
                      <h2 className="text-2xl font-bold text-white leading-tight">
                        {featuredResource.title}
                      </h2>
                      <p className="text-gray-400 text-sm font-medium leading-relaxed">
                        {featuredResource.description}
                      </p>
                      <div>
                        <Badge className="rounded-full bg-orange-500 hover:bg-orange-600">
                          Read Guide
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="container mx-auto px-4 py-20">
        <ResourcesGrid resources={resources} />
      </div>
    </div>
  )
}
