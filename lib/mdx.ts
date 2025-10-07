import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

export interface Post {
  slug: string
  title: string
  date: string
  description: string
  author?: string
  tags?: string[]
  image?: string
  content: string
}

export function getContentByType(type: 'blog' | 'resources'): Post[] {
  const typeDirectory = path.join(contentDirectory, type)

  if (!fs.existsSync(typeDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(typeDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(typeDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
        author: data.author,
        tags: data.tags,
        image: data.image,
        content,
      } as Post
    })

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(type: 'blog' | 'resources', slug: string): Post | null {
  try {
    const fullPath = path.join(contentDirectory, type, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title,
      date: data.date,
      description: data.description,
      author: data.author,
      tags: data.tags,
      image: data.image,
      content,
    } as Post
  } catch (error) {
    return null
  }
}
