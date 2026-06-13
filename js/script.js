/**
 * Carneiro Seguros — Landing Page
 * Carrossel, formulários condicionais, rodízio WhatsApp
 */

(function () {
  'use strict';

  const DEFAULT_WHATSAPP = '5581996581999';

  const CITY_CONTACTS = {
    bonito: [{ number: '558194307502', label: 'Escritório Bonito PE' }],
    catende: [{ number: '558195673348', label: 'Escritório Catende PE' }],
    caruaru: [
      { number: '5581996581999', label: 'Escritório Caruaru PE' },
      { number: '5581997302611', label: 'Monique — Caruaru' }
    ]
  };

  const cityRotationIndex = { caruaru: 0 };

  // --- Seletores ---
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const tabs = document.querySelectorAll('.services__tab');
  const panels = document.querySelectorAll('.service-panel');
  const forms = document.querySelectorAll('.quote-form');
  const quoteFormsWrapper = document.getElementById('quoteForms');
  const openFormBtns = document.querySelectorAll('.btn--open-form');
  const backBtns = document.querySelectorAll('.quote-form__back');
  const navLinks = document.querySelectorAll('.header__link, .hero .btn');

  // =============================================
  // Menu mobile
  // =============================================
  function toggleMenu() {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    mainNav.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    if (!quoteFormsWrapper.classList.contains('is-open')) {
      document.body.style.overflow = '';
    }
  }

  menuToggle.addEventListener('click', toggleMenu);
  navLinks.forEach(function (link) { link.addEventListener('click', closeMenu); });

  // =============================================
  // Header scroll
  // =============================================
  function handleScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // =============================================
  // Carrossel do hero
  // =============================================
  function initHeroCarousel() {
    const carousel = document.getElementById('heroCarousel');
    const dotsContainer = document.getElementById('heroDots');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');

    if (!carousel) return;

    const slides = carousel.querySelectorAll('.hero__slide');
    let current = 0;
    let autoplayTimer;

    slides.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.className = 'hero__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Ir para slide ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.hero__dot');

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
      resetAutoplay();
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(function () { goTo(current + 1); }, 5000);
    }

    prevBtn.addEventListener('click', function () { goTo(current - 1); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); });
    resetAutoplay();
  }

  initHeroCarousel();

  // =============================================
  // Abas de serviços
  // =============================================
  function switchService(serviceId) {
    closeForm();
    tabs.forEach(function (tab) {
      const active = tab.dataset.service === serviceId;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active);
    });
    panels.forEach(function (panel) {
      const active = panel.dataset.service === serviceId;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { switchService(tab.dataset.service); });
  });

  // =============================================
  // Abrir / fechar formulário
  // =============================================
  function openForm(serviceId) {
    const target = document.getElementById('form-' + serviceId);
    if (!target) return;
    forms.forEach(function (f) { f.classList.remove('is-open'); });
    target.classList.add('is-open');
    quoteFormsWrapper.classList.add('is-open');
    quoteFormsWrapper.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeForm() {
    forms.forEach(function (f) { f.classList.remove('is-open'); });
    quoteFormsWrapper.classList.remove('is-open');
    quoteFormsWrapper.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openFormBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { openForm(btn.dataset.form); });
  });
  backBtns.forEach(function (btn) { btn.addEventListener('click', closeForm); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && quoteFormsWrapper.classList.contains('is-open')) closeForm();
  });

  // =============================================
  // Campos condicionais — Seguro Auto
  // =============================================
  function updateAllConditionals() {
    document.querySelectorAll('.is-conditional').forEach(function (group) {
      const trigger = document.getElementById(group.dataset.showWhen);
      if (!trigger) return;
      const show = trigger.value === group.dataset.showValue;
      group.hidden = !show;
      group.querySelectorAll('input, select, textarea').forEach(function (field) {
        field.required = show;
        if (!show) { field.value = ''; field.classList.remove('is-invalid'); }
      });
    });
  }

  function initConditionalFields() {
    document.querySelectorAll('.is-conditional').forEach(function (group) {
      const trigger = document.getElementById(group.dataset.showWhen);
      if (!trigger || trigger.dataset.conditionalBound) return;
      trigger.dataset.conditionalBound = 'true';
      trigger.addEventListener('change', updateAllConditionals);
    });
    updateAllConditionals();
  }

  initConditionalFields();

  // =============================================
  // Toggle PF / PJ — Odontológico
  // =============================================
  let odontoToggleInitialized = false;

  function setOdontoTipo(tipo) {
    const tipoInput = document.getElementById('odonto-tipo-pessoa');
    const pfSection = document.getElementById('odonto-pf');
    const pjSection = document.getElementById('odonto-pj');
    const toggleBtns = document.querySelectorAll('#form-odonto .form-toggle__btn');

    tipoInput.value = tipo;
    toggleBtns.forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.toggle === tipo);
    });
    pfSection.hidden = tipo !== 'pf';
    pjSection.hidden = tipo !== 'pj';
    pfSection.querySelectorAll('input').forEach(function (f) {
      f.required = tipo === 'pf';
      if (tipo !== 'pf') { f.value = ''; f.classList.remove('is-invalid'); }
    });
    pjSection.querySelectorAll('input').forEach(function (f) {
      f.required = tipo === 'pj';
      if (tipo !== 'pj') { f.value = ''; f.classList.remove('is-invalid'); }
    });
  }

  function initOdontoToggle() {
    if (odontoToggleInitialized) {
      setOdontoTipo('pf');
      return;
    }
    const toggleBtns = document.querySelectorAll('#form-odonto .form-toggle__btn');
    if (!toggleBtns.length) return;
    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () { setOdontoTipo(btn.dataset.toggle); });
    });
    odontoToggleInitialized = true;
    setOdontoTipo('pf');
  }

  initOdontoToggle();

  // =============================================
  // Rodízio de WhatsApp por cidade
  // =============================================
  function normalizeCity(city) {
    return city.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function getWhatsAppNumber(city) {
    if (!city) return DEFAULT_WHATSAPP;

    const normalized = normalizeCity(city);

    if (normalized.includes('bonito')) return CITY_CONTACTS.bonito[0].number;
    if (normalized.includes('catende')) return CITY_CONTACTS.catende[0].number;

    if (normalized.includes('caruaru')) {
      const contacts = CITY_CONTACTS.caruaru;
      const contact = contacts[cityRotationIndex.caruaru % contacts.length];
      cityRotationIndex.caruaru++;
      return contact.number;
    }

    return DEFAULT_WHATSAPP;
  }

  // =============================================
  // Mensagens WhatsApp personalizadas
  // =============================================
  const messageBuilders = {
    auto: function (d) {
      const lines = [
        '*Cotação — Seguro Automotivo*',
        '',
        'Olá, equipe Carneiro Seguros! Gostaria de uma cotação de seguro auto.',
        '',
        '*Dados do solicitante:*',
        '• CPF: ' + d.cpf,
        '• Cidade: ' + d.cidade,
        '• Telefone: ' + d.telefone,
        '• Estado civil: ' + d.estado_civil,
        '',
        '*Dados do veículo:*',
        '• Placa e chassi: ' + d.placa_chassi,
        '• Modelo: ' + d.modelo,
        '• CEP da garagem: ' + d.cep,
        '• Uso predominante: ' + d.uso_predominante
      ];

      if (d.uso_predominante === 'Ir trabalhar' && d.estacionamento_trabalho) {
        lines.push('• Estacionamento no trabalho: ' + d.estacionamento_trabalho);
      }

      lines.push(
        '• Principal condutor: ' + d.principal_condutor,
        '• Dono do veículo: ' + d.dono_veiculo
      );

      if (d.dono_veiculo === 'Não') {
        lines.push('• CPF do dono: ' + d.dono_cpf);
        lines.push('• Nascimento do dono: ' + d.dono_nascimento);
      }

      lines.push('• Cobertura 18-26 anos: ' + d.cobertura_jovem);
      if (d.cobertura_jovem === 'Sim' && d.cobertura_sexo) {
        lines.push('• Cobertura para: ' + d.cobertura_sexo);
      }

      lines.push('', 'Aguardo retorno com a melhor proposta. Obrigado!');
      return lines.join('\n');
    },

    consorcio: function (d) {
      return [
        '*Cotação — Consórcio*',
        '',
        'Olá, equipe Carneiro Seguros! Tenho interesse em um consórcio.',
        '',
        '• Nome: ' + d.nome,
        '• Cidade: ' + d.cidade,
        '• Telefone: ' + d.telefone,
        '• Tipo: ' + d.tipo,
        '• Valor do bem: ' + d.valor,
        '• Prazo estimado: ' + d.prazo,
        '',
        'Aguardo retorno. Obrigado!'
      ].join('\n');
    },

    saude: function (d) {
      return [
        '*Cotação — Plano de Saúde*',
        '',
        'Olá, equipe Carneiro Seguros! Gostaria de uma cotação de plano de saúde.',
        '',
        '• Nome: ' + d.nome,
        '• Cidade: ' + d.cidade,
        '• Telefone: ' + d.telefone,
        '• Beneficiários: ' + d.beneficiarios,
        '• Faixa etária: ' + d.faixa_etaria,
        '',
        'Aguardo retorno. Obrigado!'
      ].join('\n');
    },

    solar: function (d) {
      return [
        '*Cotação — Energia Solar*',
        '',
        'Olá, equipe Carneiro Seguros! Tenho interesse em energia solar.',
        '',
        '• Nome: ' + d.nome,
        '• Cidade: ' + d.cidade,
        '• Telefone: ' + d.telefone,
        '• Tipo de imóvel: ' + d.tipo_imovel,
        '• Conta de luz: ' + d.conta_luz,
        '',
        'Aguardo retorno. Obrigado!'
      ].join('\n');
    },

    vida: function (d) {
      return [
        '*Cotação — Seguro de Vida*',
        '',
        'Olá, equipe Carneiro Seguros! Gostaria de uma cotação de seguro de vida.',
        '',
        '• Nome: ' + d.nome,
        '• CPF: ' + d.cpf,
        '• Nascimento: ' + d.nascimento,
        '• Cidade: ' + d.cidade,
        '• Telefone: ' + d.telefone,
        '',
        '*Interesse:*',
        d.interesse,
        '',
        'Aguardo retorno. Obrigado!'
      ].join('\n');
    },

    odonto: function (d) {
      if (d.tipo_pessoa === 'pj') {
        return [
          '*Cotação — Plano Odontológico (PJ)*',
          '',
          'Olá, equipe Carneiro Seguros! Tenho interesse em plano odontológico empresarial.',
          '',
          '• Empresa: ' + d.pj_empresa,
          '• CNPJ: ' + d.pj_cnpj,
          '• Pessoas: ' + d.pj_pessoas,
          '• E-mail: ' + d.pj_email,
          '• Telefone: ' + d.pj_telefone,
          '• CEP: ' + d.pj_cep,
          '• Cidade: ' + d.pj_cidade,
          '',
          'Aguardo retorno. Obrigado!'
        ].join('\n');
      }

      return [
        '*Cotação — Plano Odontológico (PF)*',
        '',
        'Olá, equipe Carneiro Seguros! Tenho interesse em plano odontológico.',
        '',
        '• Nome: ' + d.pf_nome,
        '• CPF: ' + d.pf_cpf,
        '• Nascimento: ' + d.pf_nascimento,
        '• Cidade: ' + d.pf_cidade,
        '',
        'Aguardo retorno. Obrigado!'
      ].join('\n');
    },

    previdencia: function (d) {
      return [
        '*Cotação — Previdência Privada*',
        '',
        'Olá, equipe Carneiro Seguros! Tenho interesse em previdência privada.',
        '',
        '• Nome: ' + d.nome,
        '• CPF: ' + d.cpf,
        '• RG: ' + d.rg,
        '• Nascimento: ' + d.nascimento,
        '• Endereço: ' + d.endereco,
        '• Cidade: ' + d.cidade,
        '• E-mail: ' + d.email,
        '• Telefone: ' + d.telefone,
        '• Profissão e renda: ' + d.profissao_renda,
        '• Tipo: ' + d.tipo_previdencia,
        '• Imposto: ' + d.imposto,
        '',
        'Aguardo retorno. Obrigado!'
      ].join('\n');
    }
  };

  // =============================================
  // Coleta, validação e envio
  // =============================================
  function getFormData(form) {
    const data = {};
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      if (!el.name) return;
      const group = el.closest('.is-conditional');
      if (group && group.hidden) return;
      const section = el.closest('[hidden]');
      if (section) return;
      data[el.name] = el.value.trim();
    });
    return data;
  }

  function getCityFromData(data) {
    return data.cidade || data.pf_cidade || data.pj_cidade || '';
  }

  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.classList.remove('is-invalid');
      const group = field.closest('.is-conditional');
      if (group && group.hidden) return;
      const section = field.closest('[hidden]');
      if (section) return;
      if (field.required && !field.value.trim()) {
        field.classList.add('is-invalid');
        valid = false;
      }
    });
    return valid;
  }

  function sendToWhatsApp(product, data) {
    const builder = messageBuilders[product];
    if (!builder) return;
    const city = getCityFromData(data);
    const number = getWhatsAppNumber(city);
    const message = builder(data);
    window.open('https://wa.me/' + number + '?text=' + encodeURIComponent(message), '_blank');
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const product = form.dataset.product;
    const submitBtn = form.querySelector('.btn--submit');

    if (!validateForm(form)) return;

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    const data = getFormData(form);

    setTimeout(function () {
      sendToWhatsApp(product, data);
      submitBtn.textContent = 'Mensagem enviada!';
      submitBtn.style.background = '#c6f6d5';

      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        form.reset();
        updateAllConditionals();
        setOdontoTipo('pf');
        closeForm();
      }, 2500);
    }, 600);
  }

  document.querySelectorAll('.quote-form__form').forEach(function (form) {
    form.addEventListener('submit', handleFormSubmit);
  });

  // =============================================
  // Animações on-scroll
  // =============================================
  function initScrollAnimations() {
    const targets = document.querySelectorAll('.service-panel__content, .quote-form__inner, .footer__grid');
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    targets.forEach(function (el) { observer.observe(el); });
  }

  initScrollAnimations();

})();
