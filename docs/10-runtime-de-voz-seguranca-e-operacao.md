# Runtime de voz, segurança e operação

> Arquitetura lógica independente de fornecedor. Telefonia, STT, LLM e TTS ainda serão selecionados por avaliação técnica e comercial.

## 1. Responsabilidade do runtime

O runtime executa uma versão publicada do agente durante uma chamada. Ele coordena o provedor de telefonia, streaming de áudio, reconhecimento de fala, orquestração conversacional, síntese de voz e execução autorizada de ferramentas.

O runtime não é o painel administrativo. A API administrativa configura agentes e conexões; o runtime consome snapshots publicados e executa operações em tempo de chamada.

## 2. Componentes lógicos

1. **Telephony Adapter:** recebe eventos de chamada, atende/recusa, gerencia áudio e solicita transferência/encerramento conforme capacidades do provedor.
2. **Call Session Manager:** cria contexto da chamada, correlaciona eventos e controla estado/timeout/cancelamento.
3. **Agent Configuration Resolver:** resolve tenant, número de destino e versão publicada; não usa rascunhos.
4. **Audio Streaming Gateway:** encaminha áudio de entrada e saída com backpressure e controle de buffers.
5. **Speech-to-Text Adapter:** converte áudio em texto, preferencialmente com suporte a streaming e indicação de confiança/finalidade.
6. **Conversation Orchestrator:** mantém turno, contexto, políticas e chama LLM por interface de provedor.
7. **Tool Execution Service:** valida e executa ferramentas permitidas; é a única fronteira entre o modelo e operações externas.
8. **Text-to-Speech Adapter:** converte resposta textual em áudio e suporta cancelamento/interrupção quando possível.
9. **Event & Audit Publisher:** publica eventos operacionais e registra trilha minimizada e correlacionada.

Cada componente é uma fronteira lógica do monólito modular inicialmente; não implica serviço separado.

## 3. Ciclo de vida de uma chamada

Estados propostos:

`RECEIVED → RESOLVING → RINGING/ANSWERING → ACTIVE → TRANSFERRING → COMPLETED`

Estados terminais alternativos: `FAILED`, `REJECTED`, `CANCELLED`, `TIMED_OUT`.

1. Provedor envia evento de chamada recebida.
2. Adaptador valida assinatura/autenticidade, deduplica evento e normaliza payload.
3. Runtime resolve número, tenant, agente ativo e versão publicada.
4. Verifica se o tenant, número e agente podem receber chamadas; aplica horário e política de fallback configurados.
5. Atende a chamada e inicializa sessão/correlação.
6. Reproduz saudação inicial, se configurada.
7. Recebe áudio e transmite ao STT.
8. Orquestrador recebe transcrição parcial/final, atualiza contexto e decide resposta ou solicitação de ferramenta.
9. Se houver ferramenta, o backend valida e executa; o modelo recebe apenas resultado sanitizado.
10. TTS sintetiza a resposta; áudio é enviado ao provedor.
11. Repete o ciclo até transferência, encerramento ou falha.
12. Finaliza recursos, persiste estado final, emite métricas/eventos e aplica política de retenção.

Cada chamada registra `tenant_id`, `agent_id`, `agent_version_id`, número, provedor e timestamps para permitir auditoria e reprodução técnica sem reconstruir configuração a partir do estado atual.

## 4. Turnos, streaming e interrupção

- Distinguir transcrição parcial de final; não executar ferramenta com texto parcial.
- Associar cada turno a um identificador e sequência monotônica.
- Não iniciar múltiplas respostas concorrentes para o mesmo turno.
- Barge-in/interrupção deve cancelar TTS em andamento e invalidar chunks antigos antes de iniciar nova resposta.
- Aplicar backpressure e limites de buffer; áudio atrasado não deve crescer indefinidamente em memória.
- Definir política de silêncio, detecção de fim de fala e tempo máximo de turno.
- Se o provedor não suportar interrupção real, documentar a limitação e usar comportamento degradado explícito.
- O contexto enviado ao LLM deve ser limitado por janela/tokens e política de minimização; não carregar histórico completo sem necessidade.

