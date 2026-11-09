# Jornada self-service e configuração do cliente

## Objetivo

O Vozly deve permitir que cada empresa configure seu próprio ambiente e publique agentes de voz sem depender da equipe Vozly para mapear ou parametrizar sua operação. Este documento descreve a experiência esperada para o MVP, independente do setor de atuação do cliente.

## Princípio central

O cliente é responsável pela configuração operacional do seu tenant. O Vozly é responsável por fornecer uma experiência guiada, validar as configurações, proteger os dados e executar somente capacidades autorizadas.

Self-service não significa ausência de limites técnicos ou de suporte. O cliente configura o que o produto oferece; integrações não suportadas, incidentes e dúvidas complexas podem exigir suporte, mas não devem tornar a intervenção manual pré-requisito para o onboarding padrão.

## Jornada do cliente

### 1. Criar conta e workspace

- Criar uma conta com autenticação segura.
- Criar o workspace da empresa.
- Informar os dados básicos necessários à identificação e operação da conta.
- Aceitar termos e concluir verificações exigidas pelo produto.
- Receber confirmação de criação e acesso ao painel.

O provisionamento deve ser automático, idempotente e associado ao usuário autenticado.

### 2. Convidar equipe e definir papéis

- Convidar membros por e-mail ou mecanismo suportado.
- Definir papéis e permissões.
- Consultar e revogar acessos.
- Garantir que todos os recursos sejam acessados somente dentro dos tenants autorizados.

### 3. Configurar o agente

O cliente deve conseguir definir:

- Nome e finalidade do agente.
- Idioma e estilo de comunicação.
- Instruções e limites de comportamento.
- Mensagem inicial e encerramento.
- Horários e regras de fallback.
- Critérios e destino de transferência humana, quando suportados.

O painel deve explicar os campos e sinalizar configurações incompletas ou conflitantes.

### 4. Adicionar conhecimento

- Criar e editar conteúdo textual e perguntas frequentes.
- Associar conteúdo a um ou mais agentes, conforme modelo definido.
- Ativar, desativar e remover conteúdo.
- Visualizar o estado do conteúdo.
- Testar se o agente encontra respostas relevantes.

O agente só pode responder com base no conteúdo autorizado e disponível. Ausência ou conflito de informação deve resultar em fallback, não em invenção.

### 5. Habilitar ferramentas

- Navegar por um catálogo explícito de ferramentas oferecidas pelo Vozly.
- Entender a finalidade, os dados necessários e os efeitos de cada ferramenta.
- Habilitar a ferramenta para um agente.
- Configurar parâmetros permitidos por formulário validado.
- Definir permissões e limites quando aplicável.

O MVP não oferece execução de código arbitrário nem acesso livre a APIs ou bancos de dados.

### 6. Conectar integrações

Quando uma ferramenta depender de sistema externo, o cliente deve conseguir:

- Selecionar uma integração suportada.
- Seguir instruções para obter/configurar credenciais.
- Inserir credencial por fluxo seguro.
- Testar a conexão sem expor o segredo.
- Atualizar ou revogar a credencial.
- Consultar o estado da conexão e erros acionáveis.

O catálogo inicial será limitado. O produto não deve prometer compatibilidade universal com qualquer sistema.

### 7. Configurar telefonia

Conforme os provedores suportados, o cliente poderá:

- Selecionar ou conectar um número.
- Associar número a um agente publicado.
- Configurar horários e regras de atendimento.
- Definir comportamento em indisponibilidade e transferência.
- Validar a configuração antes de ativar o recebimento de chamadas.

Os detalhes de provisionamento e verificação de números dependem da escolha do provedor.

### 8. Testar e publicar

Antes da publicação, o produto executa uma verificação de prontidão:

- Campos obrigatórios preenchidos.
- Conhecimento ativo e associado.
- Ferramentas configuradas e autorizadas.
- Integrações conectadas e válidas.
- Número e regras de atendimento configurados, quando necessários.
- Mensagens de fallback definidas.
- Limites e avisos relevantes apresentados.

O cliente pode testar o agente em ambiente controlado. Testes não devem produzir efeitos colaterais reais sem aviso e confirmação apropriados.

