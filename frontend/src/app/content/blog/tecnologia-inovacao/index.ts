import { BlogPost } from '../../../models/blog.models';
import { postFuturoConectividadeNuvem } from './futuro-conectividade-nuvem-redes-voz.post';
import { postSegurancaCriptografia } from './seguranca-informacao-criptografia-ambientes-corporativos.post';
import { postTransformacaoDigitalTelecom } from './transformacao-digital-telecomunicacoes-b2b.post';

export const TECNOLOGIA_INOVACAO_POSTS: BlogPost[] = [
  postFuturoConectividadeNuvem,
  postSegurancaCriptografia,
  postTransformacaoDigitalTelecom
];

export {
  postFuturoConectividadeNuvem,
  postSegurancaCriptografia,
  postTransformacaoDigitalTelecom
};
