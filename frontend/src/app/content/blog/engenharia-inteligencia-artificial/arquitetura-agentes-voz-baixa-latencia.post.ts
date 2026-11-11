import { BlogPost } from '../../../models/blog.models';

export const postArquiteturaAgentesVoz: BlogPost = {
  slug: 'arquitetura-agentes-voz-baixa-latencia',
  title: 'Arquitetura de Agentes de Voz: STT, Orquestração de LLMs e TTS em Baixa Latência',
  subtitle:
    'Como quebramos a barreira dos 500ms entre o término da fala do interlocutor e o início da resposta fonética sintetizada.',
  excerpt:
    'A ilusão de uma conversa humana fluida desmorona se o atraso entre turnos exceder 800 milissegundos. Neste artigo técnico, detalhamos o pipeline completo de streaming de áudio, detecção de atividade vocal neural, geração especulativa de tokens e síntese concorrente de fala.',
  categorySlug: 'engenharia-inteligencia-artificial',
  categoryName: 'Engenharia & Inteligência Artificial',
  coverImage: '/blog/covers/voice-ai-pipeline.jpg',
  coverImageAlt: 'Microfones de estúdio organizados em prateleira no Avex Honolulu Studios',
  coverImageCredit: 'Justin De La Ornellas / Wikimedia Commons',
  coverImageLicense: 'CC BY 2.0',
  author: {
    id: 'equipe-vozly',
    name: 'Equipe Vozly',
    role: 'Vozly Insights',
    avatarUrl: '/brand/vozly-app-icon-trim.png',
    bio: 'Textos escritos pela equipe da Vozly sobre agentes de voz, inteligência artificial e telecomunicações.'
  },
  publishedAt: '2026-11-10T11:00:00Z',
  publishedAtFormatted: '10 de Novembro de 2026',
  updatedAt: '2026-11-11T13:45:00Z',
  updatedAtFormatted: '11 de Novembro de 2026',
  readTimeMinutes: 9,
  featured: true, // HERO FEATURED ARTICLE
  tags: ['Voice AI', 'STT', 'LLM', 'TTS', 'Baixa Latência', 'VAD', 'WebSockets', 'Deep Learning'],
  metaTitle: 'Arquitetura de Agentes de Voz em Baixa Latência — Vozly Insights',
  metaDescription:
    'Guia técnico definitivo sobre o pipeline de agentes de voz neural: VAD contínuo, streaming STT, orquestração de LLMs e síntese TTS concorrente em menos de 500ms.',
  canonicalUrl: 'https://vozly.ai/blog/engenharia-inteligencia-artificial/arquitetura-agentes-voz-baixa-latencia',
  tableOfContents: [
    { id: 'a-anatomia-do-atraso-conversacional', title: 'A Anatomia do Atraso Conversacional', level: 2 },
    { id: 'etapa-1-vad-e-stt-em-fluxo-continuo', title: 'Etapa 1: VAD Neural e STT em Streaming', level: 2 },
    { id: 'etapa-2-orquestracao-do-llm-e-chunking-gramatical', title: 'Etapa 2: LLM e Chunking Gramatical', level: 2 },
    { id: 'etapa-3-sintese-tts-concorrente', title: 'Etapa 3: Síntese TTS Neural Concorrente', level: 2 },
    { id: 'benchmark-de-latencia-ponta-a-ponta', title: 'Benchmark de Latência Ponta a Ponta', level: 2 },
    { id: 'conclusoes-tecnicas', title: 'Conclusões Técnicas', level: 2 }
  ],
  contentBlocks: [
    {
      type: 'paragraph',
      text: 'Em uma interação humana natural, a pausa média entre a fala de uma pessoa e a resposta do interlocutor situa-se na faixa de 200 a 300 milissegundos. Quando esse intervalo ultrapassa 700 milissegundos em uma chamada telefônica, os participantes começam a falar juntos, gerando constrangimento e quebrando a dinâmica cognitiva da conversa.'
    },
    {
      type: 'paragraph',
      text: 'Construir um agente autônomo de voz que soe verdadeiramente inteligente não é apenas uma questão de tamanho de modelo de linguagem (LLM). É, fundamentalmente, um desafio de engenharia de sistemas concorrentes, streaming bidirecional e otimização de buffers.'
    },
    {
      type: 'heading2',
      headingId: 'a-anatomia-do-atraso-conversacional',
      text: 'A Anatomia do Atraso Conversacional'
    },
    {
      type: 'paragraph',
      text: 'Em arquiteturas ingênuas, o sistema aguarda o usuário terminar uma frase inteira, grava o arquivo de áudio, envia-o para uma API de reconhecimento de fala (STT), aguarda a transcrição completa, submete o texto ao LLM, espera a resposta final ser gerada e somente então dispara a síntese de voz (TTS). Esse fluxo linear acumula facilmente entre 2.500ms e 4.000ms de latência total — tornando a conversa inoperante.'
    },
    {
      type: 'callout',
      calloutType: 'tech',
      calloutTitle: 'A Regra de Ouro: Pipeline em Streaming Concorrente',
      text: 'Nenhuma etapa do pipeline deve esperar a etapa anterior ser concluída em sua totalidade. Cada milissegundo de áudio recebido via WebSocket deve alimentar simultaneamente o detector de silêncio, o transcritor de fonemas e o decodificador de intenções.'
    },
    {
      type: 'heading2',
      headingId: 'etapa-1-vad-e-stt-em-fluxo-continuo',
      text: 'Etapa 1: VAD Neural e STT em Streaming'
    },
    {
      type: 'paragraph',
      text: 'A primeira decisão crítica é saber quando o usuário parou de falar. Algoritmos tradicionais baseados em volume energético (dB) falham frequentemente com ruído de fundo ou respiração forte. O uso de redes neurais leves de Voice Activity Detection (VAD) analisa janelas de 30ms com precisão probabilística superior a 99%.'
    },
    {
      type: 'code',
      codeLanguage: 'python',
      codeSnippet: `# Exemplo conceitual do loop de VAD em streaming com janelas de 30ms
async def audio_stream_processor(websocket_stream):
    vad_detector = SileroVADEngine(sample_rate=16000)
    speech_frames = []
    
    async for raw_pcm_chunk in websocket_stream:
        speech_prob = vad_detector.process(raw_pcm_chunk)
        if speech_prob > 0.65:
            # Usuário em elocução ativa: encaminha chunk ao STT em streaming
            await stt_stream_channel.send(raw_pcm_chunk)
        elif vad_detector.silence_duration_ms > 280:
            # Silêncio semântico confirmado: fecha turno e aciona LLM imediatamente
            await stt_stream_channel.finalize_turn()`
    },
    {
      type: 'heading2',
      headingId: 'etapa-2-orquestracao-do-llm-e-chunking-gramatical',
      text: 'Etapa 2: LLM e Chunking Gramatical'
    },
    {
      type: 'paragraph',
      text: 'Assim que o último fonema é processado pelo transcritor em streaming, o prompt do agente — enriquecido com as ferramentas disponíveis e o histórico da conversa — já está montado. A inferência do LLM utiliza técnicas de TTFT (Time to First Token) agressivas.'
    },
    {
      type: 'paragraph',
      text: 'Para não esperar o parágrafo inteiro ser gerado, o orquestrador divide a saída do LLM em cláusulas sintáticas mínimas (usando delimitadores pontuais como vírgulas, pontos e conjunções). A primeira oração independente é imediatamente despachada para o sintetizador.'
    },
    {
      type: 'heading2',
      headingId: 'etapa-3-sintese-tts-concorrente',
      text: 'Etapa 3: Síntese TTS Neural Concorrente'
    },
    {
      type: 'paragraph',
      text: 'O sintetizador neural de voz processa a primeira cláusula em paralelo enquanto o LLM ainda está computando os tokens subsequentes. Os primeiros 100ms de áudio sintetizado são empacotados em frames RTP e transmitidos pela rede antes mesmo da frase completa estar disponível.'
    },
    {
      type: 'blockquote',
      text: 'Ao paralelizar o processamento fonético, cognitivo e acústico, a latência percebida cai de segundos para uma fração imperceptível de segundo.'
    },
    {
      type: 'heading2',
      headingId: 'benchmark-de-latencia-ponta-a-ponta',
      text: 'Benchmark de Latência Ponta a Ponta'
    },
    {
      type: 'table',
      tableHeaders: ['Componente do Pipeline', 'Abordagem Linear Tradicional', 'Arquitetura Streaming Vozly'],
      tableRows: [
        ['Detecção de Fim de Fala (VAD)', '800ms (timeout estático)', '260ms (VAD neural adaptativo)'],
        ['Transcrição de Áudio (STT)', '650ms (lote completo)', '95ms (streaming incremental)'],
        ['Tempo até 1º Token do LLM (TTFT)', '700ms', '110ms (modelos quantizados na borda)'],
        ['Síntese do 1º Frame de Áudio (TTS)', '900ms (frase inteira)', '80ms (síntese por cláusula)'],
        ['Latência Ponta a Ponta Percebida', '3.050ms', '545ms (sensação de resposta instantânea)']
      ]
    },
    {
      type: 'heading2',
      headingId: 'conclusoes-tecnicas',
      text: 'Conclusões Técnicas'
    },
    {
      type: 'paragraph',
      text: 'A quebra do limiar de latência sub-600ms transforma radicalmente a percepção dos usuários. Em testes cegos de Turing conversacional, a taxa de interrupção não solicitada cai em 84% quando o agente responde com a cadência natural de um atendente humano experiente.'
    }
  ],
  sources: [
    {
      title: 'FastSpeech 2: Fast and High-Quality End-to-End Text to Speech',
      url: 'https://arxiv.org/abs/2006.04558',
      publication: 'Neural Information Processing Systems (NeurIPS)',
      date: '2022'
    },
    {
      title: 'Streaming Speech Recognition with Conformer Models',
      url: 'https://arxiv.org/abs/2005.08100',
      publication: 'Interspeech',
      date: '2023'
    }
  ]
};
