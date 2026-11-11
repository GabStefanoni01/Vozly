import { BlogPost } from '../../../models/blog.models';

export const postSegurancaCriptografia: BlogPost = {
  slug: 'seguranca-informacao-criptografia-ambientes-corporativos',
  title: 'Segurança da Informação e Criptografia Ponta a Ponta em Ambientes Corporativos',
  subtitle:
    'Como proteger fluxos de áudio sensíveis, dados pessoais e cumprir os mandatos da LGPD sem comprometer o desempenho conversacional.',
  excerpt:
    'A captura e o processamento de voz em tempo real envolvem biometria e dados comportamentais protegidos por legislação. Detalhamos as práticas de isolamento multi-tenant, sanitização de PII em voo e cifragem de gravações corporativas.',
  categorySlug: 'tecnologia-inovacao',
  categoryName: 'Tecnologia & Inovação',
  coverImage: '/blog/covers/cover-security-encryption.svg',
  coverImageAlt: 'Cadeado criptográfico holográfico violeta sobre matriz de chaves digitais seguras',
  coverImageCredit: 'Vozly Cyber Defense & Compliance Lab',
  coverImageLicense: 'Vozly Proprietary CC-BY 4.0 Creative Commons',
  author: {
    id: 'seguranca-vozly',
    name: 'Time de Segurança & Compliance',
    role: 'Governança de Dados & Cibersegurança Vozly',
    avatarUrl: '/brand/vozly-app-icon.png',
    bio: 'Especialistas em segurança da informação, conformidade com a LGPD/GDPR, arquiteturas Zero Trust e criptografia aplicada.'
  },
  publishedAt: '2026-10-28T14:00:00Z',
  publishedAtFormatted: '28 de Outubro de 2026',
  updatedAt: '2026-11-02T11:15:00Z',
  updatedAtFormatted: '02 de Novembro de 2026',
  readTimeMinutes: 6,
  featured: false,
  tags: ['Segurança', 'Criptografia', 'LGPD', 'Zero Trust', 'PII Masking', 'Compliance'],
  metaTitle: 'Criptografia e Segurança da Informação na Telefonia B2B — Vozly Insights',
  metaDescription:
    'Conheça as camadas de proteção indispensáveis para ambientes corporativos: isolamento estrito de tenants, mascaramento dinâmico de PII e criptografia AES-256.',
  canonicalUrl: 'https://vozly.ai/blog/tecnologia-inovacao/seguranca-informacao-criptografia-ambientes-corporativos',
  tableOfContents: [
    { id: 'o-audio-como-dado-pessoal-sensivel', title: 'O Áudio como Dado Pessoal Sensível', level: 2 },
    { id: 'camadas-de-cifragem-em-transito-e-repouso', title: 'Camadas de Cifragem em Trânsito e Repouso', level: 2 },
    { id: 'mascaramento-de-pii-em-fluxo-continuo', title: 'Mascaramento de PII em Fluxo Contínuo', level: 2 },
    { id: 'isolamento-multi-tenant-e-zero-trust', title: 'Isolamento Multi-tenant e Zero Trust', level: 2 },
    { id: 'auditoria-e-trilha-imutavel', title: 'Auditoria e Trilha Imutável', level: 2 }
  ],
  contentBlocks: [
    {
      type: 'paragraph',
      text: 'O canal telefônico é tradicionalmente o ponto mais vulnerável da cadeia de comunicação empresarial. Enquanto e-mails, arquivos na nuvem e bancos de dados contam com rigorosos controles de acesso e criptografia moderna, chamadas telefônicas frequentemente transitavam por canais não protegidos das concessionárias públicas.'
    },
    {
      type: 'paragraph',
      text: 'No contexto de operações de alta criticidade — onde números de documentos, dados de saúde, confirmações de pagamento e informações de agendamento são trocados verbalmente —, qualquer brecha de segurança pode gerar severas sanções administrativas e danos reputacionais irreparáveis.'
    },
    {
      type: 'heading2',
      headingId: 'o-audio-como-dado-pessoal-sensivel',
      text: 'O Áudio como Dado Pessoal Sensível'
    },
    {
      type: 'paragraph',
      text: 'Sob a ótica da Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018), a voz humana constitui um dado biométrico identificador. Além disso, as transcrições das conversas contêm dados estruturados e desestruturados pertencentes ao titular. O tratamento dessas informações exige base legal explícita e medidas técnicas de salvaguarda desde a concepção (Security and Privacy by Design).'
    },
    {
      type: 'callout',
      calloutType: 'warning',
      calloutTitle: 'Princípio da Necessidade e Minimização',
      text: 'A retenção indefinida de gravações completas de chamadas contraria o princípio da minimização da LGPD. Plataformas modernas devem possibilitar a expiração programada de arquivos de mídia, mantendo unicamente resumos operacionais anonimizados e dados transacionais estritamente indispensáveis.'
    },
    {
      type: 'heading2',
      headingId: 'camadas-de-cifragem-em-transito-e-repouso',
      text: 'Camadas de Cifragem em Trânsito e Repouso'
    },
    {
      type: 'paragraph',
      text: 'Para garantir confidencialidade absoluta, o ecossistema Vozly adota uma estratégia de defesa em profundidade com três camadas essenciais:'
    },
    {
      type: 'list',
      listItems: [
        'Cifragem em Trânsito de Sinalização: SIP sobre TLS 1.3 com troca de chaves efêmeras ECDHE.',
        'Cifragem em Trânsito de Mídia: SRTP (Secure Real-Time Transport Protocol) utilizando algoritmo AES-GCM com chave simétrica de 256 bits negociada via DTLS.',
        'Cifragem em Repouso: Bancos de dados relacionais e storage de áudio protegidos com chaves mestras gerenciadas via HSM (Hardware Security Module) e rotação periódica automática.'
      ]
    },
    {
      type: 'heading2',
      headingId: 'mascaramento-de-pii-em-fluxo-continuo',
      text: 'Mascaramento de PII em Fluxo Contínuo'
    },
    {
      type: 'paragraph',
      text: 'Um dos diferenciais da orquestração neural moderna é a capacidade de identificar padrões de Informações Pessoais Identificáveis (PII) durante a etapa de transcrição fonética (STT). Quando o interlocutor pronuncia um número de CPF, cartão bancário ou código de segurança, o pipeline substitui esses caracteres por tokens opacos antes de registrar o log no banco.'
    },
    {
      type: 'code',
      codeLanguage: 'json',
      codeSnippet: `// Exemplo de Sanitização Automática de PII em Tempo Real
{
  "call_id": "call_78129a0f_2026",
  "speaker": "caller",
  "raw_intent": "informar_cpf",
  "sanitized_transcript": "Meu documento para consulta é [CPF_PROTEGIDO: ***.***.458-**]",
  "pii_detected": true,
  "confidence_score": 0.994
}`
    },
    {
      type: 'heading2',
      headingId: 'isolamento-multi-tenant-e-zero-trust',
      text: 'Isolamento Multi-tenant e Zero Trust'
    },
    {
      type: 'paragraph',
      text: 'Em ambientes de SaaS corporativo compartilhado, a separação lógica de dados entre empresas distintas deve ser inviolável. O modelo arquitetural da Vozly impõe que cada consulta ao banco de dados e cada conexão de websocket carregue o identificador imutável do tenant (`tenant_id`), validado no nível de permissão do motor de banco através de Row-Level Security (RLS).'
    },
    {
      type: 'heading2',
      headingId: 'auditoria-e-trilha-imutavel',
      text: 'Auditoria e Trilha Imutável'
    },
    {
      type: 'paragraph',
      text: 'Todas as ações administrativas — incluindo escuta de gravações, alteração de prompts de agentes, habilitação de integrações e exportação de relatórios — são registradas em uma trilha de auditoria contínua, com carimbo de tempo, IP de origem e assinatura criptográfica.'
    }
  ],
  sources: [
    {
      title: 'Lei nº 13.709, de 14 de agosto de 2018 (LGPD)',
      url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm',
      publication: 'Presidência da República do Brasil',
      date: '2018'
    },
    {
      title: 'NIST SP 800-207: Zero Trust Architecture',
      url: 'https://csrc.nist.gov/pubs/sp/800/207/final',
      publication: 'National Institute of Standards and Technology',
      date: '2020'
    }
  ]
};
