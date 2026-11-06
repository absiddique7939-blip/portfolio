/* ==========================================================================
   Abubakker Siddique — Portfolio interactions
   Vanilla JavaScript · no dependencies
   ========================================================================== */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------------
     1. Header: add shadow after scrolling + reading progress bar
     --------------------------------------------------------------- */
  const header = document.getElementById("header");
  const progressBar = document.getElementById("scroll-progress");
  const backTop = document.getElementById("back-top");

  function onScroll() {
    const y = window.scrollY;

    if (header) {
      header.classList.toggle("scrolled", y > 10);
    }

    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const percent = max > 0 ? (y / max) * 100 : 0;
      progressBar.style.width = percent + "%";
    }

    if (backTop) {
      backTop.classList.toggle("show", y > 500);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------
     2. Mobile navigation
     --------------------------------------------------------------- */
  const navToggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("nav");

  function closeMenu() {
    if (!nav || !navToggle) return;
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    // Close the menu after choosing a link
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Close with Escape
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    // Close if the viewport is resized back to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---------------------------------------------------------------
     3. Scroll reveal animations
     --------------------------------------------------------------- */
  const revealItems = document.querySelectorAll(".reveal");
  const supportsIO = "IntersectionObserver" in window;

  if (!supportsIO || prefersReducedMotion) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  }

  /* ---------------------------------------------------------------
     4. Animated skill bars
     --------------------------------------------------------------- */
  const skillGroups = document.querySelectorAll("[data-skills]");

  function showSkillBars(group) {
    group.classList.add("is-visible");
  }

  if (!supportsIO || prefersReducedMotion) {
    skillGroups.forEach(showSkillBars);
  } else {
    const skillObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            showSkillBars(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    skillGroups.forEach(function (group) {
      skillObserver.observe(group);
    });
  }

  /* ---------------------------------------------------------------
     5. Active navigation link based on the section in view
     --------------------------------------------------------------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link[href^='#']");

  if (supportsIO && sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          navLinks.forEach(function (link) {
            const isActive =
              link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("active", isActive);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ---------------------------------------------------------------
     6. Footer year
     --------------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------------
     7. Contact form (front-end demo)
     --------------------------------------------------------------- */
  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");

  if (form && note) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = form.elements["name"].value.trim();
      const email = form.elements["email"].value.trim();
      const subject = form.elements["subject"].value.trim();
      const message = form.elements["message"].value.trim();

      if (!name || !email || !subject || !message) {
        note.textContent = "Please fill in every field before sending.";
        note.classList.add("error");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        note.textContent = "Please enter a valid email address.";
        note.classList.add("error");
        return;
      }

      // Demo only — this does not send an email yet.
      // Hook it up to Formspree, Netlify Forms, or a backend later.
      note.classList.remove("error");
      note.textContent =
        "Thank you, " +
        name +
        ". Your message looks good — connect a form service to deliver it for real.";
      form.reset();
    });
  }
})();