## 5. Execução de ferramentas

O LLM pode solicitar apenas ferramentas presentes no snapshot publicado do agente. Ele não possui acesso direto a banco, credenciais, rede ou shell.

Fluxo obrigatório:

1. Receber chamada de ferramenta estruturada.
2. Resolver binding pelo agente e versão da chamada.
3. Validar tenant e estado do binding.
4. Validar autorização, schema, tipos, obrigatoriedade, limites e regras.
5. Aplicar política de confirmação quando ação tiver efeito externo ou risco relevante.
6. Executar por adaptador controlado, com timeout e idempotência quando suportada.
7. Sanitizar e limitar resposta.
8. Registrar execução e resultado sem segredos.
9. Retornar ao orquestrador resultado estruturado ou erro controlado.

A resposta falada só pode afirmar sucesso depois da confirmação real do serviço executor. Em timeout ambíguo, consultar estado/idempotência antes de repetir operação; nunca afirmar que uma ação ocorreu sem confirmação.

## 6. Transferência e fallback

Transferência:
- verificar se destino está configurado e permitido;
- informar a pessoa antes de transferir quando aplicável;
- iniciar transferência pelo adaptador de telefonia;
- confirmar sucesso/falha pelo evento do provedor;
- registrar destino lógico, resultado e motivo sem expor dados desnecessários;
- se falhar, seguir fallback publicado (retomar conversa, oferecer callback ou encerrar com mensagem apropriada).

Fallbacks:
- provedor STT/TTS/LLM indisponível;
- baixa confiança ou fala não compreendida;
- ferramenta rejeitada, timeout ou resposta inválida;
- agente/número desativado;
- limite de duração, orçamento ou concorrência;
- falha de rede ou desconexão do usuário.

Fallback nunca deve contornar autorização, executar ação alternativa não configurada ou inventar confirmação.

## 7. Timeouts, retries e idempotência

- Definir timeout independente para telefonia, STT, LLM, TTS e cada integração.
- Retry apenas em falhas transitórias e operações idempotentes; usar limite, backoff e jitter.
- Não repetir automaticamente operações externas não idempotentes sem chave ou consulta de estado.
- Circuit breaker pode impedir cascata de falhas; estado e limiares devem ser observáveis.
- Cancelar tarefas associadas quando chamada terminar, respeitando operações externas já aceitas.
- Definir deadline total por turno e por chamada; valores finais dependem de testes com provedores e metas de latência.

## 8. Segurança e fronteiras de confiança

- Eventos de telefonia e webhooks: verificar assinatura, timestamp, origem e proteção contra replay.
- Credenciais de integrações: armazenar em secret manager/KMS ou envelope encryption; aplicação persiste apenas referência/ciphertext protegido e metadados mínimos.
- Segredos são revelados apenas ao adaptador autorizado no instante de execução e nunca ao LLM, frontend, logs, traces, snapshots ou mensagens de erro.
- REST connector: allowlist de hosts/métodos/paths, defesa SSRF, validação DNS e redirects, TLS, limites de payload e resposta.
- Tenant context deve ser explícito em cada comando/evento e validado em cada fronteira.
- Isolamento entre tenants deve ter testes negativos automatizados.
- Rate limits por tenant, número, provedor e operação.
- Limites de concorrência e custo para evitar abuso e negação de serviço.
- Privilégio mínimo para credenciais e contas de infraestrutura.
- Ferramentas com efeito externo devem ter descrição, schema, política e, quando necessário, confirmação humana.

## 9. Privacidade e LGPD — requisitos a validar

A Vozly poderá processar voz, número telefônico, transcrição e informações fornecidas durante chamadas. A definição de papéis de controlador/operador, bases legais, avisos, consentimento quando aplicável e obrigações contratuais precisa de avaliação jurídica.

