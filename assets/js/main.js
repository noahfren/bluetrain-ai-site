/* BlueTrain AI, Inc. — site behaviour
   No dependencies, no build step. Loaded with `defer` on every page. */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- nav --- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close the mobile menu after following an in-page link.
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------- header --- */
  var header = document.querySelector(".site-header");

  if (header) {
    var setStuck = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    setStuck();
    window.addEventListener("scroll", setStuck, { passive: true });
  }

  /* ------------------------------------------------------------- reveal --- */
  var revealables = document.querySelectorAll(".reveal");

  if (revealables.length) {
    if (!("IntersectionObserver" in window)) {
      revealables.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry, i) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            // Stagger siblings slightly for a smoother cascade.
            var delay = Number(el.dataset.revealDelay || i * 70);
            setTimeout(function () {
              el.classList.add("is-visible");
            }, delay);
            observer.unobserve(el);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );

      revealables.forEach(function (el) {
        observer.observe(el);
      });
    }
  }

  /* ---------------------------------------------------------------- year --- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------------------------------------------------------------- form --- */
  var form = document.querySelector("[data-contact-form]");

  if (form) {
    var status = document.getElementById("form-status");
    var submitBtn = form.querySelector('button[type="submit"]');

    var say = function (message, ok) {
      if (!status) return;
      status.textContent = message;
      status.className =
        "form-status is-visible " + (ok ? "form-status--ok" : "form-status--err");
    };

    var fieldValue = function (name) {
      var el = form.elements[name];
      return el && el.value ? el.value.trim() : "";
    };

    /* Builds a readable plain-text version of the submission, used both for
       the mailto fallback and as a convenience field for form backends. */
    var buildMessage = function () {
      return [
        "Name: " + fieldValue("name"),
        "Company: " + fieldValue("company"),
        "Department: " + fieldValue("department"),
        "Email: " + fieldValue("email"),
        "Phone: " + (fieldValue("phone") || "—"),
        "",
        "Primary Challenge:",
        fieldValue("challenge"),
      ].join("\n");
    };

    form.addEventListener("submit", function (e) {
      // Honeypot: silently accept and discard obvious bot submissions.
      if (fieldValue("website")) {
        e.preventDefault();
        say("Thank you — your message has been received.", true);
        form.reset();
        return;
      }

      if (!form.checkValidity()) return; // let the browser show its messages

      var endpoint = form.getAttribute("data-endpoint");

      // No backend configured yet → hand off to the visitor's mail client.
      if (!endpoint) {
        e.preventDefault();
        var mailto =
          "mailto:" +
          (form.getAttribute("data-email") || "info@bluetrain.ai") +
          "?subject=" +
          encodeURIComponent(
            "Workflow & AI Readiness Assessment — " +
              (fieldValue("company") || fieldValue("name"))
          ) +
          "&body=" +
          encodeURIComponent(buildMessage());
        window.location.href = mailto;
        say(
          "Opening your email client with the details filled in. If nothing happens, email us directly at " +
            (form.getAttribute("data-email") || "info@bluetrain.ai") +
            ".",
          true
        );
        return;
      }

      // Backend configured → post it in the background.
      e.preventDefault();
      var data = new FormData(form);
      data.set("message", buildMessage());

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.label = submitBtn.textContent;
        submitBtn.textContent = "Sending…";
      }

      fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          form.reset();
          say(
            "Thank you. Your request has been received — we'll be in touch within one business day.",
            true
          );
        })
        .catch(function () {
          say(
            "Something went wrong sending the form. Please email us directly at " +
              (form.getAttribute("data-email") || "info@bluetrain.ai") +
              ".",
            false
          );
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.label || "Submit";
          }
        });
    });
  }
})();
