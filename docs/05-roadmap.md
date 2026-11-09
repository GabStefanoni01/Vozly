# Roadmap de desenvolvimento

As fases são organizadas por entregas verificáveis, não por datas arbitrárias. A sequência prioriza que o cliente consiga configurar e ativar seu ambiente por conta própria.

## Fase 0 — Descoberta do produto e decisões técnicas

- [ ] Mapear jornada de onboarding self-service e principais dúvidas de configuração.
- [ ] Definir escopo mínimo de workspace, papéis e primeiro agente.
- [ ] Definir primeiro conjunto de ferramentas e integrações suportadas.
- [ ] Testar provedores de telefonia e números no Brasil.
- [ ] Comparar STT, LLM e TTS em português.
- [ ] Medir latência ponta a ponta e custo por minuto.
- [ ] Validar streaming e transferência.
- [ ] Definir fluxo seguro de credenciais e conexão de integrações.
- [ ] Definir política de gravação, transcrição e retenção.

**Saída:** jornada self-service, capacidades iniciais e decisões técnicas documentadas.

## Fase 1 — Fundação multi-tenant e onboarding

- [ ] Estruturar Angular e Spring Boot.
- [ ] Configurar ambientes, PostgreSQL e migrações.
- [ ] Implementar autenticação.
- [ ] Implementar tenants, memberships e papéis.
- [ ] Implementar provisionamento de workspace pelo cliente.
- [ ] Implementar progresso de onboarding.
- [ ] Implementar autorização e isolamento.
- [ ] Testar acesso cruzado.
- [ ] Configurar logs e correlation IDs.

**Saída:** cliente cria workspace e gerencia seus membros sem intervenção manual da equipe Vozly.

## Fase 2 — Configuração, conhecimento e publicação

- [ ] CRUD de agentes.
- [ ] Onboarding/configuração guiada no Angular.
- [ ] Rascunhos, validação e versionamento.
- [ ] Publicação, pausa e rollback.
- [ ] Cadastro e gestão de conhecimento.
- [ ] Prévia e teste do comportamento.
- [ ] Checklist de prontidão para publicação.

**Saída:** cliente configura, testa e publica um agente sem telefonia real e sem intervenção operacional da equipe Vozly.

## Fase 3 — Ferramentas e integrações self-service

- [ ] Catálogo inicial de ferramentas.
- [ ] Schemas e formulários de configuração.
- [ ] Gestão segura de credenciais.
- [ ] Teste, atualização e revogação de conexões.
- [ ] Executor controlado e auditoria.
- [ ] Idempotência, limites e tratamento de falhas.

**Saída:** cliente habilita ferramentas e conecta integrações suportadas por fluxos próprios do produto.

## Fase 4 — Runtime de voz

- [ ] Adaptador telefônico.
- [ ] Associação segura número/tenant/agente.
- [ ] Sessão de chamada.
- [ ] Integração STT, LLM e TTS.
- [ ] Tratamento de silêncio, interrupção e desconexão.
- [ ] Persistência de estados e eventos.
- [ ] Fallback e transferência.
- [ ] Testes de latência.

**Saída:** chamadas reais são recebidas e atendidas por agentes publicados pelo cliente.

## Fase 5 — Histórico, consumo e operação

- [ ] Histórico e transcrições permitidas.
- [ ] Exibição de ferramentas e resultados.
- [ ] Indicadores básicos e consumo.
- [ ] Limites e alertas de consumo.
- [ ] Testes de segurança e privacidade.
- [ ] Documentação de ajuda e suporte self-service.
- [ ] Monitoramento e ferramentas internas de suporte com acesso auditado.

**Saída:** cliente acompanha seu ambiente, enquanto a equipe Vozly monitora e opera a infraestrutura do produto.

## Pós-MVP

- [ ] Processamento avançado de documentos.
- [ ] Mais conectores CRM, ERP e APIs.
- [ ] Construtor visual de fluxos.
- [ ] Marketplace de integrações.
- [ ] Planos e cobrança.
- [ ] WhatsApp e outros canais.
- [ ] Relatórios avançados.
- [ ] Mais idiomas e vozes.
- [ ] Escala e extração de módulos quando necessária.

## Critério de conclusão

Uma empresa consegue criar seu workspace, convidar usuários, configurar conhecimento, ferramentas e integrações suportadas, testar e publicar um agente sem intervenção operacional da equipe Vozly; o agente recebe chamada real, executa ao menos uma ação autorizada, aplica fallback/transferência, mantém histórico consultável e consumo observável; isolamento, credenciais, falhas e privacidade são testados.