Requisitos de engenharia:
- documentar finalidade e categorias de dados coletados;
- coletar apenas dados necessários à finalidade;
- definir se gravação de áudio será habilitada, opcional ou indisponível no MVP;
- informar o cliente sobre responsabilidades de comunicação aos titulares;
- definir retenção separada para áudio, transcrição, metadados, auditoria e métricas;
- suportar exclusão/anonimização quando juridicamente aplicável sem destruir registros que devam ser preservados;
- controlar acesso a transcrições e gravações, registrar acesso e minimizar exposição no painel;
- criptografar dados em trânsito e em repouso;
- evitar conteúdo integral de conversas em logs de aplicação;
- definir processo de incidente, exportação e atendimento a solicitações de titulares.

Nenhum prazo de retenção ou fundamento legal é fixado aqui. Esses pontos são decisões pendentes de produto, contratos e assessoria jurídica.

## 10. Auditoria e observabilidade

### Logs
Logs estruturados com `timestamp`, `level`, `service/module`, `tenant_id` (quando seguro), `call_id`, `correlation_id`, `event` e `error_code`. Não registrar tokens, headers de autenticação, credenciais, áudio bruto ou transcrição completa por padrão.

### Métricas
- chamadas recebidas, atendidas, concluídas, falhas e transferências;
- tempo até atender;
- latência STT, LLM, TTS e total por turno;
- tempo de execução e taxa de falha de ferramentas;
- timeouts, retries e circuit breaker;
- chamadas simultâneas e duração;
- custo/uso estimado por provedor e tenant, quando disponível.

### Tracing
Propagar correlation/trace ID entre eventos, runtime, LLM e adaptadores. Atributos devem ser minimizados; não incluir conteúdo pessoal como span attribute.

### Alertas e saúde
- disponibilidade dos adaptadores;
- aumento de falhas/timeouts;
- degradação de latência;
- fila ou sessão presa;
- consumo/limites anormais;
- falhas de persistência e eventos não processados.

Health checks devem distinguir liveness de readiness e não expor detalhes internos publicamente.

## 11. Metas de qualidade a validar

Ainda não há SLO numérico aprovado. Durante spikes e testes com provedores, medir:
- latência de primeira resposta falada;
- latência entre fim da fala do usuário e início da resposta;
- taxa de interrupção bem-sucedida;
- qualidade de reconhecimento em português brasileiro, ruído e sotaques;
- disponibilidade e estabilidade de chamadas;
- custo por minuto e por chamada;
- taxa de transferência/fallback e falha de ferramentas.

As metas só devem ser definidas após baseline com tráfego e fornecedores representativos.

## 12. Decisões pendentes

- Provedor de telefonia/SIP e suporte a streaming/transferência.
- STT/TTS/LLM e estratégia de fallback entre fornecedores.
- Transporte do áudio e protocolo de sessão.
- Política de gravação e retenção.
- Valores de timeout, retry, concorrência e SLO.
- Estratégia de fila/eventos e persistência de eventos.
- Requisitos de confirmação humana para categorias de ferramenta.

## 13. Critério para implementação

Antes do primeiro fluxo de voz real, criar testes de contrato dos adaptadores, simulação de eventos duplicados/fora de ordem, interrupção, timeouts, transferência com falha, isolamento multi-tenant e execução de ferramentas sem credenciais no contexto do LLM. Fazer spike comparativo dos provedores antes de fixar dependências.

## 14. Modelo de interação de voz

A implementação deve separar três responsabilidades que cooperam durante a chamada:

1. **Telefonia:** recebe a chamada, mantém o canal de mídia e devolve o áudio ao interlocutor.
2. **Processamento de voz:** transforma áudio em representação compreensível pelo modelo e transforma a resposta em áudio.
3. **Orquestração conversacional:** interpreta intenção, mantém contexto, aplica políticas e solicita ferramentas de negócio.

