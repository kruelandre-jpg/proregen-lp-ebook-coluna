(function () {
  'use strict';

  var cfg = window.LP_CONFIG || {};
  var form = document.getElementById('lead-form');
  var formWrap = document.getElementById('form-wrap');
  var thanks = document.getElementById('thank-you');
  var submitBtn = document.getElementById('submit-btn');
  var downloadBtn = document.getElementById('download-ebook');
  var bookCta = document.getElementById('book-cta');
  var bookCtaThanks = document.getElementById('book-cta-thanks');
  var waLinks = document.querySelectorAll('[data-wa]');

  var ebookUrl = cfg.ebookUrl || 'assets/Ebook-Proregen-Coluna-Ortobiologicos.pdf';
  var bookUrl = cfg.bookUrl || 'https://www.editoragente.com.br/doi-aqui--7520/p';
  var waNumber = (cfg.whatsappClinic || '54996891295').replace(/\D/g, '');

  if (downloadBtn) downloadBtn.href = ebookUrl;
  if (bookCta) bookCta.href = bookUrl;
  if (bookCtaThanks) bookCtaThanks.href = bookUrl;

  waLinks.forEach(function (el) {
    var msg = el.getAttribute('data-wa-msg') || 'Olá! Vi o ebook Coluna e ortobiológicos e gostaria de saber mais.';
    el.href = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(msg);
  });

  document.querySelectorAll('a[href="#formulario"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById('formulario');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  function digitsOnly(v) {
    return String(v || '').replace(/\D/g, '');
  }

  function formatWhatsApp(raw) {
    var d = digitsOnly(raw).slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 7) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  var waInput = document.getElementById('whatsapp');
  if (waInput) {
    waInput.addEventListener('input', function () {
      var pos = waInput.selectionStart;
      var before = waInput.value.length;
      waInput.value = formatWhatsApp(waInput.value);
      var after = waInput.value.length;
      try { waInput.setSelectionRange(pos + (after - before), pos + (after - before)); } catch (_) {}
    });
  }

  function validate(data) {
    var errors = {};
    if (!data.nome || data.nome.trim().length < 3) {
      errors.nome = 'Informe seu nome completo.';
    }
    var wa = digitsOnly(data.whatsapp);
    if (wa.length < 10 || wa.length > 11) {
      errors.whatsapp = 'Informe um WhatsApp válido com DDD.';
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.email = 'Informe um e-mail válido.';
    }
    if (!data.interesse) {
      errors.interesse = 'Selecione uma opção.';
    }
    return errors;
  }

  function showFieldErrors(errors) {
    ['nome', 'whatsapp', 'email', 'interesse'].forEach(function (field) {
      var el = document.getElementById('err-' + field);
      var input = document.getElementById(field);
      if (el) {
        el.textContent = errors[field] || '';
        el.hidden = !errors[field];
      }
      if (input) {
        if (errors[field]) input.setAttribute('aria-invalid', 'true');
        else input.removeAttribute('aria-invalid');
      }
    });
  }

  function buildFormBody(data) {
    var entries = cfg.entries || {};
    var params = new URLSearchParams();
    if (entries.nome) params.append(entries.nome, data.nome.trim());
    if (entries.whatsapp) params.append(entries.whatsapp, digitsOnly(data.whatsapp));
    if (entries.email) params.append(entries.email, data.email.trim());
    if (entries.interesse) params.append(entries.interesse, data.interesse);
    return params;
  }

  // Unificado 2026-11-01: envia para o Web App "Leads - Ebook PRP Proregen" (-> Zapier -> Notion CRM).
  // Sem consentimento LGPD para dado de saude nesta pagina: queixa/detalhe vao vazios.
  function submitToGoogleForms(data) {
    var url = (cfg.appsScriptUrl || '').trim();
    if (!url) { return Promise.resolve({ skipped: true }); }
    var params = new URLSearchParams();
    params.append('nome', data.nome.trim());
    params.append('whatsapp', digitsOnly(data.whatsapp));
    params.append('email', data.email.trim());
    params.append('cidade', '');
    params.append('queixa', '');
    params.append('detalhe', '');
    params.append('consentimento_saude', 'Nao');
    params.append('consentimento', 'Nao');
    params.append('origem', cfg.origem || 'lp-ebook-coluna');
    params.append('website', '');
    return fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString() });
  }

  function revealThankYou() {
    if (formWrap) formWrap.hidden = true;
    if (thanks) {
      thanks.hidden = false;
      thanks.setAttribute('tabindex', '-1');
      thanks.focus({ preventScroll: true });
      thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = {
        nome: (document.getElementById('nome') || {}).value || '',
        whatsapp: (document.getElementById('whatsapp') || {}).value || '',
        email: (document.getElementById('email') || {}).value || '',
        interesse: (document.getElementById('interesse') || {}).value || ''
      };

      var errors = validate(data);
      showFieldErrors(errors);
      if (Object.keys(errors).length) {
        var firstKey = Object.keys(errors)[0];
        var firstEl = document.getElementById(firstKey);
        if (firstEl) firstEl.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando…';
      }

      submitToGoogleForms(data)
        .catch(function (err) {
          console.warn('[Proregen LP] Form submit warning:', err);
        })
        .then(function () {
          revealThankYou();
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Baixar o ebook grátis';
          }
        });
    });
  }
})();
