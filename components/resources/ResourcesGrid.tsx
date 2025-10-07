'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useState, useMemo, useCallback } from 'react'
import { useForm, ControllerRenderProps } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form'
import { Card, CardContent } from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'

const POSTS_PER_PAGE = 6

const FilterFormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.length > 0, {
    message: 'At least one category should be selected.',
  }),
})

interface Resource {
  slug: string
  title: string
  description: string
  date: string
  author?: string
  tags?: string[]
  image?: string
}

interface ResourcesGridProps {
  resources: Resource[]
}

export function ResourcesGrid({ resources }: ResourcesGridProps) {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all'])

  // Extract unique categories from resources
  const categories = useMemo(() => {
    const allTags = resources.flatMap((r) => r.tags || [])
    const uniqueTags = Array.from(new Set(allTags))
    return [
      { label: 'All', value: 'all' },
      ...uniqueTags.map((tag) => ({
        label: tag.charAt(0).toUpperCase() + tag.slice(1),
        value: tag.toLowerCase(),
      })),
    ]
  }, [resources])

  const form = useForm<z.infer<typeof FilterFormSchema>>({
    resolver: zodResolver(FilterFormSchema),
    defaultValues: {
      items: ['all'],
    },
  })

  const handleCheckboxChange = useCallback(
    (
      checked: boolean | string,
      categoryValue: string,
      field: ControllerRenderProps<z.infer<typeof FilterFormSchema>, 'items'>
    ) => {
      let updatedValues = checked
        ? [...field.value, categoryValue]
        : field.value.filter((value: string) => value !== categoryValue)

      if (updatedValues.length === 0) {
        form.setValue('items', ['all'])
        setSelectedCategories(['all'])
        return
      }

      if (updatedValues.includes('all')) {
        updatedValues = updatedValues.filter((v: string) => v !== 'all')
      }

      if (JSON.stringify(field.value) !== JSON.stringify(updatedValues)) {
        form.setValue('items', updatedValues)
        setSelectedCategories(updatedValues)
        setVisibleCount(POSTS_PER_PAGE)
      }
    },
    [form]
  )

  const filteredResources = useMemo(() => {
    return resources.filter(
      (resource) =>
        selectedCategories.includes('all') ||
        resource.tags?.some((tag) =>
          selectedCategories.includes(tag.toLowerCase())
        )
    )
  }, [resources, selectedCategories])

  const resourcesToDisplay = filteredResources.length > 0 ? filteredResources : resources
  const hasMore = visibleCount < resourcesToDisplay.length

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE)
  }, [])

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-3xl font-semibold text-white">
        All Resources
      </h2>

      {/* Filter */}
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="items"
            render={({ field }) => (
              <FormItem className="flex flex-wrap items-center gap-2.5">
                {categories.map((category) => {
                  const isChecked = field.value?.includes(category.value)
                  return (
                    <FormItem
                      key={category.value}
                      className="flex items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Label className="bg-gray-900/50 border border-gray-800 flex cursor-pointer items-center gap-2.5 rounded-full px-4 py-2 hover:border-gray-700 transition-colors">
                          <span className="text-sm text-gray-300">{category.label}</span>
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(checked, category.value, field)
                            }
                          />
                        </Label>
                      </FormControl>
                    </FormItem>
                  )
                })}
              </FormItem>
            )}
          />
        </form>
      </Form>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resourcesToDisplay.slice(0, visibleCount).map((resource) => (
          <Link
            key={resource.slug}
            href={`/resources/${resource.slug}`}
            className="block"
          >
            <Card className="h-full border-gray-800 bg-gray-900/30 hover:border-orange-500 transition-colors">
              <CardContent className="p-0">
                <div className="text-gray-400 border-b border-gray-800 p-2.5 text-sm font-medium">
                  {resource.tags?.[0] || 'Guide'}
                </div>
                {resource.image && (
                  <AspectRatio ratio={1.520833333} className="overflow-hidden">
                    <Image
                      src={resource.image}
                      alt={resource.title}
                      fill
                      className="object-cover"
                    />
                  </AspectRatio>
                )}
                <div className="flex flex-col gap-5 p-5">
                  <h2 className="text-xl font-bold text-white leading-tight">
                    {resource.title}
                  </h2>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed line-clamp-3">
                    {resource.description}
                  </p>
                  <div>
                    <Badge className="rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                      Learn More
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {hasMore && (
        <Button
          className="w-full bg-gray-900/50 hover:bg-gray-900 border border-gray-800"
          onClick={handleLoadMore}
        >
          Load More
        </Button>
      )}
    </div>
  )
}