Essas responsabilidades podem ser fornecidas por um único provedor de voz em tempo real ou por adaptadores independentes. A escolha será feita por spike comparativo; não deve ser presumida como decisão fechada.

### 14.1 Estratégias de processamento

**Opção A — speech-to-speech em tempo real**

Um modelo multimodal recebe áudio e produz áudio, podendo emitir chamadas estruturadas de ferramentas. Reduz o número de etapas explícitas no caminho crítico e pode oferecer melhor fluidez e interrupção. Ainda assim, chamadas de ferramentas e operações de negócio devem passar pelo backend Vozly.

**Opção B — pipeline modular STT + LLM + TTS**

O áudio é transcrito por STT, o texto/contexto é processado pelo LLM e a resposta é sintetizada pelo TTS. Dá controle independente sobre transcrição, modelo e voz, facilita auditoria textual e troca de fornecedores, mas pode aumentar a latência e a complexidade de coordenação.

A arquitetura interna deve expor interfaces de adaptador para permitir comparar ou substituir as estratégias sem alterar regras de negócio. O modelo de voz nunca substitui autorização, validação de domínio ou execução transacional no backend.

### 14.2 Transporte de mídia

A integração com telefonia deve usar o mecanismo de mídia suportado pelo provedor (por exemplo, SIP/RTP, WebSocket de mídia ou streaming equivalente). REST/Webhooks são adequados para sinalização, eventos e comandos de controle, mas não devem transportar áudio como uma sequência de requisições síncronas longas.

O protocolo final depende do provedor selecionado e será validado em um spike que cubra:
- áudio bidirecional e streaming;
- codecs, sample rate e conversão necessários;
- eventos de início/fim de fala;
- cancelamento de áudio e barge-in;
- transferência e encerramento;
- reconexão, perda de pacotes e encerramento inesperado.

## 15. Roteamento telefônico e resolução do tenant

A empresa poderá disponibilizar seu número por redirecionamento/encaminhamento para um número Vozly, contratação de número provisionado pela Vozly ou integração SIP com uma central existente. São alternativas de produto e operação, ainda não uma decisão de fornecedor.

Independentemente do modelo:
1. O provedor envia evento autenticado com número chamado e identificadores da chamada.
2. O adaptador normaliza o evento e deduplica notificações repetidas.
3. O runtime resolve o número de destino por um vínculo previamente verificado com um tenant e uma configuração telefônica ativa.
4. Resolve agente e versão publicada associados àquele número.
5. Verifica status, limites, horário e política de fallback.
6. Só então atende e inicia a sessão.

O número chamado é uma chave de roteamento, não prova suficiente de autorização por si só. Não aceitar tenant_id ou agent_id arbitrários vindos de payload não confiável. Números precisam ter processo de verificação, associação, desassociação e auditoria.

Se o número não estiver associado, o agente estiver pausado ou o tenant não puder receber chamadas, executar a política de fallback do provedor/tenant sem expor detalhes internos.

## 16. Configuração de saudação e comportamento por empresa

A saudação inicial é configuração do agente/workspace publicada pelo cliente, não texto fixo no código.

O painel deverá permitir configurar, dentro dos limites do produto:
- texto de saudação;
- nome de exibição da empresa e identificação da assistente;
- idioma/variante e voz disponíveis;
- horário e mensagem fora do expediente;
- objetivos e escopo de atendimento;
- informações que podem ser solicitadas;
- regras para identificação e confirmação do cliente;
- condições e destinos de transferência;
- mensagens de fallback e encerramento.

A publicação gera snapshot versionado. Uma chamada em andamento continua usando a versão resolvida no início, mesmo que o cliente publique uma alteração durante a ligação. Segredos e credenciais não fazem parte do snapshot; apenas referências a conexões autorizadas.

A saudação deve ser reproduzida uma vez por chamada, salvo retomada explicitamente definida. Se a configuração estiver inválida ou incompleta, o runtime não deve inventar uma saudação; deve bloquear a publicação ou aplicar fallback seguro previamente configurado.

