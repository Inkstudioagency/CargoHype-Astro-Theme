/*
 * Form handler for Webflow-style forms (.w-form).
 *
 * Webflow's own handler posts to Webflow's servers, which only works on Webflow hosting.
 * This handler runs first (capture phase) and posts the form to the endpoint set in
 * `src/config/config.json` → `forms.endpoint` (Formspree, Getform, Basin, your own API…).
 * Leave the endpoint empty to show the success state without sending anything (demo mode).
 * It keeps Webflow's UX: the submit button shows `data-wait`, then `.w-form-done` or
 * `.w-form-fail` is revealed.
 */
(function () {
  var endpoint = document.documentElement.getAttribute('data-form-endpoint') || '';

  document.addEventListener(
    'submit',
    function (event) {
      var form = event.target;
      var wrapper = form && form.closest ? form.closest('.w-form') : null;
      if (!wrapper) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      var done = wrapper.querySelector('.w-form-done');
      var fail = wrapper.querySelector('.w-form-fail');
      var button = form.querySelector('[type="submit"]');
      var label = button ? button.value : '';
      if (button && button.getAttribute('data-wait')) button.value = button.getAttribute('data-wait');
      if (fail) fail.style.display = 'none';

      var finish = function (ok) {
        if (button) button.value = label;
        if (ok) {
          form.reset();
          form.style.display = 'none';
          if (done) done.style.display = 'block';
        } else if (fail) {
          fail.style.display = 'block';
        }
      };

      if (!endpoint) return finish(true);

      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
        .then(function (res) { finish(res.ok); })
        .catch(function () { finish(false); });
    },
    true
  );
})();
