var utilities = (function() {
  "use strict";

  function whichAnimationEvent() {
    var a,
        el = document.createElement('fakeelement'),
        animations = {
          'animation':'animationend',
          'OAnimation':'oAnimationEnd',
          'MozTransition':'animationend',
          'WebkitTransition':'webkitAnimationEnd'
        };

    for (a in animations){
      if(el.style[a] !== undefined){
        return animations[a];
      }
    }
  }

  function whichTransitionEvent() {
    var t,
        el = document.createElement('fakeelement'),
        transitions = {
          'transition':'transitionend',
          'OTransition':'oTransitionEnd',
          'MozTransition':'transitionend',
          'WebkitTransition':'webkitTransitionEnd'
        };

    for (t in transitions){
      if (el.style[t] !== undefined){
        return transitions[t];
      }
    }
  }

  function isTouchDevice() {
    return document.querySelector("html").classList.contains('touch');
  }

  return {
    whichAnimationEvent  : whichAnimationEvent,
    whichTransitionEvent : whichTransitionEvent,
    isTouchDevice        : isTouchDevice
  };
})();
;var main = (function() {
  "use strict";

  var transitionend  = utilities.whichTransitionEvent(),
      animationend   = utilities.whichAnimationEvent(),
      click_touch    = utilities.isTouchDevice() ? "touchstart" : "click",
      main           = document.querySelector("main"),
      body           = document.querySelector("body"),
      container      = document.querySelector(".container"),
      nav            = document.querySelector("[role=navigation]"),
      content_pusher = document.querySelector(".content-pusher"),
      back_to_top    = document.querySelector("#back-to-top");

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

    enableMobileScrolling();
    body.classList.remove("menu-open");
    nav.setAttribute("aria-hidden", "true");

    setTimeout(function() {
      body.classList.remove("transitions-off");
    });
  }

  function preventDefault(e) {
    if (e.preventDefault()) {
      e.preventDefault();
    } else {
      return false;
    }
  }

  function disableMobileScrolling() {
    content_pusher.addEventListener("touchstart", preventDefault);
    content_pusher.addEventListener("touchmove", preventDefault);
  }

  function enableMobileScrolling() {
    content_pusher.removeEventListener("touchstart", preventDefault);
    content_pusher.removeEventListener("touchmove", preventDefault);
  }

  function toggleMenu() {
    if (body.classList.contains("menu-open")) {
      body.classList.remove("menu-open");
      nav.setAttribute("aria-hidden", "true");
      enableMobileScrolling();
    } else {
      body.classList.add("menu-open");
      nav.setAttribute("aria-hidden", "false");
      disableMobileScrolling();

      setTimeout(function() {
        nav.focus();
      }, 300);
    }
  }

  function backToTop() {
    var pos_from_top = window.pageYOffset,
        scrollEndHandler,
        removeListener;

    if (pos_from_top > 0) {

      if (document.querySelector("html").classList.contains("csstransforms3d")) {
        scrollEndHandler = function() {
          removeListener();
          container.removeAttribute("style");
          window.scrollTo(0, 0);
          body.classList.remove('body-scrolling');
        };

        removeListener = function() {
          container.removeEventListener(transitionend, scrollEndHandler);
        };

        body.classList.add('body-scrolling');

        container.style.overflowY = "scroll";
        window.scrollTop = 0;

        container.style.webkitTransition = 'all .5s ease-out';
        container.style.transition = 'all .5s ease-out';

        container.style.webkitTransform = "translateY(" + pos_from_top + "px)";
        container.style.transform = "translateY(" + pos_from_top + "px)";

        if (transitionend) {
          container.addEventListener(transitionend, scrollEndHandler, false);
        }
      } else {
        window.scrollTo(0, 0);
      }
    }
  }

  function bindings() {
    var toggle_menu = document.querySelector("#toggle-menu"),
        nav_links   = document.querySelectorAll(".nav-link"),
        ESC         = 27;

    [].forEach.call(nav_links, function(el) {
      el.addEventListener("click", function(e) {
        closeMenu(true);
      });
    });

    window.addEventListener("load", loaded);
    toggle_menu.addEventListener(click_touch, toggleMenu);
    back_to_top.addEventListener(click_touch, backToTop);

    document.onkeydown = function(e) {
      if (e.keyCode === ESC) {
        closeMenu();
      }
    };

    document.addEventListener("touchstart", function(){}, true);
  }

  function chain(obj) {
    var waiting_for = document.querySelector(obj.waiting_for),
        next_up     = document.querySelector(obj.next_up),
        apply       = obj.apply;

    function applyClass() {
      next_up.classList.add(apply);
    }

    if (transitionend) {
      waiting_for.addEventListener(transitionend, applyClass, false);
    }
  }

  function loadTemplate(template, destination) {
    var t           = document.querySelector(template),
        clone       = document.importNode(t.content, true);

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
