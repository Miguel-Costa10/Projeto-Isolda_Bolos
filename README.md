# IsoldaBolos — experiência 2.0

Projeto front-end em React + TypeScript + Vite.

## Executar localmente

```bash
npm install
npm run dev
```

Para validar a compilação:

```bash
npm run build
```

## Antes de publicar

Abra `src/App.tsx` e configure:
- `WHATSAPP_NUMBER`: código do país + DDD + número, somente dígitos.
- `INSTAGRAM_URL`: endereço do perfil oficial da loja.

## Recursos

- Página inicial de apresentação com imagens em movimento suave e animações de entrada ao rolar a página.
- Catálogo separado da apresentação, com abas Geral, Clássicos, Chocolate, Infantil, Temáticos, 15 anos, Noivas e Docinhos.
- Busca e filtros do catálogo.
- Carrinho de compras com quantidades e resumo enviado ao WhatsApp.
- Formulário de personalização de bolo enviado ao WhatsApp.
- Atalhos de contato por WhatsApp e Instagram.
- Chat demonstrativo de dúvidas frequentes.

## Sobre o chat virtual

O chat incluído é uma demonstração front-end com respostas para perguntas frequentes. Para usar uma IA real, será necessário conectar um backend/API com chave protegida no servidor. Não coloque chaves secretas diretamente no código do navegador.

## Imagens

As fotografias são carregadas de URLs públicas do Unsplash e precisam de conexão com a internet para aparecer.
