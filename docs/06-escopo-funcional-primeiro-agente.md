# Escopo funcional do primeiro agente

## 1. Contexto e objetivo

O primeiro agente do Vozly será validado em uma assistência técnica de eletrodomésticos que realiza atendimentos na loja e em domicílio.

O objetivo é automatizar interações telefônicas recorrentes e operações simples, sem retirar da empresa o controle sobre informações, permissões e decisões. O agente deve entender a necessidade do cliente, consultar informações aprovadas e solicitar operações específicas ao backend.

Este documento descreve o comportamento esperado. Não define ainda fornecedor de telefonia, STT, LLM ou TTS, nem presume integração com um sistema de assistência específico.

## 2. Escopo funcional

O MVP contempla três operações principais:

- Atendimento e consulta de informações.
- Consulta de ordem de serviço.
- Abertura de solicitação de atendimento.

A transferência para uma pessoa é um mecanismo transversal, disponível sempre que o agente não puder concluir o atendimento com segurança.

## 3. Operação A — Atendimento e consulta de informações

### Objetivo

Responder dúvidas recorrentes sobre a assistência técnica usando exclusivamente informações cadastradas e aprovadas pela empresa.

### Exemplos de assuntos

- Horário de funcionamento e endereço.
- Regiões atendidas.
- Tipos de produtos e serviços atendidos.
- Orientações gerais sobre como solicitar atendimento.
- Procedimentos e informações de garantia que tenham sido fornecidos e aprovados pela empresa.

### Entradas

O agente identifica a pergunta e, quando necessário, solicita esclarecimentos para entender o produto, serviço ou contexto da dúvida.

### Fonte de informação

O agente consulta a base de conhecimento vinculada ao tenant e à versão publicada do agente. O conteúdo deve possuir estado de publicação/ativação e origem administrativa identificável.

### Saída esperada

Resposta objetiva, baseada no conteúdo recuperado. Quando apropriado, o agente pode oferecer continuidade por consulta de ordem de serviço, abertura de solicitação ou transferência humana.

### Regras e exceções

- Não inferir políticas de garantia, cobertura, preço, prazo ou capacidade de atendimento.
- Não responder como fato quando a informação estiver ausente, desatualizada, conflitante ou sem confiança suficiente.
- Não utilizar conteúdo de outro tenant.
- Encaminhar ao atendimento humano quando a dúvida exigir avaliação técnica, exceção comercial ou decisão da empresa.

## 4. Operação B — Consulta de ordem de serviço

### Objetivo

Permitir que o cliente consulte o andamento de uma ordem de serviço sem expor informações de terceiros.

### Dados a coletar

O conjunto definitivo será configurado conforme o sistema do piloto. Como referência inicial:

- Número da ordem de serviço ou protocolo, quando disponível.
- Dado de identificação adicional exigido pela empresa para validar o solicitante, como telefone cadastrado ou outro fator apropriado.

O agente deve solicitar apenas os dados estritamente necessários.

### Pré-condições

- Existe uma integração habilitada para consulta.
- O backend conhece o tenant e a operação autorizada.
- A identidade do solicitante foi validada conforme política definida pela empresa.
- Os dados mínimos para localizar a ordem foram coletados e validados.

### Fluxo esperado

1. Cliente informa que deseja consultar um serviço.
2. Agente coleta o identificador da ordem/protocolo.
3. Agente solicita o fator adicional de validação exigido.
4. Backend valida os dados e executa a consulta no sistema autorizado.
5. Backend retorna um resultado limitado aos campos permitidos.
6. Agente comunica o status e demais informações efetivamente retornadas.

### Saída permitida

Somente os campos explicitamente liberados pelo backend, por exemplo status atual, data de atualização e previsão registrada, quando existente.

### Regras e exceções

- Não revelar dados pessoais, endereço, telefone ou informações de outro cliente.
- Não confirmar a existência de uma ordem antes da validação exigida.
- Não inventar status, data, previsão ou conclusão.
- Se não localizar resultado, informar que não foi possível localizar com os dados fornecidos e oferecer nova tentativa ou transferência.
- Em falha ou indisponibilidade da integração, explicar que a consulta não pôde ser concluída; nunca apresentar resposta antiga como atual sem indicação explícita de sua data.
- Limitar tentativas de validação e aplicar controles contra enumeração de ordens.
- Registrar a tentativa e o resultado sem armazenar dados sensíveis desnecessários.

