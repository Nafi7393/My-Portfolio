/* ======================================================================
   main.js – FULL rebuild without AJAX‑page loading or custom scrollbars
   Requires the same front‑end libraries you already include:
   jQuery, GSAP, ScrollMagic, Swiper, Isotope, EasyPieChart, Typed.js,
   Magnific‑Popup, bxSlider.
   ====================================================================== */

"use strict";

/*--------------------------------------------------------------
  0.  PRELOADER
--------------------------------------------------------------*/
$(window).on("load", function () {
  gsap.to(".preloader .circle", { duration: 0.7, strokeDashoffset: 0, delay: 1 });
  gsap.to(".loading", { duration: 0.7, y: -100, autoAlpha: 0, delay: 1.7 });
  gsap.to("#loader", { duration: 3, y: -3000, ease: "expo.out", delay: 2 });

  setTimeout(() => $("#loader").remove(), 3000);

  /*  Everything else boots after the page assets are ready  */
  restoreNativeScroll(); // <— critical so the site scrolls again
  initSiteScripts();
});

/*--------------------------------------------------------------
  1.  ENABLE NORMAL SCROLLING
      (removes fixed/hidden overflow left behind by Scrollbar.js)
--------------------------------------------------------------*/
function restoreNativeScroll() {
  /* If the template still wraps everything in #page-scroll,
     make sure that wrapper can actually scroll. */
  const pg = document.getElementById("page-scroll");
  if (pg) {
    pg.style.overflowY = "visible";
    pg.style.maxHeight = "none";
    pg.style.height = "auto";
  }
  /* Re‑enable browser scrolling on <html> and <body> */
  document.documentElement.style.overflow = "auto";
  document.body.style.overflow = "auto";
}

/*--------------------------------------------------------------
  2.  MASTER INITIALISER
--------------------------------------------------------------*/
function initSiteScripts() {
  headerOptions(); // header / hamburger
  lightbox(); // Magnific‑Popup
  videoPlayHandlers(); // hover‑play videos & hero loop
  scrollAnimations(); // GSAP + ScrollMagic reveals
  chartAnimations(); // EasyPieChart + skill bars
  runTypedLoops(); // Typed.js headline loop
  clientSlider(); // bxSlider ticker
  isotopeGrids(); // Isotope portfolio/blog filter
  workSlider(); // Swiper – work carousel
  testimonialSlider(); // Swiper – testimonial carousel
  certificateSlider(); // Swiper – certificates
  updateYear(); // dynamic © year
}

/*--------------------------------------------------------------
  3.  IMAGE LIGHTBOX (Magnific‑Popup)
--------------------------------------------------------------*/
function lightbox() {
  if (!$(".lightbox").length) return;
  $(".lightbox")
    .attr("data-barba-prevent", "all") // harmless leftover attribute
    .magnificPopup({
      type: "image",
      gallery: { enabled: true },
      zoom: { enabled: true, duration: 300 },
    });
}

/*--------------------------------------------------------------
  4.  VIDEO HANDLERS
--------------------------------------------------------------*/
function videoPlayHandlers() {
  /* Pause inline videos at first render */
  $(".video-wrapper video").each((_, v) => v.pause());

  /* Hover‑to‑play thumbnails */
  $(".grid-video").hover(
    function () {
      $(this).find("video")[0].play();
    },
    function () {
      $(this).find("video")[0].pause();
    }
  );

  /* Autoplay hero banner videos */
  $(".work-hero video").each((_, v) => v.play());
}

/*--------------------------------------------------------------
  5.  SCROLL‑TRIGGERED ANIMATIONS  (GSAP + ScrollMagic)
--------------------------------------------------------------*/
function scrollAnimations() {
  if (!$(".scroll-animation-on").length) return;

  const controller = new ScrollMagic.Controller();

  /* Fade / move‑up / scale‑in */
  $(".classic-animation").each(function () {
    const d = $(this).data("delay") || 0;
    const dur = $(this).data("duration") || 1;
    new ScrollMagic.Scene({ triggerElement: this, offset: -500, reverse: false })
      .setTween(
        gsap.to(this, { duration: dur, autoAlpha: 1, y: 0, scale: 1, delay: d, ease: "expo.out" })
      )
      .addTo(controller);
  });

  /* Clip‑path reveal */
  $(".clip-animation").each(function () {
    const d = $(this).data("delay") || 0;
    const dur = $(this).data("duration") || 1;
    new ScrollMagic.Scene({ triggerElement: this, offset: -650, reverse: false })
      .setTween(
        gsap.to(this, {
          duration: dur,
          clipPath: "polygon(-2% 0%,100% 0%,105% 100%,0% 100%)",
          delay: d,
          ease: "expo.out",
        })
      )
      .addTo(controller);
  });

  /* Vertical scale‑in */
  $(".scale-animation").each(function () {
    const d = $(this).data("delay") || 0;
    const dur = $(this).data("duration") || 1;
    new ScrollMagic.Scene({ triggerElement: this, offset: -500, reverse: false })
      .setTween(
        gsap.to(this, { duration: dur, scaleY: 1, autoAlpha: 1, y: 0, delay: d, ease: "expo.out" })
      )
      .addTo(controller);
  });
}

