// ===== LISTA DE MATERIAIS DO EXPERIMENTA JOÃO =====
// Esta lista alimenta o catálogo e os números da página inicial.
// Para adicionar um material novo, copie um bloco { ... } e mude os textos.
// materia: fisica, matematica, biologia, tecnologia, professor ou inclusao
// novo: true mostra a etiqueta "Novo" e coloca o material no começo da lista.

var MATERIAIS = [
  // ---------- REVISÃO DO ANO ----------
  {
    titulo: "Revisão do Ano · Física 1º ano",
    materia: "fisica",
    tipo: "Apresentação + simuladores + exercícios",
    icone: "1️⃣",
    novo: true,
    descricao: "Cinemática, leis de Newton, energia, trabalho e potência, impulso e hidrostática. Pronto para projetar: cada tema tem ideia central, simulador, pergunta para a turma e exercícios com correção, e no fim um quiz do ano.",
    link: "https://experimentajoao.github.io/experimentajoao/revisao/1ano.html"
  },
  {
    titulo: "Revisão do Ano · Física 2º ano",
    materia: "fisica",
    tipo: "Apresentação + simuladores + exercícios",
    icone: "2️⃣",
    novo: true,
    descricao: "Escalas de temperatura, calorimetria, dilatação, termodinâmica, refração, lentes, ondas, som e efeito Doppler. Pronto para projetar, com exercícios corrigidos na hora e quiz final.",
    link: "https://experimentajoao.github.io/experimentajoao/revisao/2ano.html"
  },
  {
    titulo: "Revisão do Ano · Física 3º ano",
    materia: "fisica",
    tipo: "Apresentação + simuladores + exercícios",
    icone: "3️⃣",
    novo: true,
    descricao: "Lei de Coulomb, Lei de Ohm, associação de resistores, conta de luz, indução, transformadores, espectro eletromagnético e efeito fotoelétrico. Pronto para projetar, com exercícios e quiz final.",
    link: "https://experimentajoao.github.io/experimentajoao/revisao/3ano.html"
  },

  // ---------- NOVOS ----------
  {
    titulo: "Física 1º ano · 3º Trimestre",
    materia: "fisica",
    tipo: "Simuladores · Plano de Curso SEE/MG",
    icone: "🚗",
    novo: true,
    descricao: "Impulso e colisões, pressão e Torricelli, Stevin, Pascal e empuxo. Em dupla, os alunos mexem nos simuladores, respondem perguntas rápidas e ganham certificado no final.",
    link: "https://experimentajoao.github.io/experimentajoao/provinha-da-massa/fisica1.html"
  },
  {
    titulo: "Física 2º ano · 3º Trimestre",
    materia: "fisica",
    tipo: "Simuladores · Plano de Curso SEE/MG",
    icone: "🔭",
    novo: true,
    descricao: "Olho e lentes, MHS e ondas, fenômenos ondulatórios, luz e cores, som e efeito Doppler. Tem perguntas rápidas e certificado no final.",
    link: "https://experimentajoao.github.io/experimentajoao/provinha-da-massa/fisica2.html"
  },
  {
    titulo: "Física 3º ano · 3º Trimestre",
    materia: "fisica",
    tipo: "Simuladores · Plano de Curso SEE/MG",
    icone: "💡",
    novo: true,
    descricao: "Transformador e gerador, energia elétrica, espectro eletromagnético e física moderna. Tem perguntas rápidas e certificado no final.",
    link: "https://experimentajoao.github.io/experimentajoao/provinha-da-massa/fisica3.html"
  },
  {
    titulo: "Corretor de Cartões-Resposta",
    materia: "professor",
    tipo: "Ferramenta do professor",
    icone: "✅",
    novo: true,
    descricao: "Imprima o cartão-resposta, aponte a câmera do celular e a nota sai na hora. Pode ser instalado no celular e funciona sem internet.",
    link: "https://experimentajoao.github.io/Corretor-/"
  },

  // ---------- FÍSICA ----------
  {
    titulo: "Cinética dos Gases",
    materia: "fisica",
    tipo: "Simulador",
    icone: "🎈",
    descricao: "Veja as partículas de um gás se movendo. Mude temperatura, volume e número de partículas e acompanhe pressão e velocidade nos instrumentos.",
    link: "https://experimentajoao.github.io/Term/"
  },
  {
    titulo: "Laboratório de Eletrostática",
    materia: "fisica",
    tipo: "Laboratório virtual",
    icone: "🧲",
    descricao: "Três simuladores em um: eletrização por atrito, por contato e por indução, com as cargas aparecendo na tela.",
    link: "https://experimentajoao.github.io/Eletrizacao/"
  },
  {
    titulo: "Enigma Térmico: Duelo",
    materia: "fisica",
    tipo: "Jogo para 2 jogadores",
    icone: "🌡️",
    descricao: "Jogo de cartas sobre equilíbrio térmico e a 2ª Lei da Termodinâmica. Dois jogadores disputam quem chega primeiro à temperatura-alvo.",
    link: "https://experimentajoao.github.io/Jogoequilibriotermico/"
  },
  {
    titulo: "Bistrô do Chef Pierre",
    materia: "fisica",
    tipo: "Jogo",
    icone: "👨‍🍳",
    descricao: "Os alunos trabalham na cozinha de um chef e precisam acertar massas e volumes. Treina densidade e proporções de um jeito divertido.",
    link: "https://experimentajoao.github.io/Pierre-/"
  },
  {
    titulo: "Mestre da Notação",
    materia: "fisica",
    tipo: "Simulador",
    icone: "🔢",
    descricao: "Treine notação científica movendo a vírgula e vendo o expoente mudar, enquanto a ordem de grandeza do número continua a mesma. Tem exemplos reais e dicas visuais.",
    link: "https://experimentajoao.github.io/Nota-o-cient-fica-/"
  },
  {
    titulo: "Operadores Vetoriais",
    materia: "fisica",
    tipo: "Simulador",
    icone: "🧭",
    descricao: "Veja na tela como funcionam divergente, gradiente e rotacional. Os campos vetoriais aparecem desenhados, de forma intuitiva.",
    link: "https://experimentajoao.github.io/Vetorial/"
  },
  {
    titulo: "Campo Elétrico: Noite Eletrostática",
    materia: "fisica",
    tipo: "Simulador + Jogo",
    icone: "⚡",
    descricao: "Arraste cargas e veja as linhas de campo e as forças, num visual inspirado em Van Gogh. Tem também um quebra-cabeça de campos elétricos.",
    link: "https://experimentajoao.github.io/Noite-eletrost-tica-/"
  },
  {
    titulo: "Processos Termodinâmicos",
    materia: "fisica",
    tipo: "Laboratório virtual",
    icone: "🔥",
    descricao: "Laboratório para simular processos isotérmico, isobárico, isocórico e adiabático, com gráficos que mudam na hora.",
    link: "https://experimentajoao.github.io/Processos-termodin-micos-/"
  },

  // ---------- MATEMÁTICA ----------
  {
    titulo: "Trinômio Quadrado Perfeito",
    materia: "matematica",
    tipo: "Simulador + Jogo",
    icone: "🟨",
    descricao: "Veja (a + b)² virar um quadrado dividido em partes. Depois os alunos praticam numa fábrica de trinômios. Tem recursos de acessibilidade.",
    link: "https://experimentajoao.github.io/Trinomio/"
  },
  {
    titulo: "Funções de Guerra",
    materia: "matematica",
    tipo: "Jogo para 2 jogadores",
    icone: "🎯",
    descricao: "Dois tanques se enfrentam disparando funções matemáticas. Para vencer, é preciso entender parábolas, senos e outras funções.",
    link: "https://experimentajoao.github.io/Funcoesdeguerra/"
  },
  {
    titulo: "Hall of Math",
    materia: "matematica",
    tipo: "Jogo",
    icone: "🚀",
    descricao: "Jogo de expressões numéricas e algébricas em um cenário espacial. Os alunos resolvem desafios para avançar.",
    link: "https://experimentajoao.github.io/Hallofmath/"
  },
  {
    titulo: "Dama no Plano Cartesiano",
    materia: "matematica",
    tipo: "Jogo",
    icone: "♟️",
    descricao: "O jogo de damas de sempre, mas em cima do plano cartesiano. Treina coordenadas e estratégia ao mesmo tempo.",
    link: "https://experimentajoao.github.io/Damacartesiana/"
  },

  // ---------- BIOLOGIA ----------
  {
    titulo: "Evolução de Darwin",
    materia: "biologia",
    tipo: "Simulador",
    icone: "🦎",
    descricao: "Simulador sobre a teoria da evolução. Explore seleção natural, adaptação e a diversidade das espécies.",
    link: "https://experimentajoao.github.io/EvolucaodeDarwin/"
  },
  {
    titulo: "Laboratório da Vida",
    materia: "biologia",
    tipo: "Laboratório virtual",
    icone: "🔬",
    descricao: "Refaça na tela os experimentos clássicos sobre a origem da vida (biogênese e abiogênese).",
    link: "https://experimentajoao.github.io/Labdavida/"
  },

  // ---------- TECNOLOGIA ----------
  {
    titulo: "Placa-Mãe",
    materia: "tecnologia",
    tipo: "Ambiente de aprendizagem",
    icone: "💻",
    descricao: "Conheça as peças de uma placa-mãe tocando em cada uma. Ótimo para aulas de hardware e informática.",
    link: "https://experimentajoao.github.io/Placa-m-e/"
  },

  // ---------- PARA O PROFESSOR ----------
  {
    titulo: "Diário de Classe",
    materia: "professor",
    tipo: "Ferramenta do professor",
    icone: "📒",
    descricao: "Faça a chamada e lance notas pelo celular. Os dados ficam guardados no seu próprio aparelho.",
    link: "https://experimentajoao.github.io/Di-rio/"
  },
  {
    titulo: "Rede Treino",
    materia: "inclusao",
    tipo: "Para alunos com laudo · AEE",
    icone: "🤝",
    descricao: "Um Instagram e um WhatsApp de mentira, seguros, para ensinar o uso das redes sociais a alunos com deficiência intelectual. Tem painel para o professor ou mediador acompanhar.",
    link: "https://experimentajoao.github.io/Redeapae/"
  }
];

var NOMES_MATERIAS = {
  fisica: "Física",
  matematica: "Matemática",
  biologia: "Biologia",
  tecnologia: "Tecnologia",
  professor: "Para o professor",
  inclusao: "Inclusão"
};