## 5. Operação C — Abertura de solicitação de atendimento

### Objetivo

Registrar uma nova solicitação de atendimento na operação da assistência técnica, reduzindo a necessidade de um atendente coletar manualmente as informações iniciais.

### Dados a coletar

- Nome do solicitante.
- Telefone para contato, confirmando se é o número da ligação ou outro.
- Tipo de atendimento: na loja ou em domicílio.
- Endereço, quando o atendimento for em domicílio.
- Produto/eletrodoméstico.
- Marca e modelo, quando disponíveis e relevantes.
- Descrição do problema relatado.
- Melhor informação de disponibilidade/contato, somente se o processo do piloto exigir e houver campo correspondente.

O agente deve distinguir informações obrigatórias das opcionais conforme regras configuradas pela empresa. Não deve inventar modelo, endereço ou detalhes técnicos.

### Pré-condições

- A operação de registro está habilitada para o tenant.
- Os campos obrigatórios estão definidos.
- O backend dispõe de integração ou mecanismo de persistência autorizado.
- O cliente foi informado sobre o uso dos dados necessários para registrar a solicitação.

### Fluxo esperado

1. Cliente solicita atendimento.
2. Agente identifica se o atendimento será na loja ou em domicílio.
3. Agente coleta os dados obrigatórios para aquele tipo de solicitação.
4. Agente resume os dados principais e permite correção antes do envio.
5. Backend valida os campos e registra a solicitação.
6. Backend retorna o resultado e, se criado, o identificador/protocolo.
7. Agente confirma o registro somente após receber sucesso do backend.

### Saída esperada

Confirmação com protocolo ou identificador real retornado pelo sistema, além de um resumo curto do que foi registrado.

### Regras e exceções

- Não afirmar que uma solicitação foi aberta antes da confirmação do backend.
- Não prometer visita, horário, prazo, preço ou disponibilidade.
- A abertura de solicitação não equivale a agendamento confirmado.
- Se houver erro de validação, solicitar correção dos campos indicados.
- Se houver timeout ou falha, verificar o resultado por mecanismo idempotente antes de tentar criar novamente, evitando duplicidade.
- Se não for possível concluir, informar a falha e transferir ou orientar o contato humano conforme regra da empresa.

## 6. Transferência para atendimento humano

A transferência é um mecanismo transversal e deve ser acionada quando:

- O cliente solicitar falar com uma pessoa.
- A pergunta exigir avaliação técnica ou decisão não coberta pelo conhecimento aprovado.
- Houver baixa confiança, informações conflitantes ou dados insuficientes após tentativas razoáveis.
- A integração necessária estiver indisponível ou retornar erro não recuperável.
- A validação de identidade não puder ser concluída.
- A conversa indicar reclamação, exceção ou situação que a empresa definiu como obrigatória para atendimento humano.

### Contexto transferido

Sempre que tecnicamente possível e permitido, encaminhar:

- Identificação da chamada e do tenant.
- Motivo da transferência.
- Resumo do que o cliente solicitou.
- Dados já coletados e validados, minimizados ao necessário.
- Operações tentadas e seus resultados.
- Etapa em que o atendimento foi interrompido.

A transferência deve ser registrada no histórico. Se não houver atendente disponível ou a transferência falhar, o agente deve explicar a situação e seguir a alternativa configurada pela empresa, sem afirmar que a transferência ocorreu.

## 7. Contrato entre agente e backend

O modelo de IA não acessa diretamente banco de dados, executa SQL livre ou decide permissões.

O fluxo esperado é:

1. O modelo identifica a intenção e propõe uma operação disponível.
2. O runtime valida se a ferramenta está habilitada na versão publicada do agente.
3. O backend valida tenant, autorização, schema, campos, limites e regras de negócio.
4. O backend executa a operação por integração controlada.
5. O backend registra auditoria e devolve um resultado estruturado.
6. O agente formula a resposta usando somente esse resultado.