/*--------------------------------------------------------------
  6.  PIE‑CHARTS & SKILL BARS
--------------------------------------------------------------*/
function chartAnimations() {
  if (!$(".chart").length) return;

  const bigScreen = $(window).width() >= 991;
  const chartSize = bigScreen ? 150 : 100;
  const chartLine = bigScreen ? 8 : 6;
  const trackColor = $("body").hasClass("dark-version") ? "#363636" : "#000";

  $(".chart").easyPieChart({
    barColor: "#D1ED5D",
    scaleColor: "#D1ED5D",
    trackColor: trackColor,
    size: chartSize,
    lineWidth: chartLine,
    lineCap: "square",
    onStep(a, b, c) {
      $(this.el).find(".percent").text(Math.round(c));
    },
  });

  /* Horizontal bars */
  $(".skill-list .percentage").each(function () {
    gsap.to(this, { width: $(this).data("percent"), duration: 2, delay: 1, ease: "power2.out" });
  });
}

/*--------------------------------------------------------------
  7.  HEADLINE TYPER (Typed.js)
--------------------------------------------------------------*/
function runTypedLoops() {
  const $el = $(".element");
  if (!$el.length) return;

  const phrases = $el.data("values").split(",");
  const backDelay = (Number($el.data("backdelay")) || 2) * 1000;
  const loop = $el.data("loop") ?? false;

  $el.typed({ strings: phrases, loop, backDelay, typeSpeed: 20 });
}

/*--------------------------------------------------------------
  8.  CLIENT LOGO MARQUEE (bxSlider)
--------------------------------------------------------------*/
function clientSlider() {
  if (!$(".bxslider").length) return;
  $(".bxslider").bxSlider({
    minSlides: 1,
    maxSlides: 5,
    slideMargin: 0,
    ticker: true,
    infiniteLoop: true,
    speed: 30000,
  });
}

/*--------------------------------------------------------------
  9.  ISOTOPE  (portfolio & blog filtering)
--------------------------------------------------------------*/
function isotopeGrids() {
  if (!$(".masonry").length) return;

  const $grid = $(".masonry").isotope({
    itemSelector: ".grid-item",
    layoutMode: "masonry",
    transitionDuration: "0.5s",
    masonry: { columnWidth: ".grid-item" },
  });

  $(".portfolio_filter a").on("click", function (e) {
    e.preventDefault();
    $(".portfolio_filter a").removeClass("select-cat");
    $(this).addClass("select-cat");
    $grid.isotope({ filter: $(this).data("filter") });
  });
}

/*--------------------------------------------------------------
  10.  SWIPER SLIDERS
--------------------------------------------------------------*/
function workSlider() {
  new Swiper(".work-carousel", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: { el: ".swiper-pagination", clickable: true },
  });
}

function testimonialSlider() {
  new Swiper(".testimonial-carousel", {
    slidesPerView: 1,
    spaceBetween: 30,
    autoplay: { delay: 10000 },
    pagination: { el: ".swiper-pagination", clickable: true },
    breakpoints: { 1200: { slidesPerView: 3 }, 768: { slidesPerView: 2 } },
  });
}

function certificateSlider() {
  $(".certificate-carousel").each(function () {
    const $wrap = $(this);
    const slides = $wrap.find(".swiper-slide").length;
    $wrap.find(".swiper-pagination").toggle(slides > 1);

    new Swiper(this, {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: slides > 1,
      pagination: { el: $wrap.find(".swiper-pagination")[0], clickable: true },
    });
  });
}

/*--------------------------------------------------------------
  HEADER / HAMBURGER  —  fixed version
--------------------------------------------------------------*/
function headerOptions() {
  /* Give the list items a hidden start‑state */
  gsap.set("header nav ul li", { autoAlpha: 0, x: -30 });

  /* Timeline now starts reversed, ready to run forward first */
  const tl = gsap.timeline({ paused: true, reversed: true }).to("header nav ul li", {
    duration: 0.4,
    autoAlpha: 1,
    x: 0,
    stagger: 0.05,
    ease: "power2.out",
  });

  /* Toggle on hamburger click */
  $(".hamburger").on("click", function () {
    $(this).toggleClass("is-active");
    $("body").toggleClass("header-is-active");
    tl.reversed() ? tl.play() : tl.reverse();
  });

  /* Auto‑close the menu when a nav link is selected */
  $("header nav ul li a").on("click", function () {
    $(".hamburger").removeClass("is-active");
    $("body").removeClass("header-is-active");
    tl.reverse();
  });

  /* Simple sticky header (same as before) */
  $(window).on("scroll", () => {
    const y = $(window).scrollTop();
    $("header").css("top", y > 45 ? y : "");
  });

  /* One‑page section highlighting (unchanged) */
  if ($(".onepage").length) {
    $("header nav ul li a").on("click", function (e) {
      const href = $(this).attr("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        $("html, body").animate({ scrollTop: $(href).offset().top }, 800);
      }
    });

    $(window).on("scroll", () => {
      const pos = $(window).scrollTop() + 10;
      $("header nav ul li a").each(function () {
        const $link = $(this);
        const $sec = $($link.attr("href"));
        if ($sec.length) {
          if ($sec.offset().top <= pos && $sec.offset().top + $sec.outerHeight() > pos) {
            $("header nav ul li a").removeClass("active");
            $link.addClass("active");
          } else {
            $link.removeClass("active");
          }
        }
      });
    });
  }
}

/*--------------------------------------------------------------
  13.  FOOTER YEAR
--------------------------------------------------------------*/
function updateYear() {
  $("#year").text(new Date().getFullYear());
}

/*--------------------------------------------------------------
  END OF FILE
--------------------------------------------------------------*/
