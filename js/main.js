"use strict";
var main = (function() {
  var transitionend = utilities.whichTransitionEvent(),
      animationend  = utilities.whichAnimationEvent(),
      main          = document.querySelector("main"),
      body          = document.querySelector("body"),
      nav           = document.querySelector("[role=navigation]");

  function init() {
    bindings();
  }

  function loaded() {
    body.setAttribute("aria-busy", "false");
  }

  function closeMenu(transitions_off) {
    if (typeof transitions_off !== "undefined") {
      body.classList.add("transitions-off");
    }

    body.classList.remove("menu-open");
    nav.setAttribute("aria-hidden", "true");
    setTimeout(function() {
      body.classList.remove("transitions-off");
    });

  }

  function toggleMenu(fast_close) {
    if (body.classList.contains("menu-open")) {
      body.classList.remove("menu-open");
      nav.setAttribute("aria-hidden", "true");
    } else {
      body.classList.add("menu-open");
      nav.setAttribute("aria-hidden", "false");

      setTimeout(function() {
        nav.focus();
      }, 300);
    }
  }

  function bindings() {
    var toggle_menu    = document.querySelector("#toggle-menu"),
        content_pusher = document.querySelector(".content-pusher"),
        nav_links      = document.querySelectorAll(".nav-link"),
        ESC            = 27;

    [].forEach.call(nav_links, function(el) {
      el.addEventListener("click", function(e) {
        closeMenu(true);
      });
    });

    window.addEventListener("load", loaded);
    toggle_menu.addEventListener("click", toggleMenu);

    document.onkeydown = function(e) {
      if (e.keyCode === ESC) {
        closeMenu();
      }
    }

    document.addEventListener("touchstart", function(){}, true);
  }

  function chain(obj) {
    var waiting_for = document.querySelector(obj.waiting_for),
        next_up     = document.querySelector(obj.next_up),
        apply       = obj.apply;

    transitionend && waiting_for.addEventListener(transitionend, function() {
      next_up.classList.add(apply);
    });
  }

  function loadTemplate(template, destination) {
    var t           = document.querySelector(template),
        clone       = document.importNode(t.content, true),
        destination = document.querySelector(destination);

    destination.setAttribute("aria-busy", "true");
    destination.appendChild(clone);
    destination.setAttribute("aria-busy", "false");
  }

  return {
    init: init,
    chain: chain,
    loadTemplate: loadTemplate
  };

})();