A publicação cria uma versão imutável. Alterações posteriores ficam em rascunho até nova publicação. Cada chamada referencia a versão utilizada.

## Responsabilidades e limites

### O cliente é responsável por

- Manter informações e instruções corretas e atualizadas.
- Configurar agentes, conhecimento, ferramentas e integrações.
- Definir quem pode administrar o ambiente.
- Fornecer credenciais e autorizações legítimas para sistemas externos.
- Definir regras de atendimento e transferência.
- Revisar testes e publicar alterações.
- Cumprir obrigações aplicáveis ao tratamento de dados e comunicação com seus clientes.

### O Vozly é responsável por

- Disponibilizar o produto, onboarding e documentação.
- Provisionar e isolar ambientes.
- Validar configuração, permissão e operações no backend.
- Proteger credenciais e dados.
- Operar adaptadores e infraestrutura.
- Exibir estados, erros e consumo com clareza.
- Disponibilizar suporte e ferramentas internas auditáveis.

## Princípios técnicos obrigatórios

- O tenant é resolvido no servidor a partir da identidade/membership, nunca aceito cegamente do cliente ou do modelo.
- Toda configuração e operação é validada no backend.
- Credenciais não são retornadas ao frontend depois de salvas.
- Segredos nunca entram em prompts, transcrições, logs ou snapshots de agente.
- Ferramentas têm schemas explícitos, permissões, limites, timeout e política de repetição.
- A execução utiliza adaptadores controlados e registra auditoria.
- Publicações são snapshots imutáveis.
- Falhas de integração são apresentadas com estado claro e não como sucesso.
- A equipe Vozly não altera a configuração operacional de um tenant sem autorização explícita e trilha de auditoria.

## Estados de configuração sugeridos

- **Não iniciado:** etapa ainda não preenchida.
- **Em andamento:** há dados salvos, mas faltam requisitos.
- **Inválido:** configuração possui erro que impede teste ou publicação.
- **Pronto para teste:** requisitos mínimos preenchidos para validação.
- **Conectado:** integração validada.
- **Pronto para publicar:** todas as condições de ativação foram satisfeitas.
- **Publicado:** versão ativa no runtime.
- **Atenção necessária:** integração ou recurso publicado apresenta falha que requer ação.

Os estados finais e transições serão refinados na implementação.

## Fora do escopo do MVP

- Construtor visual avançado de fluxos.
- Integração universal com qualquer API ou sistema.
- Código arbitrário, scripts ou SQL fornecidos pelo cliente.
- Marketplace aberto de integrações.
- Onboarding operado manualmente pela equipe Vozly como padrão.
- Personalização de infraestrutura dedicada por tenant, salvo necessidade futura.

## Critérios de aceite

- [ ] Um cliente consegue criar seu workspace sem intervenção manual da equipe Vozly.
- [ ] O cliente consegue convidar usuários e administrar papéis.
- [ ] O cliente configura um agente e salva seu progresso.
- [ ] O cliente cadastra e gerencia conhecimento.
- [ ] O cliente habilita ferramentas disponíveis e configura seus parâmetros.
- [ ] O cliente conecta e testa integrações suportadas por fluxo seguro.
- [ ] O produto indica pendências e erros de configuração de forma acionável.
- [ ] O cliente testa e publica uma versão sem intervenção operacional da equipe Vozly.
- [ ] Credenciais não são exibidas novamente, expostas ao modelo ou registradas em logs.
- [ ] Configurações e chamadas permanecem isoladas por tenant.
- [ ] Toda alteração relevante possui autoria e auditoria.
- [ ] O cliente consegue acompanhar chamadas, estado e consumo de seu próprio ambiente.

## Decisões em aberto

- Campos mínimos de cadastro e verificação do workspace.
- Papéis e permissões detalhados.
- Catálogo inicial de ferramentas.
- Primeiro conjunto de integrações e seus métodos de autenticação.
- Solução de armazenamento e rotação de segredos.
- Modo de teste de integrações com e sem efeitos colaterais.
- Provedor e processo de provisionamento de números.
- Política de suporte e acesso temporário da equipe Vozly a ambientes de clientes.
