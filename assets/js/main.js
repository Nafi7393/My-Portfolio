"use strict";

/*----------------------------------------------------------------------*/
/* =  Preloader
/*----------------------------------------------------------------------*/
$(window).on("load", function () {
  gsap.to($(".preloader .circle"), 0.7, { strokeDashoffset: 0, delay: 1 });
  //gsap.to('.preloader .profile-image', {duration: 4, rotationX:360, delay:1.7, ease:Cubic.easeOut});

  gsap.to($(".loading"), 0.7, { y: -100, autoAlpha: 0, delay: 1.7 });
  gsap.to($("#loader"), 3, { y: -3000, delay: 2, ease: "easeOutExpo" });

  setTimeout(function () {
    $("#loader").remove();
  }, 3000);
});

function ajaxLoad() {
  header_options();
  testimonialSlider();
  workslider();
  certificateSlider();
  lightbox();
  ContactForm();
  videoPlay();
  charts();
  isotope();
  contactmap();
  setTimeout(() => {
    scrollAnimation();
  }, 1000);
  setTimeout(() => {
    typed();
    clientSlider();
  }, 250);

  isotope(); // existing isotope init
  contactmap();

  // **NEW**: init portfolio if we’re on that page
  if (document.getElementById("portfolio-container")) {
    loadPortfolio();
  }

  // animations, etc.
  setTimeout(scrollAnimation, 1000);
  setTimeout(() => {
    typed();
    clientSlider();
  }, 250);
}

setTimeout(() => {
  ajaxLoad();
}, 1000);

// BARBA JS
function delay(n) {
  n = n || 500;
  return new Promise((done) => {
    setTimeout(() => {
      done();
    }, n);
  });
}

barba.init({
  transitions: [
    {
      async leave(data) {
        const done = this.async();
        pageTransition();
        await delay(700);
        done();
      },

      async enter(data) {
        ajaxLoad();
        scrollbar.scrollTo(0, 0, 0);
        gsap.to(".page-cover", {
          "margin-top": "0px",
          autoAlpha: 1,
          delay: 0.4,
          ease: Power3.easeOut,
        });
        $(".page-cover").addClass("yoket");
        setTimeout(() => {
          $(".page-cover").removeClass("yoket");
        }, 1500);
      },
    },
  ],
});

function pageTransition() {
  var tl = new gsap.timeline({
    yoyo: false,
    reversed: false,
  });
  tl.to(".page-cover", 0.5, { "margin-top": "-50px", autoAlpha: 0, ease: Power3.easeOut }, "Start");
}

// MAGNIFIC POPUP
function lightbox() {
  if ($(".lightbox").length) {
    $(".lightbox").attr("data-barba-prevent", "all");
    $(".lightbox").magnificPopup({
      type: "image",
      gallery: { enabled: true },
      zoom: { enabled: true, duration: 300 },
    });
  }
}

// VIDEO HOVER PLAY
function videoPlay() {
  if ($(".video-wrapper").length) {
    setTimeout(() => {
      $("video").get(0).pause();
    }, 10);
  }

  if ($(".grid-item.grid-video").length) {
    $(".grid-video")
      .on("mouseenter", function () {
        $(this).find("video").get(0).play();
      })
      .on("mouseleave", function () {
        $(this).find("video").get(0).pause();
      });
  }

  if ($(".work-hero").length) {
    setTimeout(() => {
      $(".work-hero").find("video").get(0).play();
    }, 10);
  }
}

// SCROLL ANIMATION
function scrollAnimation() {
  if ($(".scroll-animation-on").length) {
    var controller = new ScrollMagic.Controller();
    $(".classic-animation").each(function () {
      var animationDelay = $(this).data("delay") ? $(this).data("delay") : 0;
      var animationDuration = $(this).data("duration") ? $(this).data("duration") : 1;

      // build a tween
      var tween = gsap.to($(this), animationDuration, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        delay: animationDelay,
        ease: "expo.out",
      });
      // build a scene
      var scene = new ScrollMagic.Scene({
        triggerElement: this,
        duration: 0,
        reverse: false,
        offset: -500,
      })
        .setTween(tween)
        .addTo(controller);
    });

    $(".clip-animation").each(function () {
      var animationDelay = $(this).data("delay") ? $(this).data("delay") : 0;
      var animationDuration = $(this).data("duration") ? $(this).data("duration") : 1;

      // build a tween
      var tween = gsap.to($(this), animationDuration, {
        clipPath: "polygon(-2% 0%, 100% 0%, 105% 100%, 0% 100%)",
        delay: animationDelay,
        ease: "expo.out",
      });
      // build a scene
      var scene = new ScrollMagic.Scene({
        triggerElement: this,
        duration: 0,
        reverse: false,
        offset: -650,
      })
        .setTween(tween)
        .addTo(controller);
    });

    $(".scale-animation").each(function () {
      var animationDelay = $(this).data("delay") ? $(this).data("delay") : 0;
      var animationDuration = $(this).data("duration") ? $(this).data("duration") : 1;

      // build a tween
      var tween = gsap.to($(this), animationDuration, {
        scaleY: 1,
        autoAlpha: 1,
        y: 0,
        delay: animationDelay,
        ease: "expo.out",
      });
      // build a scene
      var scene = new ScrollMagic.Scene({
        triggerElement: this,
        duration: 0,
        reverse: false,
        offset: -500,
      })
        .setTween(tween)
        .addTo(controller);
    });
  }
}

