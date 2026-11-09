# Requisitos do MVP

## Objetivo
Entregar uma versão utilizável por uma empresa piloto: configurar agente, receber chamadas, responder com base em conteúdo fornecido, executar ações autorizadas e disponibilizar histórico. Simulações devem ser identificadas como simulações.

## MVP-01 — Conta e empresa
- Cadastro/autenticação.
- Criação de workspace (tenant).
- Memberships e papéis OWNER, ADMIN e OPERATOR.
- Recuperação de acesso.
- Autorização sempre no contexto do tenant.

**Aceite:** usuário não acessa dados de outro tenant alterando IDs; papéis limitam ações administrativas; o servidor associa recursos ao tenant autorizado.

## MVP-02 — Configuração guiada
- Nome do agente e da empresa.
- Idioma inicial: português brasileiro.
- Tom, estilo e instruções.
- Mensagem inicial e encerramento.
- Horários e regras de fallback.
- Salvar rascunho, testar e publicar versões identificáveis.

**Aceite:** alterações não afetam produção até nova publicação; cada chamada referencia a versão utilizada.

## MVP-03 — Conhecimento
- Cadastro/edição de FAQs e informações de serviços.
- Ativação/desativação de conteúdo.
- Associação a um agente.
- Respostas fundamentadas no conteúdo disponível.

Upload e processamento de PDF podem vir após validar conteúdo estruturado.

**Aceite:** conteúdo de um tenant nunca aparece para outro; sem informação suficiente, o agente admite a limitação e segue o fallback.

## MVP-04 — Ferramentas
Ações candidatas ao piloto:
- Registrar solicitação de atendimento/serviço.
- Consultar status, se existir fonte confiável.
- Transferir para atendente ou número configurado.

Agendamento exige integração real com agenda/disponibilidade. O agente nunca confirma reserva antes do sistema responsável.

**Aceite:** backend valida schema, tenant, permissão e regra de negócio; registra auditoria; devolve resultado real; falhas não são apresentadas como sucesso. O LLM não executa SQL nem acessa sistemas internos diretamente.

## MVP-05 — Telefonia e voz
- Receber chamadas por provedor compatível.
- Associar número, tenant e agente.
- Gerenciar sessões e estados de chamada.
- Integrar STT, LLM e TTS.
- Tratar desconexões, timeouts e falhas.
- Transferir chamadas quando configurado.

Fornecedores ainda serão selecionados e encapsulados por adaptadores.

## MVP-06 — Histórico
Listar chamadas por período/agente; exibir data, duração, status, resultado, transcrição permitida, ferramentas executadas e falhas. Gravação de áudio não é presumida: finalidade, aviso, acesso e retenção precisam de definição.

## MVP-07 — Consumo
Registrar duração e consumo por tenant, uso de fornecedores e preparar limites por plano.

## Requisitos não funcionais
- Segurança: isolamento multi-tenant no backend, autorização por papel, segredos protegidos, criptografia em trânsito, rate limiting.
- Confiabilidade: timeouts, tratamento de indisponibilidade, idempotência, persistência do estado e monitoramento.
- LGPD: finalidade/base legal, transparência, minimização, retenção, exclusão, acesso restrito e mapeamento de subprocessadores.
- UX: configuração clara, feedback de salvamento/publicação, estados vazios e mensagens úteis.

## Fluxo prioritário
1. Cliente liga.
2. Provedor encaminha a chamada.
3. Vozly identifica tenant, agente e versão publicada.
4. Agente identifica a necessidade.
5. Consulta conhecimento ou solicita ferramenta.
6. Backend valida e executa.
7. Agente comunica somente o resultado real.
8. Aplica fallback ou transfere se necessário.
9. Persiste eventos, transcrição permitida e resumo.

## Regras essenciais
Agente só opera publicado e ativo; só usa ferramentas habilitadas; sugestão do modelo não autoriza execução; nunca inventa preço, disponibilidade, status ou confirmação; transferência respeita regras configuradas; alterações são rastreáveis.

## Fora do MVP
Construtor visual, marketplace de integrações, chamadas ativas em massa, WhatsApp, cobrança recorrente completa, relatórios avançados, múltiplos idiomas e integrações profundas com ERPs/CRMs.

## Perguntas em aberto
Provedor de telefonia; combinação STT/LLM/TTS; gravação versus transcrição; sistema de registro de solicitações; fluxo de transferência; limites de duração, concorrência e consumo.