# Vozly — Frontend Application

Aplicação frontend oficial da **Vozly**, construída com Angular, TypeScript e CSS Moderno, focada na identidade visual premium, alta responsividade e apresentação do produto.

---

## 🎨 Identidade Visual e Design Tokens

A identidade da Vozly foi estruturada em torno de contrastes profundos, gradientes violetas e superfícies escuras com estética de software premium:

| Token CSS | Valor Hex / Função | Aplicação |
|---|---|---|
| `--bg-primary` | `#050505` | Fundo principal da página |
| `--bg-secondary` | `#0B0B0F` | Fundo secundário e faixas |
| `--bg-card` | `#15151B` | Superfície padrão dos cards |
| `--bg-card-highlight`| `#202027` | Superfície de cards com ênfase |
| `--primary-purple` | `#6D00FF` | Roxo oficial da marca |
| `--secondary-violet` | `#8B3DFF` | Violeta de transição e bordas |
| `--light-purple` | `#A855F7` | Roxo claro para destaques e ícones |
| `--text-primary` | `#FFFFFF` | Títulos e textos de alta ênfase |
| `--text-secondary` | `#A1A1AA` | Descrições e parágrafos de apoio |
| `--border-subtle` | `#292530` | Bordas discretas e divisores |
| `--status-green` | `#22C55E` | Indicador de chamada ativa e sucesso |
| `--gradient-primary` | `linear-gradient(120deg, #6D00FF, #A855F7)` | Botões de ação primária |

### Tipografia
- **Títulos e Display:** `Plus Jakarta Sans`, com pesos 600, 700 e 800.
- **Corpo e Interface:** `Inter`, com pesos 400, 500 e 600.
- **Códigos e Indicadores Técnicos:** `JetBrains Mono`.

---

## 🧩 Arquitetura de Componentes

Todos os componentes são **Standalone** e organizados por responsabilidade:

```text
src/app/
├── components/
│   ├── layout/
│   │   ├── header/             # Header fixo com detecção de scroll e menu mobile
│   │   └── footer/             # Rodapé com branding oficial e links
│   ├── sections/
│   │   ├── hero/               # Hero com símbolo 3D, ondas sonoras e cartões flutuantes
│   │   ├── brand-strip/        # Faixa dos 5 pilares fundamentais da plataforma
│   │   ├── problem/            # Três cards dos desafios de atendimento comercial
│   │   ├── how-it-works/       # 4 etapas conectadas por trilha visual iluminada
│   │   ├── call-demo/          # Simulador de chamada telefônica com extração de dados
│   │   ├── features/           # Grid de 6 capacidades da plataforma
│   │   ├── industries/         # 6 segmentos atendidos e exemplos de uso
│   │   ├── dashboard-preview/  # Mockup de dashboard com gráficos SVG e chamadas recentes
│   │   ├── integrations/       # Ecossistema de conexões e badge de desenvolvimento
│   │   ├── security/           # 4 pilares de governança e confiabilidade
│   │   └── final-cta/          # Seção de encerramento com símbolo e ações
│   └── ui/
│       ├── icon/               # Componente de ícones vetoriais SVG de alta performance
│       └── demo-modal/         # Modal acessível para registro de interesse e avisos
├── app.ts                      # Componente raiz da aplicação
├── app.html                    # Composição das seções
└── app.css                     # Estilos de layout
```

---

## 🚀 Comandos Disponíveis

| Comando | Descrição |
|---|---|
| `npm start` | Inicia o servidor local de desenvolvimento na porta `4200` |
| `npm run build` | Compila a aplicação para produção em `dist/frontend` com orçamentos otimizados |
| `npm run watch` | Compila em modo contínuo para desenvolvimento |

---

## 📱 Responsividade e Acessibilidade

- **Totalmente Responsivo:** Testado em resoluções mobile (320px–480px), tablet (768px–1024px) e monitores ultrawide.
- **Acessibilidade:**
  - Contraste em conformidade com WCAG AA.
  - HTML semântico (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`).
  - Atributos `aria-label`, `aria-hidden` e `role="dialog"` aplicados.
  - Suporte total a `prefers-reduced-motion` no CSS global.
  - Foco visível (`:focus-visible`) para navegação facilitada por teclado.

---

> ℹ️ **Nota de Engenharia:** Este frontend é estritamente de apresentação e demonstração interativa. Não há dependências diretas de backend ou chamadas de API ativas nesta etapa.
