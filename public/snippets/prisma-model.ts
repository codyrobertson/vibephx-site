import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty'
  }).$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Database utility functions
export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  }
}

export async function disconnectDB() {
  await prisma.$disconnect()
  console.log('🔌 Database disconnected')
}

// User operations
export const userService = {
  async create(data: {
    email: string
    name: string
    avatarUrl?: string
  }) {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        avatarUrl: data.avatarUrl,
        emailVerified: false,
        subscriptionTier: 'free'
      }
    })
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        projects: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    })
  },

  async updateLastLogin(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() }
    })
  }
}

// Project operations
export const projectService = {
  async create(data: {
    userId: string
    name: string
    description?: string
    techStack: any
    features: string[]
  }) {
    return prisma.project.create({
      data: {
        userId: data.userId,
        name: data.name,
        description: data.description,
        techStack: data.techStack,
        features: data.features,
        status: 'draft'
      },
      include: {
        user: { select: { name: true, email: true } },
        features: true
      }
    })
  },

  async findByUserId(userId: string, limit = 10) {
    return prisma.project.findMany({
      where: { userId },
      include: {
        features: {
          select: {
            id: true,
            name: true,
            status: true,
            priority: true
          }
        },
        _count: {
          select: {
            analyses: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit
    })
  },

  async updateStatus(projectId: string, status: string) {
    return prisma.project.update({
      where: { id: projectId },
      data: { 
        status,
        ...(status === 'deployed' && { deployedAt: new Date() })
      }
    })
  }
}

// Feature operations
export const featureService = {
  async createMany(projectId: string, features: Array<{
    name: string
    description?: string
    priority: string
    estimatedHours?: number
    complexityScore?: number
  }>) {
    const data = features.map(feature => ({
      ...feature,
      projectId,
      status: 'pending'
    }))

    return prisma.projectFeature.createMany({
      data,
      skipDuplicates: true
    })
  },

  async updateStatus(featureId: string, status: string) {
    return prisma.projectFeature.update({
      where: { id: featureId },
      data: {
        status,
        ...(status === 'completed' && { completedAt: new Date() })
      }
    })
  }
}

// Analytics operations  
export const analyticsService = {
  async recordAnalysis(data: {
    projectId: string
    analysisType: string
    inputData: any
    outputData: any
    modelUsed: string
    tokensUsed?: number
    processingTimeMs?: number
    confidenceScore?: number
  }) {
    return prisma.aiAnalysis.create({
      data
    })
  },

  async getProjectAnalytics(projectId: string) {
    const [totalAnalyses, avgProcessingTime, modelUsage] = await Promise.all([
      prisma.aiAnalysis.count({ where: { projectId } }),
      
      prisma.aiAnalysis.aggregate({
        where: { projectId },
        _avg: { processingTimeMs: true, tokensUsed: true }
      }),
      
      prisma.aiAnalysis.groupBy({
        where: { projectId },
        by: ['modelUsed'],
        _count: { modelUsed: true }
      })
    ])

    return {
      totalAnalyses,
      avgProcessingTime: avgProcessingTime._avg.processingTimeMs,
      avgTokensUsed: avgProcessingTime._avg.tokensUsed,
      modelUsage
    }
  }
}