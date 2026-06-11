/**
 * Carneiro Seguros — Landing Page
 * Menu mobile, abas de serviço, scroll e envio via WhatsApp
 */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '5581996581999';

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

  // --- Menu mobile ---
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
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', toggleMenu);

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // --- Header com sombra ao scroll ---
  function handleScroll() {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Abas de serviços ---
  function switchService(serviceId) {
    closeForm();

    tabs.forEach(function (tab) {
      const isActive = tab.dataset.service === serviceId;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive);
    });

    panels.forEach(function (panel) {
      const isActive = panel.dataset.service === serviceId;
      panel.classList.toggle('is-active', isActive);
      panel.hidden = !isActive;
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      switchService(tab.dataset.service);
    });
  });

  // --- Abrir / fechar formulário (overlay) ---
  function openForm(serviceId) {
    const targetForm = document.getElementById('form-' + serviceId);

    if (!targetForm) return;

    forms.forEach(function (form) {
      form.classList.remove('is-open');
    });

    targetForm.classList.add('is-open');
    quoteFormsWrapper.classList.add('is-open');
    quoteFormsWrapper.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeForm() {
    forms.forEach(function (form) {
      form.classList.remove('is-open');
    });

    quoteFormsWrapper.classList.remove('is-open');
    quoteFormsWrapper.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openFormBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      openForm(btn.dataset.form);
    });
  });

  backBtns.forEach(function (btn) {
    btn.addEventListener('click', closeForm);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && quoteFormsWrapper.classList.contains('is-open')) {
      closeForm();
    }
  });

  // --- Montagem de mensagens personalizadas por produto ---
  const messageBuilders = {
    auto: function (data) {
      return [
        '🚗 *Cotação — Seguro Automotivo*',
        '',
        'Olá, equipe Carneiro Seguros! Gostaria de uma cotação de seguro auto.',
        '',
        '*Dados do solicitante:*',
        `• CPF: ${data.cpf}`,
        `• Telefone: ${data.telefone}`,
        '',
        '*Dados do veículo:*',
        `• Placa e chassi: ${data.placa_chassi}`,
        `• Modelo: ${data.modelo}`,
        `• Estado civil: ${data.estado_civil}`,
        `• CEP da garagem: ${data.cep}`,
        `• Uso do veículo: ${data.uso}`,
        `• Garagem: ${data.garagem}`,
        '',
        'Aguardo retorno com a melhor proposta. Obrigado!'
      ].join('\n');
    },

    consorcio: function (data) {
      return [
        '🏠 *Cotação — Consórcio*',
        '',
        'Olá, equipe Carneiro Seguros! Tenho interesse em um consórcio.',
        '',
        '*Dados do solicitante:*',
        `• Nome: ${data.nome}`,
        `• Telefone: ${data.telefone}`,
        '',
        '*Detalhes do consórcio:*',
        `• Tipo: ${data.tipo}`,
        `• Valor do bem desejado: ${data.valor}`,
        `• Prazo estimado: ${data.prazo}`,
        '',
        'Aguardo retorno com as melhores condições. Obrigado!'
      ].join('\n');
    },

    saude: function (data) {
      return [
        '🏥 *Cotação — Plano de Saúde*',
        '',
        'Olá, equipe Carneiro Seguros! Gostaria de uma cotação de plano de saúde.',
        '',
        '*Dados do solicitante:*',
        `• Nome: ${data.nome}`,
        `• Cidade: ${data.cidade}`,
        `• Telefone: ${data.telefone}`,
        '',
        '*Detalhes do plano:*',
        `• Número de beneficiários: ${data.beneficiarios}`,
        `• Faixa etária dos beneficiários: ${data.faixa_etaria}`,
        '',
        'Aguardo retorno com a melhor proposta. Obrigado!'
      ].join('\n');
    },

    solar: function (data) {
      return [
        '☀️ *Cotação — Energia Solar*',
        '',
        'Olá, equipe Carneiro Seguros! Tenho interesse em energia solar.',
        '',
        '*Dados do solicitante:*',
        `• Nome: ${data.nome}`,
        `• Cidade: ${data.cidade}`,
        `• Telefone: ${data.telefone}`,
        '',
        '*Detalhes do imóvel:*',
        `• Tipo de imóvel: ${data.tipo_imovel}`,
        `• Valor médio da conta de luz: ${data.conta_luz}`,
        '',
        'Aguardo retorno com um projeto personalizado. Obrigado!'
      ].join('\n');
    }
  };

  // --- Coleta dados do formulário ---
  function getFormData(form) {
    const data = {};
    const elements = form.querySelectorAll('input, select');

    elements.forEach(function (el) {
      if (el.name) {
        data[el.name] = el.value.trim();
      }
    });

    return data;
  }

  // --- Validação básica ---
  function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('input, select');

    fields.forEach(function (field) {
      field.classList.remove('is-invalid');

      if (!field.checkValidity() || !field.value.trim()) {
        field.classList.add('is-invalid');
        isValid = false;
      }
    });

    return isValid;
  }

  // --- Abre WhatsApp com mensagem formatada ---
  function sendToWhatsApp(product, data) {
    const builder = messageBuilders[product];

    if (!builder) return;

    const message = builder(data);
    const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
    window.open(url, '_blank');
  }

  // --- Simulação de envio com feedback visual ---
  function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const product = form.dataset.product;
    const submitBtn = form.querySelector('.btn--submit');

    if (!validateForm(form)) {
      return;
    }

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
        closeForm();
      }, 2500);
    }, 600);
  }

  document.querySelectorAll('.quote-form__form').forEach(function (form) {
    form.addEventListener('submit', handleFormSubmit);
  });

  // --- Animações on-scroll (Intersection Observer) ---
  function initScrollAnimations() {
    const targets = document.querySelectorAll(
      '.service-panel__content, .quote-form__inner, .footer__grid'
    );

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  initScrollAnimations();

})();