## 17. Orquestração de turnos e experiência de baixa latência

Um turno representa a fala do cliente e a resposta correspondente. O runtime deve trabalhar com eventos incrementais e concorrência controlada, sem esperar o término da ligação ou acumular toda a conversa antes de responder.

Fluxo de um turno:
1. Capturar frames de áudio e encaminhá-los continuamente ao adaptador de voz.
2. Detectar atividade de fala e provável fim de turno.
3. Receber transcrição parcial ou estado incremental para antecipar preparação de contexto, sem executar ações irreversíveis.
4. Confirmar o turno final conforme a semântica do provedor.
5. Classificar intenção e decidir entre resposta direta, pergunta de esclarecimento ou ferramenta.
6. Se necessário, emitir mensagem curta de espera/transição e executar consulta assíncrona.
7. Receber resultado normalizado do backend.
8. Gerar resposta textual/áudio em streaming.
9. Transmitir chunks em ordem e encerrar o turno.
10. Permanecer apto a detectar interrupção do cliente.

Transcrição parcial pode apoiar preparação de contexto, mas não deve disparar agendamento, cancelamento ou outra ação com efeito externo. Para operações mutáveis, os dados necessários devem estar completos e a confirmação exigida deve ter sido obtida.

### 17.1 Barge-in e respostas interrompidas

Quando o cliente começar a falar durante a resposta:
- detectar a nova atividade de fala;
- cancelar geração e reprodução de áudio pendentes;
- invalidar chunks antigos com identificador de geração/turno;
- preservar apenas o estado conversacional válido;
- processar a nova fala sem deixar uma resposta antiga ser reproduzida depois.

A implementação deve impedir duas respostas audíveis simultâneas para a mesma chamada. Se o fornecedor não oferecer cancelamento confiável, documentar e testar a degradação.

### 17.2 Mensagens de espera

Consultas externas podem levar mais tempo que uma resposta simples. O agente pode usar frases de transição configuradas ou geradas sob política, por exemplo, informando que está verificando o cadastro ou a agenda. Essas mensagens:
- não podem afirmar que uma ação já foi concluída;
- não devem ser repetidas em excesso;
- devem ser canceladas se o cliente interromper;
- não substituem timeout nem tratamento de falha.

## 18. Integrações de ERP/CRM e ferramentas de atendimento

O modelo não integra diretamente com ERP, banco de dados ou API externa. Ele solicita ferramentas do catálogo Vozly; o backend valida o contexto e delega a execução ao conector autorizado do tenant.

### 18.1 Contrato de ferramentas de negócio

O conjunto inicial a avaliar inclui:
- `customer.find`: localizar cadastro por telefone, documento ou identificador permitido;
- `customer.get_profile`: consultar dados necessários para confirmar identidade/endereço;
- `customer.get_history`: consultar histórico de atendimentos;
- `service_order.get`: consultar ordem de serviço;
- `schedule.get_availability`: consultar disponibilidade;
- `schedule.create_appointment`: criar agendamento;
- `schedule.reschedule_appointment`: reagendar;
- `schedule.cancel_appointment`: cancelar, sujeito à política de confirmação.

Essas chaves são propostas conceituais, não endpoints ou implementações já existentes. O catálogo oficial, schemas e políticas serão definidos no documento de ferramentas e integrações. Só ferramentas habilitadas e presentes na versão publicada podem ser solicitadas pelo modelo.

### 18.2 Arquitetura de conectores

A Vozly deve manter uma camada de conectores com contratos internos normalizados. Um conector específico traduz o contrato Vozly para a API/protocolo do ERP e converte a resposta externa para um resultado normalizado.

Modelos de integração possíveis, conforme suporte e avaliação:
- API REST ou SOAP oficial do ERP;
- webhooks para eventos suportados;
- conector específico mantido pela Vozly;
- integração autorizada por banco de dados ou mecanismo de importação/exportação, quando não houver API adequada e a segurança/operação permitirem.

