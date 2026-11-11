import { BlogPost } from '../../../models/blog.models';

export const postResolucaoAnatel: BlogPost = {
  slug: 'resolucao-anatel-diretrizes-chamadas-automatizadas',
  title: 'Nova Resolução da Anatel e as Diretrizes para Chamadas Automatizadas no Brasil',
  subtitle:
    'Entenda os requisitos regulatórios, prefixo 0303, limites de chamadas curtas e como empresas devem se adequar com agentes receptivos legítimos.',
  excerpt:
    'A Agência Nacional de Telecomunicações intensificou medidas contra o disparo indiscriminado de robocalls no Brasil. Analisamos o impacto regulatório para empresas e por que o foco em inteligência receptiva (inbound) é o caminho seguro e sustentável.',
  categorySlug: 'ultimas-noticias',
  categoryName: 'Últimas Notícias',
  coverImage: '/blog/covers/cover-anatel-telecom-regulation.svg',
  coverImageAlt: 'Símbolo da justiça e telecomunicações com escudo regulatório violeta e mapa do Brasil digital',
  coverImageCredit: 'Vozly Regulatory Compliance & Legal Tech Analysis',
  coverImageLicense: 'Vozly Proprietary CC-BY 4.0 Creative Commons',
  author: {
    id: 'editorial-vozly',
    name: 'Redação Vozly Insights',
    role: 'Jornalismo Regulatório & Telecom',
    avatarUrl: '/brand/vozly-app-icon.png',
    bio: 'Jornalistas e consultores jurídicos especializados em regulação de telecomunicações, direito digital e conformidade com a Anatel.'
  },
  publishedAt: '2026-11-01T14:00:00Z',
  publishedAtFormatted: '01 de Novembro de 2026',
  updatedAt: '2026-11-03T09:30:00Z',
  updatedAtFormatted: '03 de Novembro de 2026',
  readTimeMinutes: 5,
  featured: false,
  tags: ['Anatel', 'Regulação', 'Robocalls', '0303', 'Chamadas Curtas', 'Compliance Brasil'],
  metaTitle: 'Diretrizes da Anatel para Chamadas Automatizadas no Brasil — Vozly Insights',
  metaDescription:
    'Confira a análise jurídica e técnica das determinações da Anatel contra robocalls, regras para uso de IA e adequação em atendimento receptivo.',
  canonicalUrl: 'https://vozly.ai/blog/ultimas-noticias/resolucao-anatel-diretrizes-chamadas-automatizadas',
  tableOfContents: [
    { id: 'o-cerco-da-anatel-ao-telemarketing-abusivo', title: 'O Cerco da Anatel ao Telemarketing Abusivo', level: 2 },
    { id: 'principais-pontos-da-normativa', title: 'Principais Pontos da Normativa', level: 2 },
    { id: 'a-distincao-critica-ativo-vs-receptivo', title: 'A Distinção Crítica: Ativo vs. Receptivo', level: 2 },
    { id: 'boas-praticas-para-empresas-em-2026', title: 'Boas Práticas para Empresas em 2026', level: 2 }
  ],
  contentBlocks: [
    {
      type: 'paragraph',
      text: 'Nos últimos anos, o Brasil figurou nas primeiras posições mundiais em volume de chamadas telefônicas indesejadas (spam calls). Esse cenário motivou a Agência Nacional de Telecomunicações (Anatel) a implementar uma das ofensivas regulatórias mais contundentes de sua história contra o uso abusivo de redes de telefonia.'
    },
    {
      type: 'heading2',
      headingId: 'o-cerco-da-anatel-ao-telemarketing-abusivo',
      text: 'O Cerco da Anatel ao Telemarketing Abusivo'
    },
    {
      type: 'paragraph',
      text: 'As medidas incluem o bloqueio automático de linhas que realizam mais de 100 mil chamadas em um único dia com duração inferior a 3 segundos (chamadas curtas ou mudas), a obrigatoriedade do prefixo 0303 para campanhas ativas de vendas e a responsabilização solidária das prestadoras de serviços de telecomunicações.'
    },
    {
      type: 'heading2',
      headingId: 'principais-pontos-da-normativa',
      text: 'Principais Pontos da Normativa'
    },
    {
      type: 'list',
      listItems: [
        'Proibição expressa de disparadores em massa que derrubam a linha ao serem atendidos.',
        'Obrigatoriedade de identificação clara e inequívoca da entidade que origina a chamada.',
        'Multas pecuniárias substanciais e cancelamento imediato de recursos de numeração para infratores reincidentes.',
        'Estímulo prioritário à adoção de tecnologias de autenticação criptográfica de chamadas (Origem Verificada).'
      ]
    },
    {
      type: 'callout',
      calloutType: 'warning',
      calloutTitle: 'Atenção aos Bloqueios de Numeração',
      text: 'Empresas que utilizam discadores automáticos preditivos sem controle rigoroso de cadência correm sério risco de ver seus números institucionais suspensos pela fiscalização da agência.'
    },
    {
      type: 'heading2',
      headingId: 'a-distincao-critica-ativo-vs-receptivo',
      text: 'A Distinção Crítica: Ativo vs. Receptivo'
    },
    {
      type: 'paragraph',
      text: 'É imperativo destacar a diferença fundamental entre telemarketing ativo predatório e atendimento telefônico receptivo (inbound). As restrições da Anatel visam coibir quem perturba os cidadãos em momentos inoportunos com ofertas indesejadas.'
    },
    {
      type: 'paragraph',
      text: 'A plataforma Vozly atua como a recepcionista inteligente da empresa: é o cliente quem liga de forma voluntária procurando suporte, agendamento de serviços ou informações comerciais. O agente atende a chamada receptiva de pronto, sem transferências demoradas e sem gerar incômodo público.'
    },
    {
      type: 'heading2',
      headingId: 'boas-praticas-para-empresas-em-2026',
      text: 'Boas Práticas para Empresas em 2026'
    },
    {
      type: 'paragraph',
      text: 'Para manter total conformidade regulatória, as empresas devem auditar seus troncos de telecomunicações, assegurar que suas linhas receptivas estejam registradas sob seu próprio CNPJ e utilizar agentes com identificação transparente, informando no início do contato que se trata de um assistente de inteligência artificial institucional.'
    }
  ],
  sources: [
    {
      title: 'Despacho Decisório nº 1/2024/COGE/SCO',
      url: 'https://informacoes.anatel.gov.br',
      publication: 'Agência Nacional de Telecomunicações (Anatel)',
      date: '2024'
    },
    {
      title: 'Portal Qualidade e Consumidor Telecom',
      publication: 'Anatel',
      date: '2026'
    }
  ]
};
