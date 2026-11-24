/* Revisão do Ano · Experimenta João
   Motor comum: slides em modo apresentação, simuladores, exercícios e quiz final. */
(function () {
  "use strict";
  var SVGNS = "http://www.w3.org/2000/svg";
  var LETRAS = ["A", "B", "C", "D", "E"];

  function el(tag, attrs, pai, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }
    if (html !== undefined) e.innerHTML = html;
    if (pai) pai.appendChild(e);
    return e;
  }
  function sv(tag, attrs, pai) {
    var e = document.createElementNS(SVGNS, tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (pai) pai.appendChild(e);
    return e;
  }
  function fmt(n, dec) {
    if (!isFinite(n)) return "—";
    if (dec === undefined) dec = 2;
    var a = Math.abs(n);
    if (a !== 0 && (a >= 1e7 || a < 1e-3)) {
      var e = Math.floor(Math.log10(a));
      var m = n / Math.pow(10, e);
      var sup = String(e).replace(/-/g, "⁻").replace(/\d/g, function (d) { return "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]; });
      return m.toLocaleString("pt-BR", { maximumFractionDigits: 2 }) + " × 10" + sup;
    }
    return n.toLocaleString("pt-BR", { maximumFractionDigits: dec });
  }

  // ===== Ferramentas entregues a cada simulador =====
  function ferramentas(raiz, registrarLoop) {
    var R = {
      el: el, sv: sv, fmt: fmt,
      palco: function (w, h, rotulo) {
        var p = el("div", { class: "palco" }, raiz);
        var s = sv("svg", { viewBox: "0 0 " + w + " " + h, role: "img", "aria-label": rotulo || "Simulador" }, p);
        return s;
      },
      controles: function () { return el("div", { class: "controles" }, raiz); },
      slider: function (pai, rot, min, max, passo, valor, mostrar, aoMudar) {
        var c = el("div", { class: "controle" }, pai);
        var id = "s" + Math.random().toString(36).slice(2, 8);
        var lab = el("label", { for: id }, c);
        el("span", null, lab, rot);
        var out = el("output", null, lab);
        var inp = el("input", { type: "range", id: id, min: min, max: max, step: passo, value: valor }, c);
        function atual() { var v = parseFloat(inp.value); out.textContent = mostrar ? mostrar(v) : fmt(v); return v; }
        inp.addEventListener("input", function () { aoMudar(atual()); });
        atual();
        return { get v() { return parseFloat(inp.value); }, set: function (v) { inp.value = v; atual(); }, input: inp };
      },
      opcoes: function (pai, rot, itens, valor, aoMudar) {
        var c = el("div", { class: "controle" }, pai);
        if (rot) el("label", null, c, "<span>" + rot + "</span>");
        var box = el("div", { class: "opcoes", role: "group", "aria-label": rot || "Opções" }, c);
        var atual = valor;
        var bts = itens.map(function (it) {
          var b = el("button", { type: "button", "aria-pressed": it.v === valor ? "true" : "false" }, box, it.t);
          b.addEventListener("click", function () {
            atual = it.v;
            bts.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
            aoMudar(it.v);
          });
          return b;
        });
        return { get v() { return atual; } };
      },
      botao: function (pai, texto, aoClicar, play) {
        var b = el("button", { type: "button", class: play ? "bt bt-play" : "bt" }, pai, texto);
        b.addEventListener("click", aoClicar);
        return b;
      },
      leituras: function () {
        var box = el("div", { class: "leituras", "aria-live": "polite" }, raiz);
        var mapa = {};
        return {
          set: function (id, rot, val) {
            if (!mapa[id]) { var d = el("div", { class: "leitura" }, box); mapa[id] = { s: el("span", null, d), b: el("b", null, d) }; }
            mapa[id].s.textContent = rot; mapa[id].b.textContent = val;
          }
        };
      },
      aviso: function () {
        var a = el("div", { class: "aviso-sim", role: "status" }, raiz);
        return { set: function (txt, tipo) { a.textContent = txt; a.className = "aviso-sim" + (tipo ? " " + tipo : ""); } };
      },
      animar: function (fn) { registrarLoop(fn); }
    };
    return R;
  }

  // ===== Exercícios =====
  function montarQuestao(pai, q, i, aoResponder) {
    var c = el("div", { class: "cartao questao" }, pai);
    el("p", { class: "enun" }, c, (i !== undefined ? (i + 1) + ". " : "") + q.p);
    var alts = el("div", { class: "alts" }, c);
    var exp = el("div", { class: "explica", hidden: "" }, c);
    var bts = q.ops.map(function (op, k) {
      var b = el("button", { type: "button", class: "alt" }, alts, '<span class="letra">' + LETRAS[k] + "</span><span>" + op + "</span>");
      b.addEventListener("click", function () {
        var certo = k === q.c;
        bts.forEach(function (x, j) { x.disabled = true; if (j === q.c) x.classList.add("certa"); });
        if (!certo) b.classList.add("errada");
        exp.hidden = false;
        exp.className = "explica " + (certo ? "ok" : "no");
        exp.innerHTML = (certo ? "<b>Isso!</b> " : "<b>Ainda não.</b> A resposta é a " + LETRAS[q.c] + ". ") + q.exp;
        if (aoResponder) aoResponder(certo);
      });
      return b;
    });
    return c;
  }

  // ===== Motor =====
  window.Revisao = {
    iniciar: function (cfg) {
      document.documentElement.style.setProperty("--serie", cfg.cor);
      document.documentElement.style.setProperty("--serie-claro", cfg.corClara);
      var slides = [{ tipo: "capa" }].concat(cfg.slides.map(function (s) { s.tipo = "tema"; return s; })).concat([{ tipo: "quiz" }]);
      var feitos = {};
      var atual = 0, loops = [], raf = null;

      // estrutura
      var topo = el("header", { class: "topo" }, document.body);
      var ti = el("div", { class: "topo-in" }, topo);
      el("span", { class: "selo-serie" }, ti, cfg.serie);
      el("h1", null, ti, cfg.titulo + "<small>" + cfg.subtitulo + "</small>");
      var tb = el("div", { class: "topo-btns" }, ti);
      var btApresentar = el("button", { type: "button", class: "bt-topo", title: "Tela cheia com letras grandes, para projetar" }, tb, "📺 Apresentar");
      var btGrande = el("button", { type: "button", class: "bt-topo", "aria-pressed": "false" }, tb, "🔎 Letras grandes");
      el("a", { class: "bt-topo", href: "../catalogo.html" }, tb, "📚 Catálogo");

      var trilha = el("nav", { class: "trilha", "aria-label": "Partes da revisão" }, document.body);
      var main = el("main", { id: "conteudo", tabindex: "-1" }, document.body);
      var nav = el("div", { class: "nav" }, document.body);
      var ni = el("div", { class: "nav-in" }, nav);
      var btAnt = el("button", { type: "button", class: "bt-nav" }, ni, "⬅ Anterior");
      el("span", { class: "dica-teclado" }, ni, "Dica: use as setas do teclado ou o passador de slides.");
      var btProx = el("button", { type: "button", class: "bt-nav prox" }, ni, "Próximo ➡");
      el("footer", { class: "rodape" }, document.body, 'Feito por <a href="../index.html">Prof. João Victor · Experimenta João</a>. Material gratuito para professores e alunos.');

      var bTrilha = slides.map(function (s, i) {
        var rot = s.tipo === "capa" ? "🏠" : s.tipo === "quiz" ? "🏆 Quiz" : String(i);
        var b = el("button", { type: "button", title: s.tipo === "tema" ? s.titulo : s.tipo === "capa" ? "Início" : "Quiz do ano" }, trilha, rot);
        b.addEventListener("click", function () { ir(i); });
        return b;
      });

      function pararLoops() { loops = []; if (raf) cancelAnimationFrame(raf); raf = null; }
      function registrarLoop(fn) {
        loops.push(fn);
        if (!raf) {
          var ult = performance.now();
          var passo = function (t) {
            var dt = Math.min(0.05, (t - ult) / 1000); ult = t;
            loops.forEach(function (f) { f(dt); });
            raf = loops.length ? requestAnimationFrame(passo) : null;
          };
          raf = requestAnimationFrame(passo);
        }
      }

      function ir(i) {
        i = Math.max(0, Math.min(slides.length - 1, i));
        pararLoops();
        atual = i;
        main.innerHTML = "";
        var s = slides[i];
        var box = el("section", { class: "slide", "aria-label": s.titulo || "" }, main);
        if (s.tipo === "capa") capa(box);
        else if (s.tipo === "quiz") quiz(box);
        else tema(box, s, i);
        bTrilha.forEach(function (b, j) {
          if (j === i) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
          b.classList.toggle("feito", !!feitos[j]);
        });
        btAnt.disabled = i === 0;
        btProx.disabled = i === slides.length - 1;
        btProx.textContent = i === 0 ? "Começar ➡" : i === slides.length - 2 ? "Quiz do ano 🏆" : "Próximo ➡";
        if (location.hash !== "#" + i) history.replaceState(null, "", "#" + i);
        window.scrollTo(0, 0);
      }

      function capa(box) {
        var g = el("div", { class: "capa" }, box);
        var l = el("div", { class: "lousa" }, g);
        el("span", { class: "selo-serie" }, l, cfg.serie + " · Física");
        el("h2", null, l, "Revisão do <span>ano inteiro</span>");
        el("p", null, l, cfg.apresentacao);
        var ul = el("div", { class: "como-usar" }, l);
        el("p", null, ul, "<b>Como usar:</b>");
        el("ul", null, ul, "<li>Na TV ou no projetor, toque em <b>📺 Apresentar</b>.</li><li>Em cada tema: ideia central, simulador para mexer e exercícios com correção na hora.</li><li>No final, o <b>Quiz do ano</b> com " + cfg.quiz.length + " questões.</li>");
        var d = el("div", { class: "cartao" }, g);
        el("h3", null, d, "📋 Temas do ano");
        var ol = el("ol", { class: "sumario" }, d);
        slides.forEach(function (s, i) {
          if (s.tipo === "capa") return;
          var li = el("li", null, ol);
          var b = el("button", { type: "button" }, li, s.tipo === "quiz"
            ? '<span class="n">🏆</span><span>Quiz do ano<small>' + cfg.quiz.length + " questões de todos os temas</small></span>"
            : '<span class="n">' + i + "</span><span>" + s.icone + " " + s.titulo + "<small>" + s.tema + "</small></span>");
          b.addEventListener("click", function () { ir(i); });
        });
      }

      function tema(box, s, i) {
        var cab = el("div", { class: "cab-slide" }, box);
        el("span", { class: "tema" }, cab, s.tema);
        el("h2", null, cab, s.icone + " " + s.titulo);
        el("span", { class: "num" }, cab, i + " de " + (slides.length - 2));
        var g = el("div", { class: "grade" }, box);
        var esq = el("div", null, g);
        var c1 = el("div", { class: "cartao ideia" }, esq);
        el("h3", null, c1, "💡 Ideia central");
        el("div", null, c1, s.ideia);
        if (s.formula) el("div", { class: "formula" }, c1, s.formula);
        if (s.pergunta) {
          var det = el("details", { class: "pergunta-turma" }, c1);
          el("summary", null, det, "Pergunta para a turma");
          el("p", null, det, s.pergunta.p);
          if (s.pergunta.r) el("p", { class: "resp" }, det, "<b>Para o professor:</b> " + s.pergunta.r);
        }
        var dir = el("div", { class: "cartao sim" }, g);
        el("h3", null, dir, "🧪 " + (s.simTitulo || "Simulador"));
        try { s.sim(dir, ferramentas(dir, registrarLoop)); }
        catch (e) { el("p", null, dir, "Não foi possível abrir o simulador neste aparelho."); console.error(e); }

        if (s.exercicios && s.exercicios.length) {
          var ex = el("div", { class: "exercicios" }, box);
          el("h3", null, ex, "✏️ Exercícios rápidos");
          var qs = el("div", { class: "questoes" }, ex);
          var resp = 0;
          s.exercicios.forEach(function (q, k) {
            montarQuestao(qs, q, k, function () { resp++; if (resp === s.exercicios.length) { feitos[i] = true; bTrilha[i].classList.add("feito"); } });
          });
        }
      }

      function quiz(box) {
        var cab = el("div", { class: "cab-slide" }, box);
        el("span", { class: "tema" }, cab, "Todos os temas");
        el("h2", null, cab, "🏆 Quiz do ano");
        var placar = el("div", { class: "placar" }, box);
        var pQ = el("div", null, placar), pA = el("div", null, placar);
        var area = el("div", null, box);
        var n = 0, acertos = 0, ordem = cfg.quiz.map(function (_, k) { return k; });
        function mostrar() {
          area.innerHTML = "";
          pQ.innerHTML = "Questão <span>" + (n + 1) + "</span> de " + ordem.length;
          pA.innerHTML = "Acertos: <span>" + acertos + "</span>";
          var q = cfg.quiz[ordem[n]];
          var tema = el("p", { class: "tema-q" }, area);
          tema.innerHTML = '<span class="cab-slide"><span class="tema">' + q.tema + "</span></span>";
          var c = montarQuestao(area, q, undefined, function (certo) {
            if (certo) acertos++;
            pA.innerHTML = "Acertos: <span>" + acertos + "</span>";
            var b = el("button", { type: "button", class: "bt bt-play", style: "margin-top:.8rem" }, c, n === ordem.length - 1 ? "Ver resultado 🏁" : "Próxima questão ➡");
            b.addEventListener("click", function () { n++; if (n < ordem.length) mostrar(); else fim(); });
            b.focus();
          });
        }
        function fim() {
          area.innerHTML = "";
          var c = el("div", { class: "cartao resultado-final" }, area);
          el("div", { class: "grande" }, c, acertos + " / " + ordem.length);
          var t = acertos >= ordem.length * 0.9 ? "🏆 Excelente! A turma dominou o ano." : acertos >= ordem.length * 0.6 ? "👏 Muito bem! Revejam os temas em que erraram." : "💪 Vale revisar os temas com calma e tentar de novo.";
          el("p", { style: "font-weight:800;margin:.6rem 0 1rem" }, c, t);
          var b = el("button", { type: "button", class: "bt bt-play" }, c, "↺ Refazer o quiz");
          b.addEventListener("click", function () { n = 0; acertos = 0; mostrar(); });
          feitos[atual] = true; bTrilha[atual].classList.add("feito");
        }
        mostrar();
      }

      btAnt.addEventListener("click", function () { ir(atual - 1); });
      btProx.addEventListener("click", function () { ir(atual + 1); });
      document.addEventListener("keydown", function (e) {
        var tag = (document.activeElement && document.activeElement.tagName) || "";
        if (/INPUT|SELECT|TEXTAREA/.test(tag)) return;
        if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); ir(atual + 1); }
        if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); ir(atual - 1); }
      });
      btGrande.addEventListener("click", function () {
        var on = document.body.classList.toggle("tela-grande");
        btGrande.setAttribute("aria-pressed", on ? "true" : "false");
      });
      btApresentar.addEventListener("click", function () {
        document.body.classList.add("tela-grande");
        btGrande.setAttribute("aria-pressed", "true");
        var d = document.documentElement;
        if (!document.fullscreenElement && d.requestFullscreen) d.requestFullscreen().catch(function () {});
        else if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen();
      });

      var h = parseInt((location.hash || "").slice(1), 10);
      ir(isNaN(h) ? 0 : h);
    }
  };
})();
