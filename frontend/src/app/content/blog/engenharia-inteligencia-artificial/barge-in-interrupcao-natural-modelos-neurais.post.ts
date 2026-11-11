import { BlogPost } from '../../../models/blog.models';

export const postBargeInInterrupcao: BlogPost = {
  slug: 'barge-in-interrupcao-natural-modelos-neurais',
  title: 'Mecanismos de Barge-in e Interrupção Natural em Modelos Conversacionais Neurais',
  subtitle:
    'A ciência de silenciar instantaneamente o sintetizador quando o usuário começa a falar, sem falsos positivos provocados por ruído ambiente ou tosse.',
  excerpt:
    'O maior teste de maturidade de um agente de voz é como ele reage ao ser interrompido no meio de uma frase. Explicamos o funcionamento do cancelamento de eco acústico (AEC), a discriminação de backchannels e o esvaziamento determinístico do buffer de reprodução.',
  categorySlug: 'engenharia-inteligencia-artificial',
  categoryName: 'Engenharia & Inteligência Artificial',
  coverImage: '/blog/covers/cover-barge-in-audio.svg',
  coverImageAlt: 'Espectrograma de áudio visualizando interrupção de fala humana sobrepondo sinal de voz sintetizada',
  coverImageCredit: 'Vozly Acoustic Engineering & DSP Laboratory',
  coverImageLicense: 'Vozly Proprietary CC-BY 4.0 Creative Commons',
  author: {
    id: 'engenharia-ia-vozly',
    name: 'Time de Pesquisa & IA',
    role: 'Engenharia de Modelos & Voz Neural Vozly',
    avatarUrl: '/brand/vozly-app-icon.png',
    bio: 'Engenheiros e pesquisadores focados em processamento digital de sinais (DSP), acústica neural e dinâmica de turnos conversacionais.'
  },
  publishedAt: '2026-10-31T15:30:00Z',
  publishedAtFormatted: '31 de Outubro de 2026',
  updatedAt: '2026-11-04T10:00:00Z',
  updatedAtFormatted: '04 de Novembro de 2026',
  readTimeMinutes: 7,
  featured: false,
  tags: ['Barge-in', 'DSP', 'AEC', 'Full Duplex', 'Voice AI', 'Processamento de Sinais'],
  metaTitle: 'Mecanismos de Barge-in e Interrupção Natural em Agentes de Voz — Vozly Insights',
  metaDescription:
    'Aprenda como funciona a engenharia de barge-in: cancelamento acústico de eco, descarte atômico de buffers e classificação semântica de interrupções em tempo real.',
  canonicalUrl: 'https://vozly.ai/blog/engenharia-inteligencia-artificial/barge-in-interrupcao-natural-modelos-neurais',
  tableOfContents: [
    { id: 'o-que-e-barge-in-e-por-que-e-dificil', title: 'O que é Barge-in e por que é difícil?', level: 2 },
    { id: 'o-papel-do-cancelamento-de-eco-acustico-aec', title: 'O papel do Cancelamento de Eco Acústico (AEC)', level: 2 },
    { id: 'diferenciacao-entre-interrupcao-e-backchannel', title: 'Diferenciação entre Interrupção e Backchannel', level: 2 },
    { id: 'esvaziamento-atomico-do-buffer-de-reproducao', title: 'Esvaziamento Atômico do Buffer de Reprodução', level: 2 },
    { id: 'resumo-da-arquitetura-duplex', title: 'Resumo da Arquitetura Duplex', level: 2 }
  ],
  contentBlocks: [
    {
      type: 'paragraph',
      text: 'Em uma chamada telefônica real, as pessoas não falam em turnos perfeitamente delimitados como walkie-talkies. Interrupções ocorrem o tempo todo: seja para corrigir um detalhe, para dizer "já sei disso", ou simplesmente para emitir um "entendi" afirmativo enquanto o outro fala.'
    },
    {
      type: 'paragraph',
      text: 'Se o agente de IA continuar falando mecanicamente por cima da fala do cliente, a experiência perde toda a humanidade. No entanto, se o agente parar de falar ao menor ruído de fundo (como uma buzina de trânsito ou um pigarro), a conversa torna-se truncada e irritante.'
    },
    {
      type: 'heading2',
      headingId: 'o-que-e-barge-in-e-por-que-e-dificil',
      text: 'O que é Barge-in e por que é difícil?'
    },
    {
      type: 'paragraph',
      text: 'Barge-in é a capacidade do sistema de detectar a fala do usuário enquanto o próprio sintetizador do sistema está ativamente emitindo som pelo canal de áudio. O desafio técnico decorre do fato de que o microfone do interlocutor pode capturar o som que o próprio alto-falante do telefone está reproduzindo (o eco acústico).'
    },
    {
      type: 'callout',
      calloutType: 'tech',
      calloutTitle: 'O Risco do Eco Feedback Loop',
      text: 'Sem um cancelamento de eco rigoroso, o som emitido pelo agente entra de volta pelo canal de uplink, o VAD detecta falsamente que o usuário está falando e o agente interrompe a si mesmo continuamente em loop infinito.'
    },
    {
      type: 'heading2',
      headingId: 'o-papel-do-cancelamento-de-eco-acustico-aec',
      text: 'O papel do Cancelamento de Eco Acústico (AEC)'
    },
    {
      type: 'paragraph',
      text: 'Para resolver isso, os nós de borda da Vozly empregam filtros adaptativos de Cancelamento Acústico de Eco (AEC3/SpeexDSP). O sinal de referência emitido pelo TTS é subtraído matematicamente do sinal de áudio recebido. O que sobra após a subtração é exclusivamente o sinal sonoro genuinamente originado no ambiente do interlocutor.'
    },
    {
      type: 'heading2',
      headingId: 'diferenciacao-entre-interrupcao-e-backchannel',
      text: 'Diferenciação entre Interrupção e Backchannel'
    },
    {
      type: 'paragraph',
      text: 'Nem todo som pronunciado pelo ouvinte deve interromper a explicação do agente. Na linguística aplicada, pequenos sons como "aham", "certo", "ok" e "uh-huh" são classificados como backchannels (sinais de escuta atenta).'
    },
    {
      type: 'list',
      listItems: [
        'Classificador Fonético Imediato: Redes neurais de inferência leve avaliam se o som é um monossílabo típico de escuta ativa.',
        'Se for backchannel, o agente continua sua fala sem pestanejar, apenas ajustando sutilmente a entonação.',
        'Se o classificador identificar início de frase declarativa ou interrogativa (ex: "espera um pouco", "não era isso", "quanto custa?"), o barge-in é imediatamente deflagrado.'
      ]
    },
    {
      type: 'heading2',
      headingId: 'esvaziamento-atomico-do-buffer-de-reproducao',
      text: 'Esvaziamento Atômico do Buffer de Reprodução'
    },
    {
      type: 'paragraph',
      text: 'Quando o evento de barge-in é confirmado, cada milissegundo de áudio restante nos buffers locais do servidor e da linha telefônica deve ser imediatamente purgado. Ao mesmo tempo, um comando de cancelamento (`AbortController`) é enviado ao LLM para interromper a computação desnecessária de tokens que jamais serão ouvidos.'
    },
    {
      type: 'blockquote',
      text: 'Um sistema conversacional de excelência é medido não apenas pela inteligência do que ele fala, mas pela sabedoria e rapidez com que ele sabe calar.'
    },
    {
      type: 'heading2',
      headingId: 'resumo-da-arquitetura-duplex',
      text: 'Resumo da Arquitetura Duplex'
    },
    {
      type: 'paragraph',
      text: 'O resultado dessa convergência entre processamento digital de sinais acústicos e inteligência artificial semântica é uma experiência conversacional verdadeiramente full duplex, onde homem e máquina compartilham o mesmo espaço acústico com civilidade e naturalidade.'
    }
  ],
  sources: [
    {
      title: 'Acoustic Echo Cancellation in Full-Duplex Voice Communications',
      publication: 'IEEE Transactions on Audio, Speech, and Language Processing',
      date: '2023'
    }
  ]
};
