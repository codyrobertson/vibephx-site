// Generation Queue Manager
// Handles API rate limiting, caching, and request management

interface QueueItem {
  id: string
  documentType: string
  projectData: any
  priority: number
  timestamp: number
  retryCount: number
  sessionId: string
}

interface CacheEntry {
  content: string
  timestamp: number
  projectHash: string
}

class GenerationQueue {
  private queue: QueueItem[] = []
  private processing = false
  private cache = new Map<string, CacheEntry>()
  private readonly MAX_RETRIES = 2
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours
  private readonly RATE_LIMIT_DELAY = 3000 // 3 seconds between requests
  
  // Add item to queue
  enqueue(item: Omit<QueueItem, 'timestamp' | 'retryCount' | 'id'>): string {
    const queueItem: QueueItem = {
      ...item,
      id: `${item.documentType}-${item.sessionId}-${Date.now()}`,
      timestamp: Date.now(),
      retryCount: 0
    }
    
    // Insert based on priority (higher priority first)
    const insertIndex = this.queue.findIndex(q => q.priority < item.priority)
    if (insertIndex === -1) {
      this.queue.push(queueItem)
    } else {
      this.queue.splice(insertIndex, 0, queueItem)
    }
    
    console.log(`📥 Queued ${item.documentType} (position: ${this.queue.length}, priority: ${item.priority})`)
    
    // Start processing if not already running
    if (!this.processing) {
      this.startProcessing()
    }
    
    return queueItem.id
  }
  
  // Get cached content if available
  getFromCache(projectData: any, documentType: string): string | null {
    const cacheKey = this.getCacheKey(projectData, documentType)
    const cached = this.cache.get(cacheKey)
    
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      console.log(`🎯 Cache HIT for ${documentType}`)
      return cached.content
    }
    
    if (cached) {
      console.log(`⏰ Cache EXPIRED for ${documentType}`)
      this.cache.delete(cacheKey)
    }
    
    return null
  }
  
  // Cache content
  setCache(projectData: any, documentType: string, content: string): void {
    const cacheKey = this.getCacheKey(projectData, documentType)
    this.cache.set(cacheKey, {
      content,
      timestamp: Date.now(),
      projectHash: this.hashProject(projectData)
    })
    console.log(`💾 Cached ${documentType} (${content.length} chars)`)
  }
  
  // Start queue processing
  private async startProcessing(): Promise<void> {
    if (this.processing) return
    
    this.processing = true
    console.log(`🚀 Queue processor started (${this.queue.length} items)`)
    
    while (this.queue.length > 0) {
      const item = this.queue.shift()!
      
      try {
        await this.processItem(item)
        
        // Rate limiting delay
        if (this.queue.length > 0) {
          console.log(`⏱️ Rate limiting: waiting ${this.RATE_LIMIT_DELAY}ms...`)
          await new Promise(resolve => setTimeout(resolve, this.RATE_LIMIT_DELAY))
        }
        
      } catch (error) {
        console.error(`❌ Queue item failed:`, error)
        
        // Retry logic
        if (item.retryCount < this.MAX_RETRIES) {
          item.retryCount++
          item.timestamp = Date.now()
          this.queue.push(item) // Add to end for retry
          console.log(`🔄 Retrying ${item.documentType} (attempt ${item.retryCount + 1}/${this.MAX_RETRIES + 1})`)
        } else {
          console.error(`💀 Max retries exceeded for ${item.documentType}`)
        }
      }
    }
    
    this.processing = false
    console.log(`✅ Queue processing completed`)
  }
  
  // Process individual queue item
  private async processItem(item: QueueItem): Promise<void> {
    console.log(`⚙️ Processing ${item.documentType}...`)
    
    // Check cache first
    const cached = this.getFromCache(item.projectData, item.documentType)
    if (cached) {
      // Emit cached result (would need event system in real implementation)
      return
    }
    
    // Make API call
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
        'X-Title': process.env.OPENROUTER_SITE_NAME || 'VibePHX AI Builder',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [{
          role: 'user',
          content: `Generate ${item.documentType} for: ${JSON.stringify(item.projectData)}`
        }],
        stream: false
      }),
      signal: AbortSignal.timeout(120000) // 2 minute timeout
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    const content = data.choices[0]?.message?.content
    
    if (!content) {
      throw new Error('No content in API response')
    }
    
    // Cache the result
    this.setCache(item.projectData, item.documentType, content)
    
    console.log(`✅ Completed ${item.documentType} (${content.length} chars)`)
  }
  
  // Generate cache key
  private getCacheKey(projectData: any, documentType: string): string {
    const hash = this.hashProject(projectData)
    return `${documentType}-${hash}`
  }
  
  // Hash project data for caching
  private hashProject(projectData: any): string {
    const key = `${projectData.template || 'custom'}-${projectData.customIdea || ''}-${JSON.stringify(projectData.stack || {})}`
    return btoa(key).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)
  }
  
  // Get queue status
  getStatus() {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      cacheSize: this.cache.size,
      nextItems: this.queue.slice(0, 3).map(item => ({
        documentType: item.documentType,
        priority: item.priority,
        retryCount: item.retryCount
      }))
    }
  }
  
  // Clear old cache entries
  cleanupCache(): void {
    const now = Date.now()
    let cleaned = 0
    
    for (const [key, entry] of this.cache.entries()) {
      if ((now - entry.timestamp) > this.CACHE_TTL) {
        this.cache.delete(key)
        cleaned++
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} expired cache entries`)
    }
  }
}

// Export singleton instance
export const generationQueue = new GenerationQueue()

// Cleanup cache every hour
if (typeof window === 'undefined') { // Server-side only
  setInterval(() => {
    generationQueue.cleanupCache()
  }, 60 * 60 * 1000)
}