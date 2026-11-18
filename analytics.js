/* Dürr Dental LP — GA4 custom events. Set the measurement ID in index.html. */
(function () {
  'use strict';
  function send(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }
  var products = { compressor: 'duo_tandem', suction: 'tyscor_vs4' };
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (link.classList.contains('support-contact-button')) {
      var method = href.indexOf('tel:') === 0 ? 'phone' : href.indexOf('mailto:') === 0 ? 'email' : /lin\.ee/.test(href) ? 'line' : 'other';
      send('contact_click', { contact_method: method, link_location: 'contact_section' });
    }
    if (link.classList.contains('showcase-button')) {
      var id = href.replace('#', '');
      if (products[id]) send('product_detail_click', { product_name: products[id] });
    }
    if (link.classList.contains('interview-video') || link.classList.contains('desktop-video-link')) {
      send('interview_video_click', { video_name: 'clinic_interview', link_location: link.classList.contains('desktop-video-link') ? 'desktop_side' : 'main_lp' });
    }
  });
  var sections = [
    ['products', 'products'], ['solutions', 'solutions'], ['interview', 'interview'],
    ['compressor', 'duo_tandem'], ['suction', 'tyscor_vs4'],
    ['support', 'support'], ['contact', 'contact']
  ];
  if ('IntersectionObserver' in window) {
    var root = window.matchMedia('(min-width: 801px)').matches ? document.querySelector('.phone-scroll') : null;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        send('section_view', { section_name: entry.target.dataset.analyticsSection });
        observer.unobserve(entry.target);
      });
    }, { root: root, threshold: 0.1 });
    sections.forEach(function (item) {
      var el = document.getElementById(item[0]);
      if (el) { el.dataset.analyticsSection = item[1]; observer.observe(el); }
    });
  }
  var milestones = [25, 50, 75, 90], reached = {};
  var scrollContainer = window.matchMedia('(min-width: 801px)').matches ? document.querySelector('.phone-scroll') : window;
  function checkScroll() {
    var desktop = scrollContainer !== window;
    var scrollTop = desktop ? scrollContainer.scrollTop : window.scrollY;
    var maxScroll = desktop ? scrollContainer.scrollHeight - scrollContainer.clientHeight : document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    var pct = scrollTop / maxScroll * 100;
    milestones.forEach(function (point) {
      if (pct >= point && !reached[point]) { reached[point] = true; send('lp_scroll_depth', { percent_scrolled: point }); }
    });
  }
  if (scrollContainer) scrollContainer.addEventListener('scroll', checkScroll, { passive: true });
})();
