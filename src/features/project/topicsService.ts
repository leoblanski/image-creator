export interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string; // Prompt para a OpenAI gerar o conteúdo
  tags: string[];
  cta: string;
}

export interface TopicsByCategory {
  category: string;
  description: string;
  topics: Topic[];
}

// Tópicos otimizados para o Instagram
export const topicsData: TopicsByCategory[] = [
  {
    category: '🚀 Carreira em TI',
    description: 'Dicas para crescimento profissional e mercado de trabalho',
    topics: [
      {
        id: 'first-job',
        title: 'Como conseguir o primeiro emprego em TI',
        description: 'Guia completo para ingressar no mercado de trabalho',
        category: '🚀 Carreira em TI',
        prompt: `Crie um carrossel para Instagram com dicas PRÁTICAS e ESPECÍFICAS sobre como conseguir o primeiro emprego em TI.
        
        ESTRUTURA OBRIGATÓRIA:
        1. Primeiro slide: Título impactante + 1 frase que desperte interesse
        2. Slides intermediários: Apenas UMA dica específica por slide (máx. 2 linhas)
        3. Último slide: CTA direto com ação clara
        
        DIRETRIZES ESSENCIAIS:
        - Seja DIRETO: Cada dica deve ter no máximo 10 palavras
        - Seja ESPECÍFICO: Evite generalidades como "estude bastante"
        - Seja PRÁTICO: Dê exemplos concretos e acionáveis
        - Use EMOJIS relevantes para cada dica
        - Use linguagem coloquial e acessível
        
        EXEMPLOS DO QUE QUEREMOS:
        ❌ Ruim: "Aprenda a programar bem"
        ✅ Bom: "Domine os 20% do JavaScript mais usados no mercado"
        
        ❌ Ruim: "Faça networking"
        ✅ Bom: "Comente em 3 posts de devs sênior por dia no LinkedIn"
        
        TÓPICOS PARA INCLUIR:
        - Como destacar projetos pessoais no currículo
        - Quais tecnologias priorizar em 2025
        - Erros comuns em entrevistas técnicas
        - Como se destacar sem experiência prévia
        - O que os recrutadores realmente procuram`,
        tags: ['carreira', 'emprego', 'iniciante', 'dicas'],
        cta: 'Salve este post e siga para mais dicas! #BlanskiDev'
      },
      {
        id: 'freelance',
        title: 'Trabalhando como freelancer',
        description: 'Como começar a ganhar dinheiro com programação',
        category: '🚀 Carreira em TI',
        prompt: `Crie um carrossel para Instagram com digas PRÁTICAS sobre trabalhar como freelancer em TI.
        
        ESTRUTURA OBRIGATÓRIA:
        1. Primeiro slide: Título chamativo + 1 frase que gere identificação
        2. Slides intermediários: Apenas UMA dica específica por slide (máx. 2 linhas)
        3. Último slide: CTA direto com ação clara
        
        DIRETRIZES ESSENCIAIS:
        - Seja DIRETO: Cada dica deve ter no máximo 10 palavras
        - Seja ESPECÍFICO: Evite conselhos genéricos
        - Seja PRÁTICO: Dê exemplos concretos e acionáveis
        - Use EMOJIS relevantes para cada dica
        
        EXEMPLOS DO QUE QUEREMOS:
        ❌ Ruim: "Cobrar bem pelos seus serviços"
        ✅ Bom: "Cobrar R$X por hora (média do mercado em 2025)"
        
        ❌ Ruim: "Use boas ferramentas"
        ✅ Bom: "Use o Toggl para controle de horas e Notion para organização"
        
        TÓPICOS PARA INCLUIR:
        - Como precificar seu trabalho (valores reais)
        - Onde encontrar clientes internacionais
        - Como evitar calotes
        - Melhores plataformas para freelancers
        - Como escrever propostas vencedoras`,
        
        tags: ['freelance', 'trabalho', 'dinheiro', 'dicas'],
        cta: 'Quer começar como freelancer? Salve este post! #Freelancer'
      }
    ]
  },
  {
    category: '💻 Tecnologias em Alta',
    description: 'O que está em alta no mercado de desenvolvimento',
    topics: [
      {
        id: 'languages-2025',
        title: 'Linguagens mais promissoras em 2025',
        description: 'Quais linguagens valem a pena aprender',
        category: '💻 Tecnologias em Alta',
        prompt: `Crie um carrossel para Instagram sobre as linguagens de programação mais promissoras para 2025. 
        Destaque as principais características de cada linguagem, casos de uso e por que são relevantes. 
        Inclua JavaScript/TypeScript, Python, Rust, Go e Kotlin. 
        Use uma linguagem objetiva e inclua emojis para tornar o conteúdo mais atrativo.`,
        tags: ['linguagens', 'programação', 'tecnologia', 'dicas'],
        cta: 'Qual linguagem você quer aprender? Comenta aí! #Programação'
      },
      {
        id: 'web-frameworks',
        title: 'Frameworks web em 2025',
        description: 'As melhores opções para desenvolvimento web',
        category: '💻 Tecnologias em Alta',
        prompt: `Crie um carrossel para Instagram sobre os melhores frameworks web para 2025. 
        Compare React, Next.js, Svelte e Astro, destacando pontos fortes, casos de uso ideais e 
        tendências do mercado. Use uma linguagem acessível para iniciantes.`,
        tags: ['web', 'frontend', 'frameworks', 'tecnologia'],
        cta: 'Qual seu framework favorito? #WebDev'
      }
    ]
  },
  {
    category: '📚 Aprendizado',
    description: 'Dicas e estratégias para aprender programação',
    topics: [
      {
        id: 'study-methods',
        title: 'Como estudar programação',
        description: 'Métodos eficazes de aprendizado',
        category: '📚 Aprendizado',
        prompt: `Crie um carrossel para Instagram com dicas sobre como estudar programação de forma eficiente. 
        Aborde métodos de aprendizado, dicas de organização, recursos gratuitos, como manter a motivação 
        e como praticar de forma efetiva. Use uma linguagem motivacional e inclua emojis.`,
        tags: ['estudo', 'aprendizado', 'dicas', 'programação'],
        cta: 'Salve para não perder essas dicas! #AprendaProgramar'
      },
      {
        id: 'portfolio-projects',
        title: 'Projetos para o portfólio',
        description: 'Ideias para impressionar recrutadores',
        category: '📚 Aprendizado',
        prompt: `Crie um carrossel para Instagram com ideias de projetos para incluir no portfólio. 
        Inclua projetos de diferentes níveis de complexidade, desde iniciante até avançado, 
        com exemplos práticos e dicas de como implementar.`,
        tags: ['portfólio', 'projetos', 'carreira', 'dicas'],
        cta: 'Qual projeto você vai fazer primeiro? #PortfólioDev'
      }
    ]
  },
  {
    category: '🌎 Trabalho Remoto',
    description: 'Como trabalhar para empresas do exterior',
    topics: [
      {
        id: 'remote-work',
        title: 'Como conseguir trabalho remoto',
        description: 'Passo a passo para trabalhar de qualquer lugar',
        category: '🌎 Trabalho Remoto',
        prompt: `Crie um carrossel para Instagram com dicas sobre como conseguir trabalho remoto como desenvolvedor. 
        Inclua onde encontrar vagas, como se preparar para entrevistas em inglês, como se destacar, 
        como precificar seu trabalho e ferramentas essenciais.`,
        tags: ['remoto', 'trabalho', 'internacional', 'carreira'],
        cta: 'Sonha em trabalhar remoto? Salve este post! #TrabalhoRemoto'
      }
    ]
  }
];

