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
