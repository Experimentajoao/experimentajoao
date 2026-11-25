/* Plataforma de simuladores - Prof. João Victor Mariano de Almeida - @experimentajoao */
var P = (function () {
  var SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  function fmt(n, d) {
    if (d === undefined) d = 2;
    if (!isFinite(n)) return '—';
    return Number(n).toLocaleString('pt-BR', { maximumFractionDigits: d, minimumFractionDigits: 0 });
  }
  function sci(n, d) {
    if (d === undefined) d = 2;
    if (n === 0) return '0';
    var e = Math.floor(Math.log10(Math.abs(n)));
    var m = n / Math.pow(10, e);
    if (Math.abs(m) >= 9.995) { m /= 10; e += 1; }
    if (e >= -2 && e <= 4) return fmt(n, d);
    return fmt(m, d) + ' × 10' + String(e).split('').map(function (c) { return SUP[c]; }).join('');
  }
  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  }
  function slider(pai, rotulo, o, on) {
    var box = el('div', 'ctrl'), r = el('div', 'rot'), a = el('span', '', rotulo), b = el('span');
    r.appendChild(a); r.appendChild(b);
    var inp = el('input'); inp.type = 'range'; inp.min = o.min; inp.max = o.max; inp.step = o.step || 1; inp.value = o.value;
    box.appendChild(r); box.appendChild(inp); pai.appendChild(box);
    function txt() { var v = Number(inp.value); b.textContent = (o.fmt ? o.fmt(v) : fmt(v, 3)) + (o.unit ? ' ' + o.unit : ''); }
    inp.addEventListener('input', function () { txt(); if (on) on(Number(inp.value)); });
    txt();
    return { get: function () { return Number(inp.value); }, set: function (v) { inp.value = v; txt(); }, el: box };
  }
  function seg(pai, rotulo, opcoes, valor, on) {
    if (rotulo) pai.appendChild(el('div', 'segrot', rotulo));
    var box = el('div', 'seg'), atual = valor, bts = [];
    opcoes.forEach(function (op) {
      var bt = el('button', op[0] === valor ? 'on' : '', op[1]); bt.type = 'button';
      bt.onclick = function () { atual = op[0]; bts.forEach(function (x) { x.classList.toggle('on', x === bt); }); if (on) on(atual); };
      bts.push(bt); box.appendChild(bt);
    });
    pai.appendChild(box);
    return { get: function () { return atual; }, el: box };
  }
  function leituras(pai, defs) {
    var box = el('div', 'leit'), mapa = {};
    defs.forEach(function (d) {
      var c = el('div'); c.appendChild(el('small', '', d[1])); var b = el('b', '', '—'); c.appendChild(b);
      box.appendChild(c); mapa[d[0]] = b;
    });
    pai.appendChild(box);
    return { set: function (k, t) { mapa[k].textContent = t; } };
  }
  function formula(pai, html) { var f = el('div', 'formula'); f.innerHTML = html; pai.appendChild(f); return f; }
  function dica(pai, t) { var d = el('p', 'dica', t); pai.appendChild(d); return d; }
  /* Progresso do aluno (fica salvo no aparelho) */
  var CHAVE = 'provinha_' + location.pathname.split('/').pop().replace('.html', '');
  function lerProg() { try { return JSON.parse(localStorage.getItem(CHAVE) || '{}'); } catch (e) { return {}; } }
  function gravarProg(p) { try { localStorage.setItem(CHAVE, JSON.stringify(p)); } catch (e) {} }
  /* Perguntas: o aluno marca tudo, confere no final; só vê as explicações quando acertar todas */
  function perguntas(pai, lista) {
    var box = el('div', 'card perg'); box.appendChild(el('h3', '', 'Perguntas rápidas'));
    box.appendChild(el('p', 'dica', 'Responda todas e depois toque em Conferir. Se errar alguma, volte ao simulador, teste de novo e corrija.'));
    var marc = [], blocos = [], fbs = [];
    lista.forEach(function (q) { banco.push({ q: q, lic: licaoAtual }); });
    lista.forEach(function (q, qi) {
      var d = el('div', 'q'); d.appendChild(el('p', '', (qi + 1) + '. ' + q.p));
      var fb = el('div', 'fb');
      q.a.forEach(function (alt, i) {
        var bt = el('button', '', alt); bt.type = 'button';
        bt.onclick = function () {
          if (box.classList.contains('feito')) return;
          d.querySelectorAll('button').forEach(function (x) { x.classList.remove('marcado'); });
          bt.classList.add('marcado'); marc[qi] = i; d.classList.remove('qerro');
          res.textContent = ''; atualiza();
        };
        d.appendChild(bt);
      });
      d.appendChild(fb); box.appendChild(d); blocos.push(d); fbs.push(fb);
    });
    var conf = el('button', 'bt', 'Conferir respostas'); conf.type = 'button';
    var res = el('div', 'resultado');
    box.appendChild(conf); box.appendChild(res);
    function atualiza() { var n = lista.filter(function (q, i) { return marc[i] !== undefined; }).length; conf.disabled = n < lista.length; conf.textContent = n < lista.length ? 'Conferir respostas (' + n + ' de ' + lista.length + ' marcadas)' : 'Conferir respostas'; }
    var id = licaoAtual;
    var pr = lerProg();
    if (pr[id] && pr[id].ok) { lista.forEach(function (q, i) { marc[i] = q.c; blocos[i].querySelectorAll('button')[q.c].classList.add('marcado'); }); }
    conf.onclick = function () {
      var erros = 0;
      lista.forEach(function (q, i) { var ok = marc[i] === q.c; blocos[i].classList.toggle('qerro', !ok); if (!ok) erros++; });
      var pg = lerProg(), r = pg[id] || { tent: 0 };
      if (!r.ok) r.tent = (r.tent || 0) + 1;
      if (r.nota === undefined) r.nota = Math.round((lista.length - erros) / lista.length * 100) / 10;
      if (!erros) r.ok = true;
      pg[id] = r; gravarProg(pg);
      if (erros) {
        res.className = 'resultado ruim';
        res.textContent = 'Você acertou ' + (lista.length - erros) + ' de ' + lista.length + '. As perguntas marcadas em vermelho estão erradas: volte ao simulador, teste e responda de novo.';
      } else {
        res.className = 'resultado bom';
        res.textContent = 'Parabéns! Lição concluída. Nota da lição (1ª tentativa): ' + fmt(r.nota, 1).replace(/^(\d+)$/, '$1,0') + '. Veja as explicações abaixo.';
        box.classList.add('feito'); conf.style.display = 'none';
        lista.forEach(function (q, i) { blocos[i].querySelectorAll('button')[q.c].classList.add('certo'); fbs[i].textContent = q.e; fbs[i].style.color = 'var(--ok)'; fbs[i].classList.add('mostra'); });
      }
    };
    atualiza();
    pai.appendChild(box);
    if (pr[id] && pr[id].ok) conf.onclick();
  }
  /* Canvas com coordenadas lógicas fixas (L x A), ajustado à largura da tela */
  function tela(pai, L, A) {
    var cv = el('canvas', 'tela'); pai.appendChild(cv);
    var ctx = cv.getContext('2d');
    function ajusta() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = L * dpr; cv.height = A * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    ajusta();
    cv.style.aspectRatio = L + ' / ' + A;
    function ponto(ev) {
      var r = cv.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * L / r.width, y: (ev.clientY - r.top) * A / r.height };
    }
    return { cv: cv, ctx: ctx, L: L, A: A, ponto: ponto };
  }
  function seta(ctx, x1, y1, x2, y2, cor, larg) {
    var ang = Math.atan2(y2 - y1, x2 - x1), t = 8 + (larg || 2) * 1.5;
    ctx.strokeStyle = ctx.fillStyle = cor; ctx.lineWidth = larg || 2;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    if (Math.hypot(x2 - x1, y2 - y1) < 3) return;
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - t * Math.cos(ang - 0.4), y2 - t * Math.sin(ang - 0.4));
    ctx.lineTo(x2 - t * Math.cos(ang + 0.4), y2 - t * Math.sin(ang + 0.4));
    ctx.closePath(); ctx.fill();
  }
  function texto(ctx, t, x, y, o) {
    o = o || {};
    ctx.font = (o.peso || '600') + ' ' + (o.tam || 14) + 'px system-ui,-apple-system,Segoe UI,Roboto,Arial';
    ctx.fillStyle = o.cor || '#1c2333'; ctx.textAlign = o.al || 'center'; ctx.textBaseline = o.base || 'middle';
    ctx.fillText(t, x, y);
  }
  /* Monta a página: abas, uma seção por simulador, animação só do simulador aberto */
  var sims = [], ativo = null, quadros = {}, licaoAtual = null;
  function pagina(lista) {
    var abas = document.getElementById('abas'), main = document.getElementById('main');
    lista.forEach(function (s, i) {
      var bt = el('button', '', (i + 1) + '. ' + s.nome); bt.type = 'button';
      var sec = el('section', 'sim'); sec.id = s.id;
      sec.appendChild(el('h2', '', s.titulo || s.nome));
      if (s.intro) sec.appendChild(el('p', 'intro', s.intro));
      var g = el('div', 'grid'), esq = el('div'), dir = el('div');
      var c1 = el('div', 'card'), c2 = el('div', 'card');
      esq.appendChild(c1); dir.appendChild(c2); g.appendChild(esq); g.appendChild(dir); sec.appendChild(g);
      main.appendChild(sec);
      s._bt = bt; s._sec = sec; s._areas = { tela: c1, ctrl: c2, esq: esq, dir: dir };
      bt.onclick = function () { abrir(s.id); };
      abas.appendChild(bt); sims.push(s);
    });
    function topo() { var t = document.querySelector('.topo'); if (t) document.documentElement.style.setProperty('--topo', t.offsetHeight + 'px'); }
    topo(); window.addEventListener('resize', topo);
    var h = location.hash.replace('#', '');
    abrir(sims.some(function (s) { return s.id === h; }) ? h : sims[0].id);
    var ult = performance.now();
    function loop(t) {
      var dt = Math.min((t - ult) / 1000, 0.05); ult = t;
      if (ativo && quadros[ativo]) quadros[ativo](dt);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }
  function abrir(id) {
    sims.forEach(function (s) {
      var on = s.id === id;
      s._bt.classList.toggle('on', on); s._sec.classList.toggle('on', on);
      if (on && !s._ok) { s._ok = true; licaoAtual = s.id; var f = s.init(s._areas); if (f) quadros[s.id] = f; }
      if (on) s._bt.scrollIntoView({ block: 'nearest', inline: 'center' });
    });
    ativo = id;
    if (history.replaceState) history.replaceState(null, '', '#' + id);
    window.scrollTo(0, 0);
  }


  /* ===================== DESAFIO FINAL GAMIFICADO ===================== */
  var banco = [];
  var FRASES = ['Cientista não desiste: testa de novo!', 'Cada erro é um experimento que ensinou algo.', 'Newton também começou do zero. Bora!', 'A Física está em tudo, e agora está em você!', 'Mais uma fase e você vira lenda!', 'Curiosidade é o seu superpoder.', 'O universo tem regras. Você está descobrindo todas!'];
  function nivel(xp, max) {
    var nv = [[0, 'Aprendiz de Laboratório', '🧪'], [0.3 * max, 'Explorador de Fenômenos', '🔭'], [0.6 * max, 'Cientista em Ação', '⚛️'], [0.85 * max, 'Mestre da Física', '🏆']];
    var r = nv[0]; nv.forEach(function (x) { if (xp >= x[0]) r = x; }); return r;
  }
  function desafio(serie, link) {
    return function (a) {
      /* garante que todas as lições carreguem suas perguntas para o desafio relâmpago */
      sims.forEach(function (s) { if (!s._ok && s.id !== 'desafio' && s.id !== 'certificado') { s._ok = true; var la = licaoAtual; licaoAtual = s.id; var f = s.init(s._areas); if (f) quadros[s.id] = f; licaoAtual = la; } });
      var licoes = sims.filter(function (s) { return s.id !== 'certificado' && s.id !== 'desafio'; });
      var E = a.tela, D = a.ctrl; E.classList.add('arena'); D.classList.add('arena2');
      var titulo = el('h2', '', '🎮 Arena Final · Física ' + serie); E.appendChild(titulo);
      var frase = el('p', 'frase'); E.appendChild(frase);
      var mapa = el('div', 'mapa'); E.appendChild(mapa);
      /* desafio relâmpago */
      var rel = el('div', 'relampago'); E.appendChild(rel);
      /* perfil */
      var perfil = el('div', 'perfil'); D.appendChild(perfil);
      var conq = el('div', 'conquistas'); D.appendChild(conq);
      var missao = el('div', 'missao'); D.appendChild(missao);
      var fi = Math.floor(Math.random() * FRASES.length);
      setInterval(function () { fi = (fi + 1) % FRASES.length; frase.textContent = '💬 ' + FRASES[fi]; }, 6000);
      frase.textContent = '💬 ' + FRASES[fi];
      function estado() {
        var pr = lerProg(), xp = 0, feitas = 0, perfeitas = 0, persist = 0;
        var d = licoes.map(function (s) { var r = pr[s.id] || {}; if (r.ok) { feitas++; xp += Math.round(r.nota * 100); if (r.nota === 10) perfeitas++; if (r.tent > 1) persist++; } return { s: s, r: r }; });
        var rl = pr._relampago || {};
        xp += (rl.melhor || 0) * 20;
        return { d: d, xp: xp, feitas: feitas, perfeitas: perfeitas, persist: persist, rl: rl, pr: pr };
      }
      function desenha() {
        var st = estado(), tot = licoes.length, nv = nivel(st.xp, tot * 1000 + 100);
        mapa.innerHTML = '';
        st.d.forEach(function (x, i) {
          var f = el('div', 'fase ' + (x.r.ok ? 'ok' : 'nao'));
          var ic = el('div', 'bola', x.r.ok ? (x.r.nota === 10 ? '⭐' : '✔') : String(i + 1));
          f.appendChild(ic); f.appendChild(el('small', '', x.s.nome));
          f.appendChild(el('b', '', x.r.ok ? '+' + Math.round(x.r.nota * 100) + ' XP' : 'jogar'));
          f.onclick = function () { abrir(x.s.id); };
          mapa.appendChild(f);
          if (i < st.d.length - 1) mapa.appendChild(el('div', 'trilha' + (x.r.ok ? ' ok' : '')));
        });
        perfil.innerHTML = '';
        perfil.appendChild(el('div', 'nivel', nv[2] + ' ' + nv[1]));
        perfil.appendChild(el('div', 'xp', st.xp + ' XP'));
        var barra = el('div', 'barraxp'), ib = el('i'); ib.style.width = Math.min(100, st.feitas / tot * 100) + '%'; barra.appendChild(ib); perfil.appendChild(barra);
        perfil.appendChild(el('small', '', st.feitas + ' de ' + tot + ' fases concluídas' + (st.feitas === tot ? ' · Missão final liberada!' : '')));
        conq.innerHTML = ''; conq.appendChild(el('h3', '', 'Conquistas'));
        [['🚀', 'Primeira fase', st.feitas >= 1], ['💯', 'Gabaritou de primeira', st.perfeitas >= 1], ['🧠', 'Persistente (errou e corrigiu)', st.persist >= 1], ['⚡', 'Relâmpago perfeito (5/5)', (st.rl.melhor || 0) >= 5], ['🌟', 'Todas as fases', st.feitas === tot], ['👑', 'Mestre (média 9 ou mais)', st.feitas === tot && st.xp - (st.rl.melhor || 0) * 20 >= 900 * tot]].forEach(function (c) {
          var b = el('div', 'selo ' + (c[2] ? 'on' : '')); b.appendChild(el('span', '', c[0])); b.appendChild(el('small', '', c[1])); conq.appendChild(b);
        });
        missao.innerHTML = ''; missao.appendChild(el('h3', '', '👾 Missão final: Desafio Kahoot'));
        if (st.feitas < tot) missao.appendChild(el('p', '', '🔒 Conclua todas as fases para liberar a missão final. Faltam ' + (tot - st.feitas) + '!'));
        else if (!link) missao.appendChild(el('p', '', '⏳ Missão liberada! O professor vai publicar o link do desafio em breve.'));
        else {
          missao.appendChild(el('p', '', 'Você chegou ao chefão! Abra o desafio, use o mesmo nome do certificado e responda no seu ritmo. Quanto mais rápido e certo, mais pontos!'));
          var bk = el('a', 'bt', '⚔️ Enfrentar o chefão (Kahoot)'); bk.href = link; bk.target = '_blank'; bk.rel = 'noopener'; missao.appendChild(bk);
        }
        missao.appendChild(el('p', 'dica', 'Depois da missão, pegue seu certificado na próxima aba. 🏅'));
        if (st.feitas === tot && !E._festa) { E._festa = true; confete(E); }
      }
      /* ---- relâmpago: 5 perguntas sorteadas, 15 s cada, combo ---- */
      function telaRel() {
        var pr = lerProg(), rl = pr._relampago || {};
        rel.innerHTML = '';
        rel.appendChild(el('h3', '', '⚡ Desafio Relâmpago'));
        rel.appendChild(el('p', '', 'Até 5 perguntas sorteadas das fases que você já concluiu, 15 segundos cada. Acertos seguidos fazem combo! Recorde: ' + (rl.melhor || 0) + '/5'));
        var b = el('button', 'bt', '▶ Começar'); b.type = 'button'; b.onclick = jogar; rel.appendChild(b);
      }
      function jogar() {
        var prg = lerProg(), disp = banco.filter(function (b) { return prg[b.lic] && prg[b.lic].ok; }).map(function (b) { return b.q; });
        if (!disp.length) { rel.innerHTML = ''; rel.appendChild(el('h3', '', '⚡ Desafio Relâmpago')); rel.appendChild(el('p', '', '🔒 Conclua pelo menos uma fase para liberar o Relâmpago!')); var bb = el('button', 'bt', 'Tentar de novo'); bb.type = 'button'; bb.onclick = jogar; rel.appendChild(bb); return; }
        var N = Math.min(5, disp.length), qs = disp.sort(function () { return Math.random() - 0.5; }).slice(0, N), i = 0, pts = 0, acertos = 0, combo = 0, timer = null;
        function prox() {
          if (i >= qs.length) return fim();
          var q = qs[i], t0 = Date.now();
          rel.innerHTML = '';
          var top = el('div', 'reltopo'); top.appendChild(el('span', '', 'Pergunta ' + (i + 1) + '/' + N)); top.appendChild(el('span', '', '🔥 Combo x' + (combo + 1))); top.appendChild(el('span', '', pts + ' pts')); rel.appendChild(top);
          var bar = el('div', 'tempo'), bi = el('i'); bar.appendChild(bi); rel.appendChild(bar);
          rel.appendChild(el('p', 'relq', q.p));
          var travado = false;
          q.a.forEach(function (alt, k) {
            var bt = el('button', 'relalt', alt); bt.type = 'button';
            bt.onclick = function () {
              if (travado) return; travado = true; clearInterval(timer);
              var ok = k === q.c;
              bt.classList.add(ok ? 'certo' : 'errado');
              if (ok) { acertos++; combo++; pts += Math.round((100 + Math.max(0, 15 - (Date.now() - t0) / 1000) * 10) * combo); }
              else combo = 0;
              var fb = el('p', 'relfb', ok ? ['Boa! 🎯', 'Mandou bem! ⚡', 'Isso aí, cientista! 🧠', 'Na mosca! 🚀'][acertos % 4] : 'Quase! Bora para a próxima 💪');
              rel.appendChild(fb);
              setTimeout(function () { i++; prox(); }, 1100);
            };
            rel.appendChild(bt);
          });
          timer = setInterval(function () {
            var r = 1 - (Date.now() - t0) / 15000; bi.style.width = Math.max(0, r * 100) + '%';
            if (r <= 0 && !travado) { travado = true; clearInterval(timer); combo = 0; rel.appendChild(el('p', 'relfb', '⏰ Tempo esgotado!')); setTimeout(function () { i++; prox(); }, 1000); }
          }, 100);
        }
        function fim() {
          var pr = lerProg(), rl = pr._relampago || {}, rec = acertos > (rl.melhor || 0);
          if (rec) { rl.melhor = acertos; pr._relampago = rl; gravarProg(pr); }
          rel.innerHTML = '';
          rel.appendChild(el('h3', '', acertos === 5 ? '⚡ PERFEITO! 5/5' : acertos >= 3 ? '🔥 Mandou bem: ' + acertos + '/' + N : '💪 ' + acertos + '/' + N + ', dá para melhorar!'));
          rel.appendChild(el('p', '', pts + ' pontos' + (rec ? ' · Novo recorde! (+XP)' : '')));
          rel.appendChild(el('p', '', acertos === 5 ? 'Você está voando! Agora encare o chefão. 👾' : 'Volte às fases, revise os simuladores e tente de novo!'));
          var b = el('button', 'bt', '↺ Jogar de novo'); b.type = 'button'; b.onclick = jogar; rel.appendChild(b);
          if (acertos === 5) confete(rel);
          desenha();
        }
        prox();
      }
      telaRel();
      var ult = '';
      return function () { var k = JSON.stringify(lerProg()); if (k !== ult) { ult = k; desenha(); } };
    };
  }
  function confete(alvo) {
    var cores = ['#ffd54a', '#ff6b6b', '#4dd4ac', '#5aa9ff', '#c58bff'];
    for (var i = 0; i < 60; i++) {
      var c = el('i', 'confete'); c.style.left = Math.random() * 100 + '%'; c.style.background = cores[i % 5];
      c.style.animationDelay = Math.random() * 0.8 + 's'; c.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      alvo.appendChild(c); (function (c) { setTimeout(function () { c.remove(); }, 3500); })(c);
    }
  }

  /* ===================== CERTIFICADO ===================== */
  function certificado(serie) {
    return function (a) {
      var licoes = sims.filter(function (s) { return s.id !== 'certificado' && s.id !== 'desafio'; });
      var T = tela(a.tela, 1600, 1130), ctx = T.ctx, c = a.ctrl;
      c.appendChild(el('h3', '', 'Seu certificado'));
      dica(c, 'Conclua as Perguntas rápidas de todas as lições. A nota de cada lição é a da primeira vez que você conferiu as respostas.');
      var rot = el('div', 'segrot', 'Nome completo do aluno (ou da dupla)'); c.appendChild(rot);
      var nome = el('input'); nome.placeholder = 'Ex.: Maria Souza e João Lima'; nome.maxLength = 70; c.appendChild(nome);
      var lista = el('div', 'leit'); c.appendChild(lista);
      var aviso = el('div', 'resultado'); c.appendChild(aviso);
      var bx = el('button', 'bt', '⬇ Baixar certificado (imagem)'); bx.type = 'button'; c.appendChild(bx);
      try { nome.value = localStorage.getItem('provinha_nome') || ''; } catch (e) {}
      nome.addEventListener('input', function () { try { localStorage.setItem('provinha_nome', nome.value); } catch (e) {} desenha(); });
      function dados() {
        var pr = lerProg();
        return licoes.map(function (s) { var r = pr[s.id] || {}; return { nome: s.nome, ok: !!r.ok, nota: r.nota, tent: r.tent || 0 }; });
      }
      function nt(v) { var t = fmt(v, 1); return t.indexOf(',') < 0 ? t + ',0' : t; }
      function painel() {
        var d = dados(), feitas = d.filter(function (x) { return x.ok; }).length;
        lista.innerHTML = '';
        d.forEach(function (x) { var cc = el('div'); cc.appendChild(el('small', '', x.nome)); cc.appendChild(el('b', '', x.ok ? 'Nota ' + nt(x.nota) : 'Pendente')); if (!x.ok) cc.style.background = 'var(--badbg)'; lista.appendChild(cc); });
        var pronto = feitas === d.length && nome.value.trim().length >= 3;
        aviso.className = 'resultado ' + (pronto ? 'bom' : 'ruim');
        aviso.textContent = feitas < d.length ? 'Faltam ' + (d.length - feitas) + ' lição(ões) para liberar o certificado.' : nome.value.trim().length < 3 ? 'Digite seu nome para liberar o certificado.' : 'Certificado liberado! Baixe e mostre ao professor.';
        bx.disabled = !pronto; bx.style.opacity = pronto ? 1 : 0.5;
        return { d: d, pronto: pronto };
      }
      function estrelas(n) { var k = Math.round(n / 2); return '★★★★★'.slice(0, k) + '☆☆☆☆☆'.slice(0, 5 - k); }
      function desenha() {
        var st = painel(), d = st.d, W = 1600, H = 1130;
        var g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#fffdf5'); g.addColorStop(1, '#f3ead2');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        /* molduras */
        ctx.strokeStyle = '#163f80'; ctx.lineWidth = 18; ctx.strokeRect(30, 30, W - 60, H - 60);
        ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 4; ctx.strokeRect(62, 62, W - 124, H - 124);
        ctx.strokeStyle = 'rgba(201,162,39,.5)'; ctx.lineWidth = 1.5; ctx.strokeRect(76, 76, W - 152, H - 152);
        /* cantos: átomos estilizados */
        [[120, 120], [W - 120, 120], [120, H - 120], [W - 120, H - 120]].forEach(function (p) {
          ctx.save(); ctx.translate(p[0], p[1]); ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 3;
          for (var k = 0; k < 3; k++) { ctx.beginPath(); ctx.ellipse(0, 0, 38, 13, k * Math.PI / 3, 0, 7); ctx.stroke(); }
          ctx.fillStyle = '#163f80'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, 7); ctx.fill(); ctx.restore();
        });
        /* onda decorativa */
        ctx.strokeStyle = 'rgba(31,95,191,.12)'; ctx.lineWidth = 6; ctx.beginPath();
        for (var x = 90; x <= W - 90; x += 4) { var y = H - 205 + 14 * Math.sin(x / 40); x === 90 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
        function tx(t, x, y, f, cor, al) { ctx.font = f; ctx.fillStyle = cor || '#1c2333'; ctx.textAlign = al || 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText(t, x, y); }
        tx('E. E. GARIBALDINA FERNANDES VALADARES', W / 2, 155, '600 26px system-ui, Arial', '#5b6578');
        tx('CERTIFICADO', W / 2, 250, 'bold 92px Georgia, "Times New Roman", serif', '#163f80');
        tx('Provinha da Massa · Simuladores de Física · ' + serie, W / 2, 300, 'italic 32px Georgia, serif', '#8a6d12');
        tx('Certificamos que', W / 2, 370, '28px Georgia, serif', '#5b6578');
        var n = nome.value.trim() || 'Seu nome aqui';
        var tam = n.length > 34 ? 56 : 72;
        tx(n, W / 2, 455, 'italic bold ' + tam + 'px Georgia, "Times New Roman", serif', nome.value.trim() ? '#1c2333' : '#b9bfca');
        ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(380, 478); ctx.lineTo(W - 380, 478); ctx.stroke();
        tx((/ e |,/.test(n) ? 'concluíram' : 'concluiu') + ' as lições de Física do 3º trimestre de 2026, explorando os simuladores e', W / 2, 525, '26px Georgia, serif', '#3a4150');
        tx('respondendo corretamente todas as perguntas, com o seguinte desempenho:', W / 2, 560, '26px Georgia, serif', '#3a4150');
        /* tabela de notas */
        var x0 = 260, y0 = 600, lh = Math.min(56, 250 / d.length);
        d.forEach(function (r, i) {
          var y = y0 + i * lh + lh * 0.7;
          if (i % 2 === 0) { ctx.fillStyle = 'rgba(22,63,128,.06)'; ctx.fillRect(x0, y0 + i * lh, 780, lh); }
          tx((i + 1) + '. ' + r.nome, x0 + 18, y, '600 26px system-ui, Arial', '#1c2333', 'left');
          tx(r.ok ? estrelas(r.nota) : '—', x0 + 560, y, '26px system-ui, Arial', '#c9a227', 'center');
          tx(r.ok ? nt(r.nota) : 'pendente', x0 + 760, y, 'bold 28px system-ui, Arial', r.ok ? '#163f80' : '#c0392b', 'right');
        });
        /* medalha com a média */
        var feitas = d.filter(function (r) { return r.ok; }), media = feitas.length ? feitas.reduce(function (s, r) { return s + r.nota; }, 0) / feitas.length : 0;
        var mx = 1250, my = 720;
        ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.moveTo(mx - 60, my + 60); ctx.lineTo(mx - 95, my + 190); ctx.lineTo(mx - 55, my + 165); ctx.lineTo(mx - 25, my + 200); ctx.lineTo(mx - 5, my + 80); ctx.fill();
        ctx.fillStyle = '#1f5fbf'; ctx.beginPath(); ctx.moveTo(mx + 60, my + 60); ctx.lineTo(mx + 95, my + 190); ctx.lineTo(mx + 55, my + 165); ctx.lineTo(mx + 25, my + 200); ctx.lineTo(mx + 5, my + 80); ctx.fill();
        var gm = ctx.createRadialGradient(mx - 30, my - 30, 10, mx, my, 120); gm.addColorStop(0, '#ffe98a'); gm.addColorStop(1, '#c9a227');
        ctx.fillStyle = gm; ctx.beginPath();
        for (var k = 0; k < 48; k++) { var an = k / 48 * Math.PI * 2, rr = k % 2 ? 112 : 124; ctx.lineTo(mx + rr * Math.cos(an), my + rr * Math.sin(an)); }
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fffdf5'; ctx.beginPath(); ctx.arc(mx, my, 90, 0, 7); ctx.fill();
        ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(mx, my, 82, 0, 7); ctx.stroke();
        tx('MÉDIA', mx, my - 30, 'bold 22px system-ui, Arial', '#8a6d12');
        tx(feitas.length ? nt(media) : '—', mx, my + 30, 'bold 62px Georgia, serif', '#163f80');
        /* data e assinatura */
        var hoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
        tx('Arinos (MG), ' + hoje, 380, H - 150, '24px Georgia, serif', '#3a4150');
        ctx.strokeStyle = '#3a4150'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(W - 640, H - 175); ctx.lineTo(W - 200, H - 175); ctx.stroke();
        tx('Prof. João Victor Mariano de Almeida', W - 420, H - 145, 'italic 26px Georgia, serif', '#1c2333');
        tx('Física · @experimentajoao', W - 420, H - 112, '22px system-ui, Arial', '#5b6578');
        if (!st.pronto) { ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-0.35); tx('PRÉVIA', 0, 0, 'bold 200px system-ui, Arial', 'rgba(192,57,43,.12)'); ctx.restore(); }
      }
      bx.onclick = function () {
        if (bx.disabled) return;
        var link = document.createElement('a');
        link.download = 'Certificado_Fisica_' + serie.replace(/\W+/g, '') + '_' + nome.value.trim().replace(/\s+/g, '_') + '.png';
        link.href = T.cv.toDataURL('image/png'); document.body.appendChild(link); link.click(); link.remove();
      };
      var ult = '';
      return function () { var k = JSON.stringify(lerProg()); if (k !== ult) { ult = k; desenha(); } };
    };
  }
  return { desafio: desafio, certificado: certificado, fmt: fmt, sci: sci, el: el, slider: slider, seg: seg, leituras: leituras, formula: formula, dica: dica,
           perguntas: perguntas, tela: tela, seta: seta, texto: texto, pagina: pagina };
})();
