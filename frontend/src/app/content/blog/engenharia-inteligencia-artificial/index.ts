import { BlogPost } from '../../../models/blog.models';
import { postArquiteturaAgentesVoz } from './arquitetura-agentes-voz-baixa-latencia.post';
import { postBargeInInterrupcao } from './barge-in-interrupcao-natural-modelos-neurais.post';
import { postOrquestracaoFerramentas } from './orquestracao-ferramentas-function-calling-sistemas-voz.post';

export const ENGENHARIA_IA_POSTS: BlogPost[] = [
  postArquiteturaAgentesVoz,
  postBargeInInterrupcao,
  postOrquestracaoFerramentas
];

export {
  postArquiteturaAgentesVoz,
  postBargeInInterrupcao,
  postOrquestracaoFerramentas
};
