# Requisitos do MVP

## Objetivo

Entregar uma primeira versão em que uma empresa consiga criar e configurar seu próprio ambiente, montar um agente de voz, testar, publicar e acompanhar seu funcionamento sem depender da equipe Vozly para parametrizar sua operação.

O MVP não será condicionado a um segmento empresarial específico. Os recursos iniciais devem ser descritos por capacidades e contratos configuráveis, sem pressupor processos de um setor.

## MVP-01 — Conta, workspace e usuários

- Cadastro e autenticação.
- Criação do workspace/tenant pelo cliente durante o onboarding.
- Convite e gestão de usuários.
- Papéis iniciais OWNER, ADMIN e OPERATOR.
- Recuperação de acesso.
- Autorização sempre no contexto do tenant.
- Fluxo de entrada e configuração inicial do workspace.

**Aceite:** cliente cria seu ambiente sem intervenção manual da equipe Vozly; usuário não acessa dados de outro tenant alterando IDs; papéis limitam ações administrativas; o servidor associa recursos ao tenant autorizado.

## MVP-02 — Onboarding e configuração self-service

- Assistente guiado para configuração inicial.
- Identidade da empresa e dados básicos do workspace.
- Criação do primeiro agente.
- Idioma inicial: português brasileiro.
- Tom, estilo, instruções, mensagem inicial e encerramento.
- Horários, regras de fallback e transferência.
- Orientações contextuais, validações e indicação de pendências.
- Salvar rascunho, testar e publicar versões identificáveis.
- Possibilidade de concluir etapas posteriormente sem perder progresso.

**Aceite:** administrador configura o agente e conclui o fluxo sem intervenção operacional da equipe Vozly; erros e pendências são apresentados com instruções acionáveis; alterações não afetam produção até nova publicação.

## MVP-03 — Conhecimento autogerenciado

- Cadastro, edição e remoção lógica de informações da empresa.
- Conteúdo textual e perguntas frequentes.
- Ativação/desativação e associação a agentes.
- Indicação de status de processamento/publicação, quando aplicável.
- Prévia ou teste de recuperação do conteúdo.

Upload e processamento avançado de documentos podem ser fase posterior, após validar o fluxo com conteúdo estruturado.

**Aceite:** cliente administra seu conteúdo no painel; conteúdo de um tenant nunca aparece para outro; sem informação suficiente, o agente admite a limitação e segue o fallback; respostas não extrapolam conteúdo disponível.

## MVP-04 — Ferramentas e integrações configuráveis

- Catálogo de capacidades/ferramentas suportadas pelo Vozly.
- Habilitação explícita por agente e tenant.
- Formulários de configuração com schemas e validações.
- Conexão de integrações disponíveis pelo próprio cliente, quando suportado.
- Fluxo seguro para inserir, validar, atualizar e revogar credenciais.
- Exibição de estado da conexão e erros acionáveis.
- Execução controlada pelo backend, com auditoria e idempotência quando necessário.

No MVP, o catálogo pode conter um conjunto limitado de ferramentas e integrações suportadas. Não é requisito oferecer integração universal, código arbitrário ou construtor de ferramentas.

**Aceite:** cliente consegue configurar as capacidades suportadas sem intervenção manual da equipe Vozly; credenciais não são retornadas ao frontend após gravação, não entram em prompts e não aparecem em logs; backend valida tenant, permissão, schema e regras antes de executar.

## MVP-05 — Telefonia e runtime de voz

- Receber chamadas por provedor compatível.
- Associar número, tenant e agente.
- Gerenciar sessões e estados de chamada.
- Integrar reconhecimento de fala (STT), modelo de linguagem (LLM) e síntese de voz (TTS).
- Tratar desconexões, timeouts e falhas.
- Transferir chamadas conforme regras configuradas pelo cliente.
- Expor estado de configuração e saúde dos componentes necessários.

Fornecedores ainda serão selecionados e encapsulados por adaptadores.

## MVP-06 — Testes, publicação e versionamento

- Testar agente em ambiente controlado antes da publicação.
- Validar campos obrigatórios, conhecimento, ferramentas e integrações.
- Mostrar ao cliente o que está pronto e o que impede a publicação.
- Publicar snapshot imutável da configuração.
- Pausar, reativar e publicar nova versão.
- Associar cada chamada à versão utilizada.

