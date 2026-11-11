import { BlogPost } from '../../../models/blog.models';
import { postAvancosMultimodais } from './avancos-modelos-multimodais-atendimento-telefonico.post';
import { postResolucaoAnatel } from './resolucao-anatel-diretrizes-chamadas-automatizadas.post';
import { postStirShakenPadroes } from './padroes-verificacao-chamadas-stir-shaken.post';

export const ULTIMAS_NOTICIAS_POSTS: BlogPost[] = [
  postAvancosMultimodais,
  postResolucaoAnatel,
  postStirShakenPadroes
];

export {
  postAvancosMultimodais,
  postResolucaoAnatel,
  postStirShakenPadroes
};
