# Rota ENEM

Site de venda dos ebooks do Rota ENEM. HTML estatico, sem build.
No ar em https://rotaenem-ebooks.netlify.app

## Estrutura

| Arquivo | O que e |
|---|---|
| `index.html` | Pagina principal, com o catalogo e o carrinho |
| `estrutura-1000.html` | Pagina de venda do Estrutura 1000 (R$ 9,90) |
| `privacidade.html` | Politica de privacidade |
| `posts/` | Posts do blog e imagens dos carrosseis |
| `tracking.js` | Guarda a origem da visita (UTM) e repassa ao checkout da Kiwify |
| `_headers` | Cabecalhos HTTP aplicados pelo Netlify |
| `netlify.toml` | Configuracao do deploy |

## Pagamento

O checkout e da Kiwify (`pay.kiwify.com.br`). Os links ficam no topo do
`<script>` do carrinho, em `index.html`:

- `CHECKOUT` — produtos individuais e o kit
- `COMBO2` / `COMBO3` — combos de 2 e de 3 ebooks

Para trocar um link de pagamento, basta editar essas constantes.

## Rastreamento (Meta Pixel)

Dois pixels rodam no site:

- **4520426948244984** — no codigo, no `<head>` de cada pagina
- **1362253992648713** — injetado pelo Netlify (Project configuration →
  Developer settings → Snippet injection). Nao esta neste repositorio,
  e entra automaticamente em cada deploy.

Divisao dos eventos, para nada ser contado duas vezes:

| Evento | Quem dispara |
|---|---|
| `PageView` | o site |
| `AddToCart` | o site, ao adicionar ao carrinho |
| `InitiateCheckout` | a Kiwify, no checkout dela |
| `Purchase` | a Kiwify, quando o pagamento e aprovado |

O `InitiateCheckout` foi deliberadamente removido do site: a Kiwify ja
dispara esse evento, pelo navegador e pela API de Conversoes. Disparar
tambem aqui faria o Meta contar a mesma pessoa duas vezes.

## Deploy

Todo push na branch `main` publica o site no Netlify.