Cada ferramenta deve possuir contrato explícito com nome, finalidade, parâmetros, campos obrigatórios, validações, permissões, timeout, política de repetição/idempotência e formato de resposta.

A resposta da ferramenta deve diferenciar pelo menos sucesso, ausência de resultado, erro de validação, falha temporária e falha definitiva. Mensagens técnicas internas e dados sensíveis não devem ser expostos ao cliente.

## 8. Requisitos transversais de segurança e privacidade

- Toda operação deve ser executada no contexto do tenant identificado pelo servidor.
- O tenant não pode ser escolhido ou sobrescrito por argumento livre do modelo.
- Validar autorização no backend em todas as chamadas, mesmo que a ferramenta não esteja visível ao agente.
- Aplicar minimização de dados e coletar apenas o necessário para a finalidade.
- Registrar auditoria de operações, acessos relevantes, transferências e falhas.
- Não incluir segredos, credenciais ou dados pessoais desnecessários em prompts, logs ou mensagens.
- Definir retenção e acesso a transcrições e gravações antes de habilitar armazenamento de áudio.
- Respeitar as políticas de transparência e proteção de dados aplicáveis ao piloto.

## 9. Comportamento em falhas

| Situação | Comportamento esperado |
|---|---|
| Informação não cadastrada | Admitir que não possui a informação e oferecer transferência |
| Dados obrigatórios ausentes | Solicitar somente os campos faltantes |
| Dados inválidos | Explicar o que precisa ser corrigido |
| Ordem não localizada | Informar que não foi possível localizar e oferecer nova tentativa/transferência |
| Falha de integração | Não inventar resultado; informar indisponibilidade e aplicar fallback |
| Timeout após operação de escrita | Verificar idempotência/resultado antes de repetir |
| Cliente pede pessoa | Iniciar transferência e registrar motivo |
| Baixa confiança ou conflito | Não improvisar; transferir |

## 10. Fora do escopo deste agente no MVP

- Agendar ou confirmar visita técnica com base em disponibilidade de técnicos.
- Cancelar ou reagendar visitas.
- Gerar orçamento, negociar preço ou receber pagamento.
- Diagnosticar tecnicamente o defeito ou orientar reparos potencialmente perigosos.
- Consultar ou alterar sistemas sem integração autorizada e contrato definido.
- Garantir prazo de reparo, disponibilidade de peças ou resultado técnico.

Essas capacidades dependem de processos e integrações que ainda precisam ser descobertos no piloto.

## 11. Critérios de aceite funcionais

- [ ] O agente responde perguntas somente com informações aprovadas e vinculadas ao tenant.
- [ ] O agente reconhece quando não possui informação suficiente e aciona o fallback.
- [ ] A consulta de ordem exige os dados e a validação definidos pela empresa.
- [ ] A consulta retorna somente os campos autorizados pelo backend.
- [ ] O agente não revela dados de terceiros nem confirma ordem antes da validação.
- [ ] A abertura de solicitação coleta os campos obrigatórios conforme atendimento na loja ou em domicílio.
- [ ] O agente apresenta resumo para correção antes do envio, quando aplicável.
- [ ] O protocolo/identificador só é informado após sucesso confirmado pelo backend.
- [ ] Falhas e timeouts não são apresentados como sucesso e não causam duplicidade de registros.
- [ ] O cliente pode solicitar atendimento humano em qualquer etapa.
- [ ] A transferência registra motivo e contexto permitido.
- [ ] Todas as operações respeitam isolamento de tenant, autorização e auditoria.

## 12. Descobertas necessárias no piloto

Antes de implementar as integrações reais, levantar com a assistência:

- Sistema utilizado para ordens de serviço e cadastro de clientes.
- Como uma nova solicitação é registrada atualmente.
- Quais campos são obrigatórios para atendimento na loja e em domicílio.
- Quais dados podem validar o titular de uma ordem.
- Quais status e campos podem ser informados por telefone.
- Quais perguntas frequentes e políticas estão aprovadas para consulta.
- Horários, destinos e regras para transferência humana.
- Política de privacidade, aviso de atendimento automatizado e retenção de dados.

Essas descobertas refinam os contratos de ferramentas sem alterar os limites de segurança definidos neste documento.