**Aceite:** cliente identifica pendências antes de publicar; rascunhos não afetam chamadas em produção; histórico de versões permite identificar a configuração usada em cada chamada.

## MVP-07 — Histórico e operação

Listar chamadas por período/agente; exibir data, duração, status, resultado, transcrição permitida, ferramentas executadas, transferências e falhas. Permitir que usuários autorizados consultem o histórico do próprio tenant. Gravação de áudio não é presumida: finalidade, aviso, acesso e retenção precisam de definição.

## MVP-08 — Consumo e limites

Registrar duração e consumo por tenant, uso de fornecedores e preparar limites por plano. Exibir consumo básico aos administradores do cliente.

## Requisitos não funcionais

- **Segurança:** isolamento multi-tenant no backend, autorização por papel, segredos protegidos, criptografia em trânsito, rate limiting e controle de acesso operacional.
- **Confiabilidade:** timeouts, tratamento de indisponibilidade, idempotência, persistência do estado e monitoramento.
- **LGPD:** finalidade/base legal, transparência, minimização, retenção, exclusão, acesso restrito e mapeamento de subprocessadores.
- **UX:** onboarding progressivo, autosave quando adequado, feedback de validação/publicação, estados vazios, documentação contextual e mensagens acionáveis.
- **Rastreabilidade:** alterações de configuração, versões, chamadas, operações solicitadas, resultados e transferências correlacionáveis.
- **Segredos:** credenciais criptografadas em repouso, mascaradas na interface, nunca disponíveis ao LLM e acessadas apenas pelo serviço autorizado.

## Fluxo prioritário de ativação

1. Cliente cria conta e workspace.
2. Define membros e papéis.
3. Configura o primeiro agente pelo onboarding.
4. Adiciona conhecimento e testa recuperação.
5. Habilita ferramentas e conecta integrações suportadas.
6. Configura número e regras de atendimento.
7. Executa testes e corrige pendências.
8. Publica uma versão.
9. Recebe chamadas.
10. Acompanha resultados, consumo e falhas no painel.

## Fluxo prioritário de chamada

1. Provedor encaminha a chamada.
2. Vozly identifica tenant, agente e versão publicada a partir do vínculo seguro do número.
3. Agente identifica a necessidade do interlocutor.
4. Consulta conhecimento ou solicita ferramenta habilitada.
5. Backend valida e executa a operação.
6. Agente comunica somente o resultado real retornado.
7. Aplica fallback ou transfere se necessário.
8. Persiste eventos e transcrição permitida.

## Regras essenciais

- O cliente administra configurações dentro dos limites de seu tenant e papel.
- O agente só opera quando publicado e ativo.
- O agente só utiliza ferramentas habilitadas para sua versão e tenant.
- A intenção ou sugestão do modelo não autoriza execução.
- O backend valida autorização, dados e regras de negócio.
- Nunca inventar preço, disponibilidade, status, prazo, protocolo ou confirmação.
- Nunca declarar uma operação concluída antes da confirmação do sistema responsável.
- Alterações e operações são rastreáveis.
- A equipe Vozly não precisa configurar manualmente a operação do cliente para que ele conclua o onboarding.

## Fora do MVP

- Construtor visual avançado de fluxos.
- Integração universal com qualquer sistema ou API.
- Execução de código arbitrário fornecido pelo cliente.
- Marketplace público de integrações.
- Chamadas ativas em massa e campanhas outbound.
- WhatsApp e outros canais além de voz.
- Cobrança recorrente completa e gestão comercial avançada.
- Analytics avançado e múltiplos idiomas.
- Configuração operacional feita pela equipe Vozly como serviço padrão.

## Perguntas em aberto

- Quais campos e passos são obrigatórios no onboarding inicial?
- Quais integrações estarão disponíveis no primeiro catálogo?
- Como será o modelo de conexão: OAuth, API key, webhook ou credencial gerenciada?
- Como armazenar, criptografar, rotacionar e revogar segredos?
- Como o cliente testa uma integração sem disparar efeitos colaterais reais?
- Como provisionar e validar números telefônicos?
- Quais recursos exigem aprovação ou verificação da conta?
- Provedor de telefonia e estratégia de conexão.
- Combinação STT/LLM/TTS.
- Gravação de áudio versus transcrição e respectivas políticas.
- Limites de duração, concorrência e consumo.