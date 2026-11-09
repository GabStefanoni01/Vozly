# Visão do produto

## O que é o Vozly

O Vozly é uma solução de agentes de voz inteligentes para automatizar atendimentos e operações empresariais por telefone. Seus agentes conversam naturalmente com clientes, consultam informações autorizadas e executam operações definidas pela empresa por meio de integrações controladas.

**Posicionamento:** Solução de agentes de voz inteligentes para automatizar atendimentos e operações empresariais.

**Promessa:** permitir que empresas configurem e operem seus próprios agentes de voz, transformando chamadas telefônicas em atendimentos resolutivos, com acesso controlado às informações e execução rastreável de operações.

## Problema

Empresas recebem chamadas repetitivas para consultar informações, acompanhar solicitações e iniciar processos. Essas interações consomem o tempo das equipes, podem ficar sem resposta fora do horário de funcionamento e dependem de informações distribuídas entre pessoas, documentos e sistemas. A implantação de automação também pode exigir configuração técnica e dependência de fornecedores, tornando difícil para a própria empresa adaptar o atendimento.

## Proposta de valor

O Vozly oferece uma experiência self-service para que cada empresa configure seu ambiente e seus agentes sem depender da equipe Vozly para mapear e parametrizar a operação.

A configuração será guiada e validada pelo produto. O cliente define o comportamento do agente, fornece conhecimento, habilita ferramentas, configura integrações e regras de atendimento, testa o resultado e publica suas próprias versões.

## Público e contexto de uso

O produto é destinado a empresas que desejam automatizar atendimentos telefônicos e operações compatíveis com agentes de voz. O MVP não será condicionado a um segmento, setor ou processo empresarial específico.

Os casos de uso são definidos e configurados pelo próprio cliente dentro das capacidades suportadas pelo Vozly. Integrações e operações específicas podem exigir conectores compatíveis ou configuração técnica adicional, mas não devem pressupor um único setor.

## Usuários

- **Proprietário/administrador da empresa:** cria e configura o workspace, gerencia usuários, agentes, integrações e permissões.
- **Gestor da operação:** configura conteúdo, ferramentas e regras de atendimento conforme suas permissões.
- **Operador/atendente:** acompanha atendimentos e assume conversas transferidas.
- **Cliente que liga:** interage por telefone com o agente de voz.
- **Equipe Vozly:** opera o serviço, mantém a infraestrutura, oferece suporte e administra recursos da plataforma sem assumir a configuração operacional de cada cliente.

## Responsabilidades

### Cliente

- Criar e manter as configurações do seu ambiente.
- Gerenciar usuários e permissões internas.
- Definir instruções, tom, horários e regras dos agentes.
- Cadastrar e manter informações de conhecimento.
- Habilitar e configurar ferramentas e integrações disponíveis.
- Conectar números e definir regras de transferência, conforme suporte do produto.
- Testar, publicar, pausar e revisar versões dos agentes.
- Garantir que possui autorização e fundamento adequado para fornecer dados e conectar sistemas.

### Vozly

- Disponibilizar onboarding, interfaces e documentação para configuração self-service.
- Proteger o isolamento entre empresas e controlar o acesso aos recursos.
- Validar configurações e operações no backend.
- Operar infraestrutura e adaptadores de fornecedores.
- Disponibilizar histórico, observabilidade, controles de consumo e suporte.
- Não acessar nem alterar a operação do cliente sem autorização e trilha de auditoria apropriadas.

## Jornada principal

1. A empresa cria sua conta e workspace.
2. Convida usuários e define papéis.
3. Segue o onboarding para configurar o primeiro agente.
4. Define identidade, instruções, comportamento e regras.
5. Cadastra ou importa conhecimento por meios suportados.
6. Seleciona ferramentas e configura integrações disponíveis.
7. Configura número, horários, fallback e transferência, conforme capacidades contratadas.
8. Executa testes e corrige pendências apontadas pelo sistema.
9. Publica uma versão do agente.
10. Acompanha chamadas, resultados, consumo e falhas; atualiza e publica novas versões quando necessário.

## Princípios do produto

- Self-service como premissa de produto, não como etapa opcional posterior.
- Configuração guiada, com validação e feedback claros.
- Recursos compreensíveis para usuários não técnicos.
- Extensibilidade por contratos de ferramentas e adaptadores.
- Ações limitadas a capacidades explicitamente habilitadas.
- Respostas operacionais fundamentadas em fontes confiáveis.
- Transparência sobre atendimento automatizado.
- Transferência humana quando necessária.
- Histórico, auditoria e rastreabilidade.
- Proteção de dados e isolamento entre empresas.

## Métricas

Ativação de workspaces; percentual de clientes que concluem onboarding sem intervenção; tempo até primeira publicação; agentes publicados; chamadas atendidas, resolvidas e transferidas; execuções de ferramentas concluídas; falhas por etapa; duração média; consumo por tenant; satisfação quando houver coleta válida.

## Limites e princípios de segurança

O agente não deve inventar informações, status, preços, prazos, disponibilidade ou confirmações. A IA interpreta a conversa e solicita operações; o backend valida tenant, permissões, dados e regras antes de executar qualquer ação.

Self-service não significa execução irrestrita. O cliente só pode habilitar capacidades oferecidas pelo produto e autorizadas para seu tenant. Credenciais devem ser armazenadas e utilizadas por mecanismos seguros, nunca expostas ao modelo, frontend ou logs.

O Vozly não tem como objetivo substituir integralmente equipes humanas. O atendimento humano permanece parte do fluxo, especialmente em situações ambíguas, sensíveis, excepcionais ou não suportadas.