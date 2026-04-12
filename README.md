# ExperimentaJoão

Catálogo de experimentos científicos com filtro por disciplina e busca por tema.

## Como usar

Acesse o catálogo em: **[experimentajoao.github.io/experimentajoao](https://experimentajoao.github.io/experimentajoao)**

## Como adicionar um experimento

1. **Coloque a imagem** do projeto na pasta `images/` (formatos: `.jpg`, `.png`, `.webp`)
2. **Abra o arquivo** `index.html` e localize o array `projects` no `<script>`
3. **Adicione um objeto** seguindo o modelo abaixo:

```js
{
  id: 9,                          // número único
  title: "Nome do Experimento",
  discipline: "fisica",           // fisica | quimica | biologia | matematica
  description: "Breve descrição do que o experimento explora.",
  themes: ["tema1", "tema2"],     // palavras-chave para busca
  image: "images/meu-experimento.jpg"  // ou null para ícone padrão
}
```

4. **Salve e faça push** — o catálogo será atualizado automaticamente.

## Disciplinas disponíveis

| Disciplina | Cor |
|---|---|
| ⚡ Física | Azul |
| 🧪 Química | Laranja |
| 🌱 Biologia | Verde |
| 📐 Matemática | Roxo |