Um conector REST genérico não significa compatibilidade universal. Cada ERP exige validação de autenticação, limites, operações disponíveis, semântica de dados, sandbox e comportamento de falha. Não prometer integração antes de testar o sistema e obter autorização do cliente.

### 18.3 Isolamento e credenciais

Cada conexão pertence a um tenant e possui referência protegida a credenciais. O runtime resolve a conexão a partir do binding publicado e do contexto confiável da chamada. O LLM não escolhe conexão, host, credencial, query SQL ou URL arbitrária.

Toda chamada de ferramenta valida:
- tenant, agente, versão e binding;
- schema e limites dos argumentos;
- permissões e política da operação;
- timeout, rate limit e idempotência;
- sanitização de dados retornados.

As respostas externas devem ser reduzidas aos campos necessários para a conversa. Não devolver ao modelo payloads integrais com dados pessoais desnecessários, segredos ou detalhes internos.

## 19. Fluxo de identificação e agendamento

Fluxo de referência para uma solicitação de atendimento técnico:

1. O agente identifica a intenção de agendamento.
2. Solicita os dados mínimos necessários para localizar o cliente.
3. Tenta localizar o cadastro usando o número de origem quando disponível e permitido.
4. Se houver um único cadastro confiável, apresenta dados não excessivos para confirmação (por exemplo, nome e endereço parcialmente mascarado).
5. Se houver múltiplos resultados, dados insuficientes ou baixa confiança, solicita outro identificador e não escolhe um cadastro por suposição.
6. Se não encontrar cadastro, segue o fluxo publicado para novo cliente ou encaminhamento humano.
7. Coleta/valida equipamento, problema relatado, endereço, disponibilidade e demais campos exigidos pela operação.
8. Consulta disponibilidade na fonte de agenda definida para aquele tenant.
9. Apresenta opções realmente retornadas pela fonte de agenda.
10. Repete os dados principais e solicita confirmação explícita do cliente.
11. Backend valida novamente disponibilidade, regras, tenant e idempotência.
12. Executa criação do agendamento no sistema que é fonte de verdade.
13. Só após confirmação positiva do executor, informa que o atendimento foi agendado.
14. Persiste resumo e referência da operação, respeitando retenção e privacidade.

### 19.1 Fonte oficial da agenda

A configuração do tenant deve declarar qual sistema é a fonte de verdade:
- **ERP externo:** consultar e criar/reagendar/cancelar no ERP. A Vozly não confirma com base apenas em cache local.
- **Agenda Vozly:** a Vozly mantém disponibilidade e agendamentos como sistema oficial.
- **Modelo sincronizado:** só pode ser habilitado quando houver contrato claro de autoridade, reconciliação, prevenção de conflito e tratamento de indisponibilidade. Não permitir duas fontes independentes de verdade para o mesmo recurso/horário.

Para evitar duplicidade, operações de escrita devem usar chave de idempotência quando suportada. Em timeout ambíguo, consultar o estado no sistema oficial antes de repetir a criação.

## 20. Metas iniciais de latência e estratégia de medição

Não existe SLO aprovado. Para orientar os primeiros spikes, usar hipóteses de experiência a validar, não garantias comerciais:

| Cenário | Hipótese inicial para teste |
|---|---|
| Resposta simples, sem ferramenta | início da resposta falada em aproximadamente 1–1,5 s após fim do turno |
| Consulta externa simples | resposta inicial em aproximadamente 1–3 s, dependendo do ERP |
| Operação demorada | mensagem de transição rápida; conclusão após resultado confirmado |

Medir separadamente:
- fim de fala detectado até decisão de turno;
- tempo de inferência/primeiro token ou primeiro áudio do modelo;
- tempo de execução de ferramenta;
- tempo até primeiro byte/chunk de áudio;
- latência total percebida pelo cliente;
- percentis p50, p95 e p99, por provedor, modelo, região e tipo de turno.