//CARTS
function charts() {
  if ($(".chart").length) {
    if ($(window).width() >= 991) {
      $(window).on("resize", function () {
        if ($(window).width() <= 991) {
          location.reload();
        }
      });
    } else {
      $(window).on("resize", function () {
        if ($(window).width() >= 991) {
          location.reload();
        }
      });
    }
  }

  $(".chart").each(function () {
    if ($(window).width() >= 991) {
      var charSize = 150;
      var charLine = 8;
    } else {
      var charSize = 100;
      var charLine = 6;
    }

    var bartrack = "#000";
    if ($("body").hasClass("dark-version")) {
      var bartrack = "#363636";
    }

    $(".chart").easyPieChart({
      barColor: "#D1ED5D",
      scaleColor: "#D1ED5D",
      trackColor: bartrack,
      size: charSize,
      lineWidth: charLine,
      lineCap: "square",
      onStep: function (a, b, c) {
        $(this.el).find(".percent").text(Math.round(c));
      },
    });
  });

  $(".skill-list li").each(function () {
    var percentBar = $(this).find(".percentage");
    gsap.to(percentBar, {
      width: percentBar.attr("data-percent"),
      duration: 2,
      delay: 2,
      ease: Power2.easeOut,
    });
  });
}

// HOME TYPED JS
function typed() {
  if ($(".element").length) {
    var animateSpan = jQuery(".element");
    var textWords = animateSpan.data("values");
    var textArray = textWords.split(",");
    var html = [];
    var back_delay = $(".element").data("backdelay") * 1000;

    for (var i = 0; i < textArray.length; i++) {
      html.push(textArray[i]);
    }

    $(".element").each(function () {
      $(this).typed({
        strings: html,
        loop: $(this).data("loop") ? $(this).data("loop") : false,
        backDelay: back_delay,
        typeSpeed: 20,
      });
    });
  }
}

//CLIENT SLIDER JS
function clientSlider() {
  $(".bxslider").bxSlider({
    minSlides: 1,
    maxSlides: 5,
    slideMargin: 0,
    ticker: true,
    infiniteLoop: true,
    speed: 30000,
  });
}

// SMOOTH SCROLL JS

var dampingValue = 0.2; // almost no lag

if ($(window).width() <= 1024) {
  dampingValue = 0.09; // still low on mobile
}

var scrollbar = Scrollbar.init(document.getElementById("page-scroll"), {
  damping: dampingValue,
  renderByPixels: false, // sharper scroll
  continuousScrolling: true, // optional
});

if ($(".onepage").length) {
  $("header nav ul li a").on("click", function (e) {
    e.preventDefault();
    $(document).off("scroll");
    $("header nav ul li a").removeClass("active");
    $(this).addClass("active");
    var target = $(this).attr("href");
    target = $(target);
    scrollbar.scrollTo(0, target.position().top, 1000);
  });
}

// fixed item
if ($("#fixed").length) {
  scrollbar.addListener(({ offset }) => {
    if (offset.y >= 45) {
      fixed.style.top = offset.y + "px";
    } else {
      $("header").removeAttr("style");
    }
  });
}

if ($(".onepage").length) {
  scrollbar.addListener(({ offset }) => {
    var scrollPos = offset.y;
    $("header nav ul li a").each(function () {
      var currLink = $(this);
      var refElement = $(currLink.attr("href"));
      if (
        refElement.position().top <= scrollPos &&
        refElement.position().top + refElement.height() > scrollPos
      ) {
        $("header nav ul li a").removeClass("active");
        currLink.addClass("active");
      } else {
        currLink.removeClass("active");
      }
    });
  });
}

function header_options() {
  var headerAnimation = new gsap.timeline({ yoyo: false, reversed: true });
  headerAnimation.pause();
  headerAnimation.to($("header nav ul li"), 0.4, {
    autoAlpha: 1,
    x: 0,
    stagger: 0.05,
    ease: Power2.easeOut,
  });

  $(".hamburger, header ul li a").on("click", function () {
    headerAnimation.reversed() ? headerAnimation.play() : headerAnimation.reverse();
    $("body").toggleClass("header-is-active");
  });
}