export class TopicsService {
  private static instance: TopicsService;

  static getInstance(): TopicsService {
    if (!TopicsService.instance) {
      TopicsService.instance = new TopicsService();
    }
    return TopicsService.instance;
  }

  getCategories(): string[] {
    return topicsData.map(cat => cat.category);
  }

  getTopicsByCategory(category: string): Topic[] | undefined {
    const categoryData = topicsData.find(cat => cat.category === category);
    return categoryData?.topics;
  }

  getTopicById(id: string): Topic | undefined {
    for (const category of topicsData) {
      const topic = category.topics.find(t => t.id === id);
      if (topic) return topic;
    }
    return undefined;
  }

  getAllTopics(): Topic[] {
    return topicsData.flatMap(category => category.topics);
  }

  searchTopics(query: string): Topic[] {
    const searchTerm = query.toLowerCase();
    return this.getAllTopics().filter(
      topic =>
        topic.title.toLowerCase().includes(searchTerm) ||
        topic.description.toLowerCase().includes(searchTerm) ||
        topic.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Gera um prompt completo para a OpenAI com base no tópico selecionado
  generatePrompt(topicId: string, additionalInstructions?: string): string {
    const topic = this.getTopicById(topicId);
    if (!topic) return '';
    
    let prompt = `${topic.prompt}\n\n`;
    
    // Adiciona instruções adicionais se fornecidas
    if (additionalInstructions) {
      prompt += `Instruções adicionais: ${additionalInstructions}\n\n`;
    }
    
    // Adiciona formatação para o carrossel
    prompt += `Formato de saída desejado:
    1. Crie entre 5 e 8 slides
    2. Cada slide deve ter um título curto (até 40 caracteres)
    3. O conteúdo de cada slide deve ter no máximo 120 caracteres
    4. Inclua emojis relevantes
    5. Use uma linguagem clara e direta
    `;
    
    return prompt;
  }
}

export const topicsService = TopicsService.getInstance();
