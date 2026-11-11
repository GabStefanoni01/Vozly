import { BlogCategory } from '../../models/blog.models';

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: 'tecnologia-inovacao',
    name: 'Tecnologia & Inovação',
    badgeLabel: 'Tecnologia & Inovação',
    description: 'Transformação digital, infraestrutura de voz em nuvem e evolução dos sistemas corporativos.',
    longDescription:
      'Artigos e ensaios aprofundados sobre a modernização da infraestrutura de telecomunicações, computação em nuvem, segurança corporativa e o impacto de novas tecnologias nas operações empresariais.',
    coverImage: '/blog/covers/cover-tech-innovation.svg',
    coverImageAlt: 'Infraestrutura tecnológica em nuvem com circuitos violeta luminosos',
    icon: 'cpu',
    metaTitle: 'Tecnologia & Inovação — Vozly Insights',
    metaDescription:
      'Explore análises técnicas sobre telecomunicações em nuvem, computação distribuída, criptografia e inovação operacional para empresas modernas.'
  },
  {
    slug: 'engenharia-inteligencia-artificial',
    name: 'Engenharia & Inteligência Artificial',
    badgeLabel: 'Engenharia & IA',
    description: 'Arquiteturas de voz neural, modelos de linguagem em tempo real e orquestração de agentes autônomos.',
    longDescription:
      'Explorações técnicas e de engenharia detalhando o pipeline de baixa latência (STT, LLM, TTS), algoritmos de detecção de interrupção (barge-in), function calling determinístico e governança de IA generativa.',
    coverImage: '/blog/covers/cover-ai-engineering.svg',
    coverImageAlt: 'Rede neural artificial com nós luminosos e ondas de áudio convergentes',
    icon: 'sparkles',
    metaTitle: 'Engenharia & Inteligência Artificial — Vozly Insights',
    metaDescription:
      'Mergulhe na arquitetura de IA conversacional: pipelines de voz sub-segundo, detecção de turnos, LLMs orquestrados e chamadas de ferramentas em tempo real.'
  },
  {
    slug: 'ultimas-noticias',
    name: 'Últimas Notícias',
    badgeLabel: 'Últimas Notícias',
    description: 'Acontecimentos regulatórios, padrões globais de telefonia e atualizações da indústria de IA.',
    longDescription:
      'Cobertura jornalística contextualizada dos marcos regulatórios da Anatel, adoção de protocolos de autenticação STIR/SHAKEN, lançamentos de novos modelos fundacionais e movimentações da indústria.',
    coverImage: '/blog/covers/cover-news.svg',
    coverImageAlt: 'Rede global de telecomunicações com satélites e transmissão de dados segura',
    icon: 'activity',
    metaTitle: 'Últimas Notícias — Vozly Insights',
    metaDescription:
      'Notícias factuais e apurações sobre regulação de telecomunicações, inteligência artificial, diretrizes da Anatel e segurança contra spam e fraudes telefônicas.'
  }
];
