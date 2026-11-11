import { BlogPost } from '../../../models/blog.models';

export const postStirShakenPadroes: BlogPost = {
  slug: 'padroes-verificacao-chamadas-stir-shaken',
  title: 'Consórcio de Telecomunicações Adota Novos Padrões de Verificação STIR/SHAKEN',
  subtitle:
    'Como a assinatura criptográfica de Caller ID protege empresas contra spoofing e eleva as taxas de atendimento legítimo.',
  excerpt:
    'O avanço da falsificação de identificador de chamadas (Caller ID Spoofing) fez os usuários deixarem de atender números desconhecidos. A expansão do protocolo STIR/SHAKEN e da iniciativa "Origem Verificada" restabelece a confiança na telefonia corporativa.',
  categorySlug: 'ultimas-noticias',
  categoryName: 'Últimas Notícias',
  coverImage: '/blog/covers/cover-stir-shaken-verified.svg',
  coverImageAlt: 'Tela de smartphone exibindo chamada verificada com selo de autenticidade verde e certificado digital STIR/SHAKEN',
  coverImageCredit: 'Vozly Telecom Security Research Initiative',
  coverImageLicense: 'Vozly Proprietary CC-BY 4.0 Creative Commons',
  author: {
    id: 'editorial-vozly',
    name: 'Redação Vozly Insights',
    role: 'Jornalismo Regulatório & Telecom',
    avatarUrl: '/brand/vozly-app-icon.png',
    bio: 'Jornalistas e analistas dedicados ao acompanhamento contínuo dos protocolos globais de segurança e verificação em redes de telecomunicações.'
  },
  publishedAt: '2026-10-18T10:15:00Z',
  publishedAtFormatted: '18 de Outubro de 2026',
  updatedAt: '2026-10-24T12:00:00Z',
  updatedAtFormatted: '24 de Outubro de 2026',
  readTimeMinutes: 6,
  featured: false,
  tags: ['STIR/SHAKEN', 'Origem Verificada', 'Caller ID', 'Segurança', 'Anti-Spoofing', 'Telecomunicações'],
  metaTitle: 'STIR/SHAKEN e Origem Verificada na Telefonia — Vozly Insights',
  metaDescription:
    'Descubra como a autenticação criptográfica de chamadas STIR/SHAKEN protege marcas corporativas contra fraudes e eleva o engajamento telefônico.',
  canonicalUrl: 'https://vozly.ai/blog/ultimas-noticias/padroes-verificacao-chamadas-stir-shaken',
  tableOfContents: [
    { id: 'o-problema-da-falsificacao-de-identificador', title: 'O Problema da Falsificação de Identificador (Spoofing)', level: 2 },
    { id: 'como-funciona-o-protocolo-stir-shaken', title: 'Como Funciona o Protocolo STIR/SHAKEN', level: 2 },
    { id: 'a-iniciativa-origem-verificada-no-brasil', title: 'A Iniciativa "Origem Verificada" no Brasil', level: 2 },
    { id: 'impacto-direto-na-reputacao-da-marca', title: 'Impacto Direto na Reputação da Marca', level: 2 }
  ],
  contentBlocks: [
    {
      type: 'paragraph',
      text: 'O ecossistema de telecomunicações enfrenta uma grave crise de confiança: quando um smartphone toca exibindo um número não salvo na agenda, a reação instintiva da maioria dos cidadãos é rejeitar ou ignorar a chamada, temendo golpes de engenharia social, fraudes bancárias ou cobranças indevidas.'
    },
    {
      type: 'heading2',
      headingId: 'o-problema-da-falsificacao-de-identificador',
      text: 'O Problema da Falsificação de Identificador (Spoofing)'
    },
    {
      type: 'paragraph',
      text: 'O protocolo SIP tradicional permitia que qualquer emissor configurasse livremente o campo `From:` dos pacotes de sinalização. Criminosos se aproveitavam dessa fragilidade para simular chamadas como se fossem originadas por agências bancárias conceituadas ou empresas públicas.'
    },
    {
      type: 'heading2',
      headingId: 'como-funciona-o-protocolo-stir-shaken',
      text: 'Como Funciona o Protocolo STIR/SHAKEN'
    },
    {
      type: 'paragraph',
      text: 'STIR (Secure Telephony Identity Revisited) e SHAKEN (Signature-based Handling of Asserted information using toKENs) formam uma suíte de padrões do IETF e ATIS que introduz criptografia assimétrica de chaves públicas na rede telefônica.'
    },
    {
      type: 'list',
      listItems: [
        'A operadora de origem emite um token SIP Identity (PASSporT) assinado com seu certificado digital credenciado.',
        'O token atesta o nível de relacionamento com o número: Atestação A (totalmente verificado e autorizado), B (cliente conhecido mas número não restrito) ou C (apenas ponto de entrada de gateway).',
        'A operadora de destino valida a assinatura matemática antes de tocar o aparelho do destinatário.',
        'Se a assinatura for legítima, a chamada é exibida com selo de verificação confiável.'
      ]
    },
    {
      type: 'callout',
      calloutType: 'info',
      calloutTitle: 'Atestação de Nível A: O Padrão de Ouro',
      text: 'Apenas empresas com registro formal de numeração e operadoras licenciadas podem emitir Atestação de Nível A, garantindo que o número exibido na tela pertence de fato àquela pessoa jurídica.'
    },
    {
      type: 'heading2',
      headingId: 'a-iniciativa-origem-verificada-no-brasil',
      text: 'A Iniciativa "Origem Verificada" no Brasil'
    },
    {
      type: 'paragraph',
      text: 'No Brasil, as principais operadoras de telecomunicações em conjunto com a Anatel lançaram a tecnologia "Origem Verificada". Quando uma empresa certificada liga para um consumidor, a tela do celular exibe o logotipo oficial da empresa, o nome fantasia reconhecido e até mesmo o motivo do contato (ex: "Confirmação de Agendamento").'
    },
    {
      type: 'heading2',
      headingId: 'impacto-direto-na-reputacao-da-marca',
      text: 'Impacto Direto na Reputação da Marca'
    },
    {
      type: 'paragraph',
      text: 'Dados preliminares de operações piloto indicam que as taxas de atendimento (answer rate) de chamadas legítimas saltam de modestos 18% para mais de 65% quando o cliente enxerga o selo e o logotipo oficial da marca. A criptografia devolve a dignidade e a utilidade ao canal telefônico.'
    }
  ],
  sources: [
    {
      title: 'RFC 8224: Authenticated Identity Management in the Session Initiation Protocol (SIP)',
      url: 'https://datatracker.ietf.org/doc/html/rfc8224',
      publication: 'IETF',
      date: '2021'
    },
    {
      title: 'Iniciativa Origem Verificada: Guia de Implementação para Empresas',
      publication: 'Consórcio Brasileiro de Telecomunicações',
      date: '2025'
    }
  ]
};
