# Roadmap de desenvolvimento

As fases são organizadas por entregas verificáveis, não por datas arbitrárias.

## Fase 0 — Descoberta e decisões técnicas
- [ ] Entrevistar empresas do segmento inicial.
- [ ] Mapear motivos de ligação e fluxo operacional.
- [ ] Definir caso de uso piloto e situações de transferência.
- [ ] Testar provedores de telefonia e números no Brasil.
- [ ] Comparar STT, LLM e TTS em português.
- [ ] Medir latência ponta a ponta e custo por minuto.
- [ ] Validar streaming e transferência.
- [ ] Definir política de gravação, transcrição e retenção.

**Saída:** fluxo piloto e decisões técnicas documentados.

## Fase 1 — Fundação
- [ ] Estruturar Angular e Spring Boot.
- [ ] Configurar ambientes, PostgreSQL e migrações.
- [ ] Implementar autenticação.
- [ ] Implementar tenants, memberships e papéis.
- [ ] Implementar autorização e isolamento.
- [ ] Testar acesso cruzado.
- [ ] Configurar logs e correlation IDs.

**Saída:** usuário acessa workspace com isolamento validado.

## Fase 2 — Configuração e publicação
- [ ] CRUD de agentes.
- [ ] Configuração guiada no Angular.
- [ ] Rascunhos, validação e versionamento.
- [ ] Publicação e pausa.
- [ ] FAQs e conteúdo de referência.
- [ ] Ferramentas habilitadas.
- [ ] Testes controlados.

**Saída:** empresa configura e publica agente sem telefonia real.

## Fase 3 — Runtime de voz
- [ ] Adaptador telefônico.
- [ ] Associação número/tenant/agente.
- [ ] Sessão de chamada.
- [ ] Integração STT, LLM e TTS.
- [ ] Tratamento de silêncio, interrupção e desconexão.
- [ ] Persistência de estados e eventos.
- [ ] Fallback e testes de latência.

**Saída:** cliente conversa com agente por telefone.

## Fase 4 — Ferramentas
- [ ] Contrato e executor de ferramentas.
- [ ] Registro de solicitação.
- [ ] Consulta de status se houver fonte real.
- [ ] Transferência humana.
- [ ] Validação, idempotência e auditoria.
- [ ] Testes de falhas.

**Saída:** agente resolve caso real e encaminha o que não resolve.

## Fase 5 — Painel e piloto
- [ ] Histórico e transcrições permitidas.
- [ ] Exibição de ações.
- [ ] Indicadores básicos e consumo.
- [ ] Testes de segurança e privacidade.
- [ ] Onboarding do piloto.
- [ ] Feedback e correções.

**Saída:** piloto acompanhado por métricas e suporte.

## Pós-MVP
- [ ] Processamento de documentos.
- [ ] Integrações CRM, ERP e calendários.
- [ ] Construtor visual.
- [ ] Planos e cobrança.
- [ ] WhatsApp e outros canais.
- [ ] Relatórios avançados.
- [ ] Mais idiomas e vozes.
- [ ] Escala e extração de módulos quando necessária.

## Critério de conclusão
Empresa configura agente; chamada real é recebida; agente responde com conhecimento; executa ao menos uma ação real autorizada; transfere/faz fallback; histórico é consultável; isolamento é testado; falhas e consumo são observáveis; privacidade e retenção estão definidas.