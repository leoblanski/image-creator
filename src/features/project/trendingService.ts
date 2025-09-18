export interface TrendingTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  popularity: number;
  tags: string[];
  source: 'reddit' | 'mock';
  url?: string;
  upvotes?: number;
  comments?: number;
}

export interface TrendingTopicsResponse {
  topics: TrendingTopic[];
  category: string;
  lastUpdated: string;
}

export interface RedditPost {
  data: {
    id: string;
    title: string;
    selftext: string;
    score: number;
    num_comments: number;
    subreddit: string;
    url: string;
    created_utc: number;
    permalink: string;
  };
}

export interface RedditResponse {
  data: {
    children: RedditPost[];
  };
}

// Mapeamento de categorias para subreddits
const SUBREDDIT_MAP: Record<string, string[]> = {
  'Technology': [
    'technology', 'programming', 'MachineLearning', 'artificial', 'webdev', 
    'gadgets', 'tech', 'computerscience', 'cybersecurity', 'startups'
  ],
  'Business': [
    'entrepreneur', 'startups', 'business', 'marketing', 'investing', 
    'personalfinance', 'smallbusiness', 'sales', 'consulting', 'freelance'
  ],
  'Education': [
    'education', 'studytips', 'college', 'university', 'learning', 
    'academic', 'teaching', 'students', 'onlinelearning', 'skillshare'
  ],
  'Health': [
    'fitness', 'nutrition', 'mentalhealth', 'meditation', 'yoga', 
    'loseit', 'bodybuilding', 'running', 'health', 'wellness'
  ],
  'Lifestyle': [
    'lifestyle', 'minimalism', 'productivity', 'selfimprovement', 
    'lifehacks', 'motivation', 'getmotivated', 'decidingtobebetter', 'zenhabits'
  ],
  'Entertainment': [
    'movies', 'television', 'gaming', 'music', 'books', 'comics', 
    'anime', 'netflix', 'streaming', 'entertainment'
  ]
};


export class TrendingService {
  private static instance: TrendingService;
  private cache: Map<string, TrendingTopicsResponse> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  static getInstance(): TrendingService {
    if (!TrendingService.instance) {
      TrendingService.instance = new TrendingService();
    }
    return TrendingService.instance;
  }

  // Função para buscar posts "how to" do Reddit
  private async fetchRedditPosts(subreddits: string[], category: string): Promise<RedditPost[]> {
    const allPosts: RedditPost[] = [];
    
    try {
      // Buscar por "how to" + categoria específica
      const howToQueries = this.generateHowToQueries(category);
      
      for (const query of howToQueries) {
        const encodedQuery = encodeURIComponent(query);
        const url = `https://www.reddit.com/search.json?q=${encodedQuery}&sort=relevance&limit=10&t=month`;
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'ImageCreatorApp/1.0.0'
          }
        });
        
        if (response.ok) {
          const data: RedditResponse = await response.json();
          allPosts.push(...data.data.children);
        }
      }
      
      // Se não encontrou nada, buscar posts hot do subreddit principal
      if (allPosts.length === 0) {
        const subreddit = subreddits[0];
        const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=10`;
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'ImageCreatorApp/1.0.0'
          }
        });
        
        if (response.ok) {
          const data: RedditResponse = await response.json();
          allPosts.push(...data.data.children);
        }
      }
      
    } catch (error) {
      console.warn(`Error fetching from Reddit:`, error);
      throw error;
    }
    
    return allPosts;
  }

  // Gerar queries "how to" baseadas na categoria
  private generateHowToQueries(category: string): string[] {
    const queryMap: Record<string, string[]> = {
      'Technology': [
        'how to learn programming',
        'how to start tech career',
        'how to choose programming language',
        'how to get tech job',
        'how to learn coding'
      ],
      'Business': [
        'how to start business',
        'how to grow business',
        'how to find customers',
        'how to make money online',
        'how to be entrepreneur'
      ],
      'Education': [
        'how to study effectively',
        'how to learn faster',
        'how to pass exams',
        'how to improve grades',
        'how to focus while studying'
      ],
      'Health': [
        'how to lose weight',
        'how to build muscle',
        'how to eat healthy',
        'how to exercise',
        'how to improve health'
      ],
      'Lifestyle': [
        'how to be productive',
        'how to manage time',
        'how to be happy',
        'how to reduce stress',
        'how to improve life'
      ],
      'Entertainment': [
        'how to make money online',
        'how to create content',
        'how to grow social media',
        'how to start youtube',
        'how to be creative'
      ]
    };
    
    return queryMap[category] || ['how to learn', 'how to improve', 'how to start'];
  }

  // Função para converter posts do Reddit em TrendingTopics
  private convertRedditPostsToTopics(posts: RedditPost[], category: string): TrendingTopic[] {
    return posts
      .filter(post => {
        const title = post.data.title.toLowerCase();
        // Filtrar posts muito curtos ou irrelevantes
        return post.data.title.length > 10 && 
               post.data.title.length < 200 &&
               !title.includes('[removed]') &&
               !title.includes('[deleted]');
      })
      .map(post => {
        // Calcular popularidade baseada em upvotes e comentários
        const popularity = Math.min(100, Math.max(1, 
          Math.round((post.data.score / 100) * 50 + (post.data.num_comments / 10) * 30)
        ));
        
        // Gerar tags baseadas no título e subreddit
        const tags = this.generateTagsFromTitle(post.data.title, post.data.subreddit);
        
        return {
          id: `reddit_${post.data.id}`,
          title: post.data.title,
          description: post.data.selftext || `Popular discussion in r/${post.data.subreddit}`,
          category,
          popularity,
          tags,
          source: 'reddit' as const,
          url: `https://reddit.com${post.data.permalink}`,
          upvotes: post.data.score,
          comments: post.data.num_comments
        };
      })
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 8); // Limitar a 8 tópicos
  }

  // Função para gerar tags baseadas no título
  private generateTagsFromTitle(title: string, subreddit: string): string[] {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'];
    
    const words = title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word))
      .slice(0, 4);
    
    // Adicionar o subreddit como tag
    return [...words, subreddit];
  }

  async getTrendingTopics(category: string): Promise<TrendingTopicsResponse> {
    // Check cache first
    const cached = this.cache.get(category);
    if (cached && this.isCacheValid(cached.lastUpdated)) {
      return cached;
    }

    console.log(`Fetching "how to" topics from Reddit for category: ${category}`);
    
    const subreddits = SUBREDDIT_MAP[category] || [];
    if (subreddits.length === 0) {
      throw new Error(`No subreddits mapped for category: ${category}`);
    }

    const redditPosts = await this.fetchRedditPosts(subreddits, category);
    const topics = this.convertRedditPostsToTopics(redditPosts, category);
    
    if (topics.length === 0) {
      throw new Error(`No "how to" topics found for ${category}`);
    }
    
    console.log(`Successfully fetched ${topics.length} "how to" topics from Reddit`);
    
    const response: TrendingTopicsResponse = {
      topics,
      category,
      lastUpdated: new Date().toISOString()
    };

    // Cache the response
    this.cache.set(category, response);

    return response;
  }

  private isCacheValid(lastUpdated: string): boolean {
    const now = new Date().getTime();
    const cacheTime = new Date(lastUpdated).getTime();
    return (now - cacheTime) < this.CACHE_DURATION;
  }

  // Method to get a specific topic by ID
  async getTopicById(topicId: string, category: string): Promise<TrendingTopic | null> {
    const response = await this.getTrendingTopics(category);
    return response.topics.find(topic => topic.id === topicId) || null;
  }

}

export const trendingService = TrendingService.getInstance();
