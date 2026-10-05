# Landing Page — Ebook Coluna e ortobiológicos (Proregen)

Página estática para captura de leads + entrega do PDF gratuito
**Coluna e ortobiológicos**, com upsell do livro **Dói Aqui?**.

## Estrutura

```
lp-ebook-coluna/
├── index.html
├── styles.css
├── config.js          ← URLs e IDs do Google Forms
├── app.js
├── README.md
└── assets/
    ├── logo-h-dark.svg
    ├── logo-h-light.svg
    ├── doi-aqui-capa.jpg
    └── Ebook-Proregen-Coluna-Ortobiologicos.pdf
```

Sem build. Abra `index.html` no navegador ou hospede a pasta em qualquer static host.

## Configuração (`config.js`)

```js
window.LP_CONFIG = {
  googleFormAction: '', // https://docs.google.com/forms/d/e/FORM_ID/formResponse
  entries: {
    nome: 'entry.XXX',
    whatsapp: 'entry.XXX',
    email: 'entry.XXX',
    interesse: 'entry.XXX'
  },
  ebookUrl: 'assets/Ebook-Proregen-Coluna-Ortobiologicos.pdf',
  bookUrl: 'https://www.editoragente.com.br/doi-aqui--7520/p',
  whatsappClinic: '54996891295'
};
```

Com `googleFormAction` vazio (ou `entry.XXX` nos IDs), o formulário valida localmente,
mostra o agradecimento e libera o download do PDF — sem POST externo.

## Como obter os entry IDs do Google Forms

1. Crie um formulário no [Google Forms](https://forms.google.com) com os campos:
   - **Nome completo** (resposta curta)
   - **WhatsApp** (resposta curta)
   - **E-mail** (resposta curta / e-mail)
   - **Interesse** (múltipla escolha: Coluna / Joelho / Outro)
2. Clique em **Enviar** → ícone de link, ou abra o formulário publicado.
3. Forma mais rápida de achar os IDs:
   - Abra o formulário preenchível no navegador.
   - Clique com o botão direito → **Inspecionar**.
   - Nos inputs, procure `name="entry.1234567890"`.
   - A URL de envio é:  
     `https://docs.google.com/forms/d/e/<FORM_ID>/formResponse`  
     (troque `/viewform` por `/formResponse`).
4. Cole a URL em `googleFormAction` e cada `entry.XXXXXXXX` em `entries` no `config.js`.
5. Publique de novo (ou atualize o arquivo no host). Teste enviando um lead de teste.

> Dica: use **Pré-preencher formulário** (menu ⋮ do editor) — a URL gerada já traz
> `entry.XXXX=valor` e o `FORM_ID`.

## Fluxo no navegador

1. Usuário preenche e envia.
2. Se `googleFormAction` + entry IDs estiverem configurados, o JS faz `POST`
   com `fetch(..., { mode: 'no-cors' })` (resposta opaca; o Forms registra mesmo assim).
   Se o fetch falhar, há fallback via iframe oculto.
3. Sempre em seguida: esconde o formulário, mostra o bloco de agradecimento,
   botão de download do PDF e oferta do livro.

## Integração Manychat (Forms → Sheets → Manychat)

Fluxo sugerido sem custo de backend:

1. No Google Form, ative **Respostas → Vincular à Planilha** (Google Sheets).
2. No Manychat (ou Make/Zapier gratuito):
   - Trigger: nova linha na planilha.
   - Ação: iniciar fluxo no WhatsApp com o número da coluna WhatsApp
     (normalize para `55` + DDD + número).
3. No fluxo Manychat, envie a mensagem de boas-vindas + link do ebook
   (ou confirme que o PDF já foi baixado na LP) e, se fizer sentido,
   ofereça o livro **Dói Aqui?** ou agendamento.

Campos úteis na planilha: `Nome`, `WhatsApp`, `E-mail`, `Interesse`, `Timestamp`.
Segmente por `Interesse` (Coluna / Joelho / Outro) para automações diferentes.

## Marca

| Token   | Hex     |
|---------|---------|
| `--blue`  | `#66B2E0` |
| `--char`  | `#3A3C38` |
| `--white` | `#FFFFFF` |
| `--tint`  | `#EEF6FC` |
| `--tint2` | `#DCEEF9` |

Fonte: **Sora** (Google Fonts CDN).

## Contato na página

- Dr. André Kruel · CREMERS/CRM-RS 23627 · RQE 14323
- [proregen.com.br](https://proregen.com.br)
- WhatsApp (54) 99689-1295

## Hospedagem

Pasta pronta para GitHub Pages, Netlify Drop, Surge, Cloudflare Pages, etc.

## Produção (ligado)

- LP: https://kruelandre-jpg.github.io/proregen-lp-ebook-coluna/
- Form (editar): https://docs.google.com/forms/d/1xPzUMzYMUc2JH0WI6x0QzigushSWmcTtqxx0IJVGjRc/edit
- Form (público): https://docs.google.com/forms/d/e/1FAIpQLSdr3QukBusZnSz9PNobm4qA292Ltv4Jv0QI09jZ5-Vs6wkXRg/viewform
- Planilha respostas: https://docs.google.com/spreadsheets/d/19KvaI8NpkFN5sy23o-YbOq5dU86pzOh5xXNGKq9RAIY/edit
- Entries: nome entry.212396162 · whatsapp entry.1389541124 · email entry.471275429 · interesse entry.30545821