As metas devem ser revisadas com testes em português brasileiro, ruído, diferentes redes, chamadas simultâneas e ERPs reais. Não otimizar somente média; observar p95/p99 e taxa de falhas. O runtime deve propagar deadlines e cancelar trabalho que deixou de ser útil quando a chamada termina.

## 21. Sequência recomendada de implementação

A ordem de desenvolvimento recomendada é:

1. **Onboarding e configuração do agente:** saudação, horário, comportamento, dados da empresa, fallback e publicação/versionamento.
2. **Motor conversacional por texto:** sessão, histórico, contexto, classificação de intenção, orquestração e ferramentas simuladas; validar regras sem custo/complexidade telefônica.
3. **Catálogo e execução de ferramentas:** contratos, validação, autorização, auditoria, idempotência e primeiro conector de teste.
4. **Spike de telefonia e voz:** comparar redirecionamento/número/SIP e speech-to-speech versus STT+LLM+TTS; medir qualidade, interrupção, latência e custo.
5. **Runtime de chamada:** receber ligação, resolver tenant/agente, saudação, streaming bidirecional, turnos, barge-in e fallback.
6. **Primeiro fluxo vertical de negócio:** localizar cliente, consultar agenda e criar um agendamento em sandbox ou ambiente de teste, com confirmação real.
7. **Operação e monitoramento:** histórico, métricas por etapa, custos, alertas, limites, transferência humana e política de retenção.

A arquitetura inicial permanece como monólito modular Spring Boot, com adaptadores isolados. Não criar microsserviços apenas por antecipação; extrair componentes somente quando escala, isolamento operacional ou requisitos de latência justificarem.

## 22. Exemplo ponta a ponta

**Cenário:** cliente liga para o número publicado pela assistência e pede uma visita técnica.

1. O provedor entrega evento de chamada e canal de mídia ao Telephony Adapter.
2. Runtime valida o evento, resolve o número para o tenant e carrega snapshot publicado do agente.
3. Call Session Manager cria `call_id`, `correlation_id` e estado temporário.
4. Agente reproduz a saudação configurada pela empresa.
5. Cliente fala; áudio é processado continuamente pelo adaptador de voz.
6. Orquestrador identifica intenção de agendamento e solicita os dados faltantes.
7. Runtime chama `customer.find` por meio do Tool Execution Service.
8. Backend valida tenant e binding, executa o conector e devolve resultado sanitizado.
9. Agente confirma os dados com o cliente e coleta informações do equipamento.
10. Runtime solicita `schedule.get_availability`; backend consulta a fonte oficial da agenda.
11. Agente oferece somente horários retornados e pede confirmação.
12. Runtime solicita `schedule.create_appointment`; backend valida novamente e executa com idempotência.
13. Só com resultado confirmado o agente comunica o agendamento.
14. Ao encerrar, runtime fecha streams, registra resultado e métricas e aplica as políticas de retenção.

Em qualquer etapa, falha ou ambiguidade deve gerar resposta honesta e fallback configurado, nunca confirmação inventada.

## 23. Critérios de aceite adicionais

Além dos critérios já definidos, validar:
- número telefônico resolve exclusivamente para tenant/agente previamente associados;
- chamada usa snapshot publicado e não alterações em rascunho;
- saudação configurada é reproduzida uma vez;
- áudio flui em ambos os sentidos sem acumular buffer indefinidamente;
- interrupção cancela áudio antigo e não permite fala concorrente;
- transcrição parcial nunca dispara ação irreversível;
- ferramentas só executam com binding, tenant e versão válidos;
- cliente não localizado ou ambíguo não é associado por suposição;
- horários oferecidos vêm da fonte oficial da agenda;
- criação de agendamento não é repetida cegamente em timeout ambíguo;
- resposta falada confirma sucesso somente após resultado positivo do executor;
- métricas permitem identificar qual etapa causou latência ou falha.
