const cards = document.querySelectorAll('.program-card');
const grid = document.querySelector('#programGrid');
const intro = document.querySelector('#intro');
const details = document.querySelector('#details');
const content = document.querySelector('#detailsContent');
const back = document.querySelector('#backButton');
const DRINKLAB_WHATSAPP = '258848541787';
const REGISTRATION_KEY = 'drinklab_academy_registrations';

const programs = {
  estudante: { title:'Coffee Training', subtitle:'Estudante', text:'O estudante dirige-se às instalações da DrinkLab Academy para aprender com acompanhamento profissional, unindo conhecimento teórico e prática.', options:[['Curso Básico','Fundamentos do café, equipamentos e técnicas essenciais.'],['Curso Intermédio','Aprofundamento técnico e prática profissional.'],['Complete','Formação completa para desenvolvimento profissional.']], formTitle:'Pré-inscrição — Coffee Training Estudante', fields:`<div class="field full"><label>Nome completo *</label><input name="nome" required placeholder="Digite o seu nome completo"></div><div class="field"><label>Telefone / WhatsApp *</label><input name="telefone" required type="tel" placeholder="+258 ..."></div><div class="field"><label>E-mail</label><input name="email" type="email" placeholder="seuemail@email.com"></div><div class="field"><label>Curso *</label><select name="curso" required><option value="">Selecione</option><option>Curso Básico</option><option>Curso Intermédio</option><option>Complete</option></select></div><div class="field"><label>Cidade</label><input name="cidade" placeholder="Maputo"></div><div class="field full"><label>Observações</label><textarea name="observacoes" rows="3" placeholder="Alguma informação para a Academy?"></textarea></div>` },
  corporativa: { title:'Coffee Training', subtitle:'Corporativa', text:'A equipa DrinkLab desloca-se ao estabelecimento do cliente. O formando aprende com os próprios equipamentos e dentro da realidade do seu local de trabalho.', options:[['Formação Corporativa','Treinamento adaptado à equipa e ao estabelecimento.'],['Formação Personalizada','Conteúdo ajustado às necessidades do cliente.'],['Especial / Intensivo','Recursos e condições ajustados segundo negociação.']], formTitle:'Pedido de proposta — Coffee Training Corporativa', fields:`<div class="field"><label>Nome do responsável *</label><input name="responsavel" required placeholder="Nome completo"></div><div class="field"><label>Estabelecimento / Empresa *</label><input name="empresa" required placeholder="Nome da empresa"></div><div class="field"><label>Telefone / WhatsApp *</label><input name="telefone" required type="tel" placeholder="+258 ..."></div><div class="field"><label>E-mail</label><input name="email" type="email" placeholder="empresa@email.com"></div><div class="field"><label>Número de formandos *</label><input name="participantes" required type="number" min="1" placeholder="Ex.: 6"></div><div class="field"><label>Local da formação *</label><input name="local" required placeholder="Cidade / estabelecimento"></div><div class="field full"><label>Tipo de formação *</label><select name="modalidade" required><option value="">Selecione</option><option>Formação Corporativa</option><option>Formação Personalizada</option><option>Especial / Intensivo — negociação</option></select></div><div class="field full"><label>Equipamentos disponíveis</label><textarea name="equipamentos" rows="3" placeholder="Ex.: máquina de espresso, moinho, blender..."></textarea></div>` },
  danca: { title:'Academia de', subtitle:'Dança', text:'Escolha o seu programa de dança e avance para o processo de inscrição. A inscrição é feita para 3 vezes por semana, com escolha do horário.', options:[['Manhã','08h às 10h'],['Tarde','16h às 18h'],['Frequência','3 vezes por semana']], formTitle:'Pré-inscrição — Academia de Dança', fields:`<div class="field full"><label>Nome completo *</label><input name="nome" required placeholder="Digite o seu nome completo"></div><div class="field"><label>Idade</label><input name="idade" type="number" min="3" placeholder="Idade"></div><div class="field"><label>Telefone / WhatsApp *</label><input name="telefone" required type="tel" placeholder="+258 ..."></div><div class="field"><label>E-mail</label><input name="email" type="email" placeholder="seuemail@email.com"></div><div class="field"><label>Horário *</label><select name="horario" required><option value="">Selecione</option><option value="08h as 10h">Manhã — 08h às 10h</option><option value="16h as 18h">Tarde — 16h às 18h</option></select></div><div class="field"><label>Frequência</label><input name="frequencia" value="3 vezes por semana" readonly></div><div class="field full"><label>Observações</label><textarea name="observacoes" rows="3" placeholder="Conte-nos o que procura na Academia de Dança."></textarea></div>` }
};

function renderProgram(key) {
  const p = programs[key];
  content.innerHTML = `<div class="detail-panel"><p class="eyebrow">DRINKLAB 95 ACADEMY</p><h2>${p.title}<br><span class="accent">${p.subtitle}</span></h2><p class="detail-intro">${p.text}</p><div class="options">${p.options.map(o=>`<div class="option"><strong>${o[0]}</strong><span>${o[1]}</span></div>`).join('')}</div><div class="registration"><div class="registration-heading"><span class="eyebrow">PRÓXIMO PASSO</span><h3>${p.formTitle}</h3><p>Preencha os dados. A inscrição será guardada nesta plataforma e o WhatsApp da DrinkLab será aberto para notificação.</p></div><form id="registrationForm" data-program="${key}"><div class="form-grid">${p.fields}</div><label class="consent"><input type="checkbox" required><span>Confirmo que os dados fornecidos são verdadeiros e autorizo o contacto da DrinkLab Academy sobre esta inscrição.</span></label><button class="submit-button" type="submit">Enviar e notificar DrinkLab no WhatsApp <span>→</span></button><div id="formMessage" class="form-message" role="status" aria-live="polite"></div></form></div></div>`;
  document.querySelector('#registrationForm').addEventListener('submit', handleSubmit);
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const programName = programs[form.dataset.program].title + ' — ' + programs[form.dataset.program].subtitle;
  const record = { ...data, programa: programName, id: Date.now().toString(), data: new Date().toLocaleString('pt-MZ') };
  const registrations = JSON.parse(localStorage.getItem(REGISTRATION_KEY) || '[]');
  registrations.push(record);
  localStorage.setItem(REGISTRATION_KEY, JSON.stringify(registrations));
  const lines = [`*NOVA PRÉ-INSCRIÇÃO — DRINKLAB ACADEMY*`,``,`*Programa:* ${programName}`];
  Object.entries(data).forEach(([key,value]) => { if(value) lines.push(`*${key}:* ${value}`); });
  lines.push('',`_Enviado através da plataforma DrinkLab Academy._`);
  const whatsappUrl = `https://wa.me/${DRINKLAB_WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
  document.querySelector('#formMessage').textContent = 'Inscrição guardada. O WhatsApp será aberto para enviar os dados à DrinkLab.';
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

cards.forEach(card=>card.addEventListener('click',()=>{ renderProgram(card.dataset.program); grid.hidden=true; intro.hidden=true; details.hidden=false; details.scrollIntoView({behavior:'smooth',block:'start'}); }));
back.addEventListener('click',()=>{ details.hidden=true; grid.hidden=false; intro.hidden=false; window.scrollTo({top:0,behavior:'smooth'}); });