// isotope
function isotope() {
  if ($(".masonry").length) {
    var $container = $(".masonry");
    $container.isotope({
      itemSelector: ".grid-item",
      sortBy: "parseInt",
      gutter: 0,
      transitionDuration: "0.5s",
      columnWidth: ".grid-item",
    });
    $(".portfolio_filter ul li a").on("click", function () {
      $(".portfolio_filter ul li a").removeClass("select-cat");
      $(this).addClass("select-cat");
      var selector = $(this).attr("data-filter");
      $(".masonry").isotope({
        filter: selector,
        animationOptions: {
          duration: 750,
          easing: "linear",
          queue: false,
        },
      });
      return false;
    });
  }
}

// SWIPER JS
function workslider() {
  var swiper = new Swiper(".work-carousel", {
    slidesPerView: 1,
    spaceBetween: 30,
    autoplay: false,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

// SWIPER JS
function testimonialSlider() {
  var swiper = new Swiper(".testimonial-carousel", {
    slidesPerView: 1,
    spaceBetween: 30,
    autoplay: {
      delay: 10000,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      1200: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 2,
      },
    },
  });
}

function certificateSlider() {
  // grab all carousels
  document.querySelectorAll(".certificate-carousel").forEach((container) => {
    const slides = container.querySelectorAll(".swiper-slide").length;
    const pagination = container.querySelector(".swiper-pagination");
    const shouldLoop = slides > 1;

    // hide pagination if only one slide
    if (!shouldLoop) {
      pagination.style.display = "none";
    }

    var swiper = new Swiper(container, {
      slidesPerView: 1,
      spaceBetween: 30,
      autoplay: false,
      loop: shouldLoop,
      pagination: {
        el: pagination,
        clickable: true,
      },
    });
  });
}

//CONTACT FORM
function ContactForm() {
  if (jQuery("#contact-formular").length > 0) {
    $("#contactform").submit(function () {
      var action = $(this).attr("action");
      $("#message").slideUp(750, function () {
        $("#message").hide();
        $("#submit").attr("disabled", "disabled");
        $.post(
          action,
          {
            name: $("#name").val(),
            email: $("#email").val(),
            comments: $("#comments").val(),
          },
          function (data) {
            document.getElementById("message").innerHTML = data;
            $("#message").slideDown("slow");
            $("#contactform img.loader").fadeOut("slow", function () {
              $(this).remove();
            });
            $("#submit").removeAttr("disabled");
            if (data.match("success") != null) $("#contactform").slideUp("slow");
          }
        );
      });
      return false;
    });

    $("form .form-group input, form .form-group textarea,  form .form-group select").focus(
      function () {
        $(this).parents(".form-group").addClass("in");

        $("form .form-group input, form .form-group textarea,  form .form-group select").blur(
          function () {
            if (!$(this).val()) {
              $(this).parents(".form-group").removeClass("in");
            }
          }
        );
      }
    );
  }
} //End ContactForm

document.getElementById("year").textContent = new Date().getFullYear();

// Blog loading script
function loadBlogs() {
  const blogContainer = document.querySelector(".masonry.largrid");

  // Do nothing if container not found or already loaded
  if (!blogContainer || blogContainer.dataset.loaded === "true") return;

  fetch("data/blog-info.json")
    .then((response) => response.json())
    .then((blogs) => {
      blogs.forEach((blog, index) => {
        const delay = 0.2 + index * 0.1;
        const categories = blog.categories
          .map((cat) => `<a class="category" href="#" rel="category tag"><span>${cat}</span></a>`)
          .join("");

        const blogHTML = `
          <div class="col-xl-4 grid-item classic-animation" data-delay="${delay}" data-duration="2">
            <div class="blog-grid">
              <a href="${blog.url}" class="blog-grid-image">
                <img src="${blog.image}" alt="">
              </a>
              <div class="bottom-content">
                <div class="categories">${categories}</div>
                <a href="${blog.url}">
                  <h4 class="entry-title">${blog.title}</h4>
                </a>
                <div class="metas">
                  <a class="author" href="#">${blog.author}</a>
                  <div class="blog-date">${blog.date}</div>
                </div>
              </div>
            </div>
          </div>
        `;

        blogContainer.insertAdjacentHTML("beforeend", blogHTML);
      });

      // Mark as loaded to prevent duplicates
      blogContainer.dataset.loaded = "true";

      // Wait for all images to load before fixing layout
      const allImages = blogContainer.querySelectorAll("img");
      let loadedCount = 0;

      if (allImages.length === 0) {
        fixLayout(); // no images to wait for
      } else {
        allImages.forEach((img) => {
          img.onload = img.onerror = () => {
            loadedCount++;
            if (loadedCount === allImages.length) {
              fixLayout();
            }
          };
        });
      }
    })
    .catch((err) => console.error("Blog load error:", err));
}

function fixLayout() {
  // If you're using AOS (Animate on Scroll), refresh it
  if (typeof AOS !== "undefined") AOS.refresh();

  // If using Masonry layout
  if (typeof jQuery !== "undefined" && typeof jQuery.fn.masonry === "function") {
    $(".masonry").masonry("reloadItems").masonry();
  }

  // Forcing a browser layout reflow
  window.dispatchEvent(new Event("resize"));

  // If using GSAP's ScrollTrigger
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
}

// ========== Run on first load ==========
if (
  window.location.pathname.endsWith("blog.html") ||
  window.location.pathname.endsWith("/blog.html")
) {
  loadBlogs();
}

// ========== Barba hook support ==========
document.addEventListener("DOMContentLoaded", () => {
  if (window.barba) {
    barba.hooks.afterEnter(() => {
      const path = window.location.pathname;
      if (path.endsWith("blog.html") || path.endsWith("/blog.html")) {
        loadBlogs();
      }
    });
  }
});
// End of blog post loading script

// ----------------------------------------------------------
// Portfolio loader (moved from inline in portfolio.html)
// ----------------------------------------------------------
let _portfolioIso = null;

function loadPortfolio() {
  const container = document.getElementById("portfolio-container");
  if (!container || container.dataset.loaded === "true") return;

  fetch("data/portfolio-works.json")
    .then((r) => r.json())
    .then((works) => {
      works.forEach((w) => {
        const div = document.createElement("div");
        div.className = "col-xl-4 col-lg-6 col-md-6 grid-item " + w.category;
        div.innerHTML = `
          <a href="${w.link}" class="work-holder scale-animation">
            <figure class="portfolio-item">
              <img src="${w.image}" alt="">
              <figcaption>
                <div class="outer"><div class="inner">
                  <span>${w.tag}</span>
                  <h3 class="title">${w.title}</h3>
                </div></div>
              </figcaption>
            </figure>
          </a>`;
        container.appendChild(div);
      });

      container.dataset.loaded = "true";

      // wait for images then init Isotope
      imagesLoaded(container, () => {
        _portfolioIso = new Isotope(container, {
          itemSelector: ".grid-item",
          layoutMode: "masonry",
          transitionDuration: "0.5s",
        });

        // bind your filter buttons
        document.querySelectorAll(".portfolio_filter a").forEach((a) => {
          a.addEventListener("click", (e) => {
            e.preventDefault();
            document
              .querySelectorAll(".portfolio_filter a")
              .forEach((x) => x.classList.remove("select-cat"));
            a.classList.add("select-cat");
            _portfolioIso.arrange({ filter: a.getAttribute("data-filter") });
          });
        });
      });
    })
    .catch(console.error);
}
// End of portfolio loading script

// ----------------------------------------------------------
// Certificate loader

function loadCertificates() {
  const container = document.getElementById("certificates-container");
  if (!container) return;

  // 1) clear out any old content
  container.innerHTML = "";

  // 2) fetch JSON
  fetch("data/certificates.json")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((cert) => {
        // build column wrapper
        const col = document.createElement("div");
        let cls = "col-xl-6 col-lg-6 col-md-6 col-sm-12 timeline-item clip-animation from-top";
        if (cert.offset) cls += " offset-xl-6 offset-lg-6 offset-md-6";
        col.className = cls;
        col.dataset.duration = cert.duration;
        col.dataset.delay = cert.delay;

        // build inner HTML
        col.innerHTML = `
              <div class="timeline-outer">
                <span class="mini-text">${cert.date}</span>
                <h5>${cert.title}</h5>

                <div class="swiper certificate-carousel clip-animation" data-delay="1">
                  <div class="swiper-wrapper">
                    ${cert.images
                      .map(
                        (img) => `
                      <div class="swiper-slide">
                        <img src="${img.src}" alt="${img.alt}" class="certificate-img"/>
                      </div>`
                      )
                      .join("")}
                  </div>
                  <div class="swiper-pagination"></div>
                </div>

                <p class="little-p certificate-text">Issued by: <span>${cert.issuer}</span></p>
                <p class="little-p certificate-tags">
                  ${cert.tags.map((tag) => `<span>${tag}</span>`).join(" ")}
                </p>

                ${
                  cert.verifyLink
                    ? `
                  <p class="little-p">
                    <a href="${cert.verifyLink}"
                       target="_blank"
                       rel="noopener"
                       class="verify-link">
                      Verify Certificate
                    </a>
                  </p>`
                    : ""
                }
              </div>
            `;
        container.appendChild(col);
      });
    })
    .catch((err) => console.error("Failed to load certificates:", err));
}

// initial load
document.addEventListener("DOMContentLoaded", loadCertificates);

// if using Barba.js for page transitions:
if (window.barba) {
  barba.hooks.afterEnter(loadCertificates);
}

// End of certificate loading script
