document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(
    CustomEase,
    ScrambleTextPlugin,
    ScrollTrigger,
    DrawSVGPlugin,
  );

  gsap.defaults({
    ease: "expo.out",
    duration: 0.8,
  });

  CustomEase.create("primary", "0.6, 0.05, 0.01, 1");

  //LENIS SMOOTH SCROLL
  let lenis;
  let isMobile = window.innerWidth < 480;

  window.addEventListener("resize", () => {
    isMobile = window.innerWidth < 480;
  });

  if (Webflow.env("editor") === undefined) {
    lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }
  $("[data-lenis-start]").on("click", function () {
    lenis.start();
  });
  $("[data-lenis-stop]").on("click", function () {
    lenis.stop();
  });
  $("[data-lenis-toggle]").on("click", function () {
    $(this).toggleClass("stop-scroll");
    if ($(this).hasClass("stop-scroll")) {
      lenis.stop();
    } else {
      lenis.start();
    }
  });

  CustomEase.create("cubic-out", "0.215, 0.61, 0.355, 1");

  const prefersReducedMotion = (() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    return query.matches;
  })();

  function supportsTouch() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  function initLoader() {
    let loadWrap = document.querySelector(".load-wrap");
    let loadTextTracks = document.querySelectorAll(".load-text__track");
    let loadTexts = document.querySelectorAll(".load-text");
    let loadImage = document.querySelector(".load-img__wrap");
    let loadButton = document.querySelector(".load-button");
    let loadButtonText = loadButton.querySelector("div");
    let splineScene = document.querySelector(".hero-spline canvas");
    let loadTrigger = document.querySelector(".load-trigger");

    let loadTimeline = gsap.timeline();

    loadTimeline
      .set(loadTexts, { visibility: "visible" })
      .from(loadTexts, {
        yPercent: 120,
        stagger: {
          each: 0.1,
          from: "center",
        },
      })
      .to(
        loadImage,
        {
          y: "0vh",
          x: "0vw",
          rotate: -15,
        },
        "<",
      );

    loadTexts.forEach((item, index) => {
      let direction = index % 2 === 0 ? -30 : 30;
      loadTimeline.to(
        item,
        {
          xPercent: direction,
          duration: 15,
          rotate: 0.001,
          ease: "none",
        },
        0,
      );
    });

    let loadEndTl = gsap.timeline({
      paused: true,
      onComplete: () => {
        gsap.set(loadWrap, { display: "none" });
      },
    });

    loadEndTl
      .to(loadButtonText, {
        scrambleText: {
          chars: "uppercase",
          text: "all systems ready",
          speed: 1,
          delimiter: "",
        },
        duration: 0.8,
        onStart: () => {
          loadTrigger.click();
        },
      })
      .to(loadWrap, {
        yPercent: -101,
      })
      .to(
        loadTextTracks,
        {
          yPercent: 100,
          opacity: 0,
        },
        "<",
      );

    let sceneLoaded = new Promise((resolve, reject) => {
      const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "style"
          ) {
            if (splineScene.style.display === "block") {
              observer.disconnect();
              resolve();
            }
          }
        }
      });

      observer.observe(splineScene, { attributes: true });
    });

    let minimumWait = new Promise((resolve, reject) => {
      setTimeout(resolve, 3000);
    });

    let longWait = new Promise((resolve, reject) => {
      setTimeout(resolve, 10000);
    });

    Promise.all([sceneLoaded, minimumWait]).then(() => {
      playNewTimeline();
    });

    longWait.then(() => {
      playNewTimeline();
    });

    function playNewTimeline() {
      loadEndTl.play();
    }
  }
  initLoader();
  //gsap.set(".load-wrap", { display: "none" });

  function initSound() {
    var backgroundMusic = new Howl({
      src: "https://cdn.jsdelivr.net/gh/ilja-van-eck/fpod/rumble.mp3",
      html5: true,
      loop: true,
      autoplay: false,
    });

    document.querySelectorAll(".play-button").forEach(function (audioButton) {
      audioButton.addEventListener("click", function () {
        if (backgroundMusic.playing()) {
          backgroundMusic.pause();
        } else {
          backgroundMusic.play();
        }
      });
    });
  }
  initSound();

  function initButtonHovers() {
    if (isMobile || prefersReducedMotion) return;
    let buttons = document.querySelectorAll(".button");

    buttons.forEach((button) => {
      let buttonText = button.querySelector("div");
      let buttonDots = button.querySelectorAll(".button-arrow-dot");
      let buttonOriginalText = buttonText.textContent;

      button.addEventListener("mouseenter", function () {
        gsap.to(buttonText, {
          duration: 0.6,
          scrambleText: {
            text: "{original}",
            chars: "uppercase",
          },
        });
        gsap.to(buttonDots, {
          x: 6,
          duration: 0.45,
          ease: "primary",
          stagger: {
            each: 0.025,
            from: "center",
          },
        });
      });
      button.addEventListener("mouseleave", function () {
        gsap.to(buttonText, {
          duration: 0.6,
          scrambleText: {
            text: buttonOriginalText,
            chars: "uppercase",
          },
        });
        gsap.to(buttonDots, {
          x: 0,
          duration: 0.25,
          ease: "primary",
          stagger: {
            each: 0.025,
            from: "edges",
          },
        });
      });
    });
  }
  initButtonHovers();

  function initIcons() {
    let speakerWaves = document.querySelectorAll(".speaker-wave");
    let bassIcon = document.querySelector(".bass-icon");
    let trigger = document.querySelector("[data-icon-trigger]");
    let end = document.querySelector("[data-icon-end]");

    let audioTimeline = gsap.timeline({
      defaults: {
        duration: 0.5,
        ease: "power3.inOut",
      },
      repeat: -1,
      paused: true,
      scrollTrigger: {
        trigger: trigger,
        start: "top bottom",
        endTrigger: end,
        end: "top center",
        toggleActions: "play pause resume pause",
      },
    });
    audioTimeline
      .from(speakerWaves, {
        opacity: 0,
        x: -6,
        stagger: 0.1,
      })
      .to(
        speakerWaves,
        {
          opacity: 0,
          x: 6,
          stagger: {
            each: 0.1,
            from: "end",
          },
        },
        ">+=0.4",
      );

    let bassTimeline = gsap.timeline({
      repeat: -1,
      paused: true,
      onRepeat: onRepeat,
      scrollTrigger: {
        trigger: trigger,
        start: "top bottom",
        endTrigger: end,
        end: "top center",
        toggleActions: "play pause resume pause",
      },
    });
    bassTimeline.to(bassIcon, { rotate: 360 });
    let toggleRotate = true;

    function onRepeat() {
      this.clear();
      this.to(bassIcon, {
        rotate: toggleRotate ? 360 : -360,
        ease: gsap.utils.random([
          "power3.inOut",
          "power4.inOut",
          "power2.inOut",
          "expo.inOut",
        ]),
        duration: gsap.utils.random([0.8, 1.2], true),
      });
      toggleRotate = !toggleRotate;
    }
  }
  initIcons();

  function initAccordions() {
    let accordions = document.querySelectorAll(".box-item");

    accordions.forEach((accordion) => {
      let trigger = accordion.querySelector(".box-item-link");
      let dots = accordion.querySelectorAll(".arrow-dot");
      let content = accordion.querySelector(".box-content-wrap");
      let img = accordion.querySelector(".box-item-img");
      let contentTopLine = content.querySelector(".top-line");
      let contentBottomLine = content.querySelector(".bottom-line");
      let heading = content.querySelector(".bit-h");
      let paragraph = content.querySelector(".txt-small");
      accordion.isOpen = false;

      let openTl = gsap.timeline({
        defaults: {
          duration: 0.8,
          ease: "expo.out",
        },
        paused: true,
        reversed: true,
        onComplete: () => {
          lenis.resize();
          ScrollTrigger.refresh();
        },
      });
      openTl
        .fromTo(
          content,
          {
            height: "0px",
          },
          {
            height: "auto",
          },
        )
        .to(
          [dots[0], dots[4]],
          {
            yPercent: isMobile ? 100 : 200,
            stagger: 0.2,
          },
          0,
        )
        .to(dots[2], { yPercent: -200 }, 0.1)
        .from(
          img,
          {
            clipPath: prefersReducedMotion
              ? "inset(0px 0px 0px 0px)"
              : "inset(0px 100% 0px 0px)",
          },
          "<",
        )
        .to(contentTopLine, { scaleX: 1 }, "<")
        .to(contentBottomLine, { scaleX: 1 }, "<+=0.1");
      if (!prefersReducedMotion) {
        openTl
          .to(
            heading,
            {
              scrambleText: {
                text: "{original}",
                chars: "uppercase",
                speed: 0.6,
              },
            },
            0.2,
          )
          .from(paragraph, { opacity: 0 }, "<+=0.1");
      }

      accordion.closeTl = gsap.timeline({
        defaults: {
          ease: "power4.out",
          duration: 0.6,
        },
        paused: true,
        onComplete: () => {
          lenis.resize();
          ScrollTrigger.refresh();
        },
      });
      accordion.closeTl
        .to(content, { height: "0px" })
        .to(dots, { yPercent: 0 }, 0)
        .to(contentBottomLine, { scaleX: 0, duration: 0.4 }, 0);

      trigger.addEventListener("click", function () {
        accordions.forEach((otherAccordion) => {
          if (otherAccordion !== accordion && otherAccordion.isOpen) {
            otherAccordion.querySelector("a").classList.remove("is-current");
            otherAccordion.closeTl.play(0);
            otherAccordion.isOpen = false;
          }
        });

        trigger.classList.toggle("is-current");
        if (accordion.isOpen) {
          accordion.closeTl.play(0);
          accordion.isOpen = false;
        } else {
          openTl.play(0);
          accordion.isOpen = true;
        }
      });
    });

    ScrollTrigger.create({
      trigger: ".box-items-wrap",
      start: "top 60%",
      once: true,
      onEnter: () => {
        accordions[0].querySelector("a").click();
      },
    });
  }
  initAccordions();

  function initSlider() {
    const wrapper = document.querySelector(".slider-container");
    const boxes = gsap.utils.toArray(".slide");
    let cursorInner = document.querySelector(".cursor-el");
    let overlayWrap = document.querySelector(".overlay-w");
    let overlayScroll = overlayWrap.querySelector(".overlay-scroll");
    let overlayClose = overlayWrap.querySelector(".overlay-close");
    let overlayLine = overlayWrap.querySelector(".bottom-line");
    let overlayText = overlayWrap.querySelector(".overlay-text");
    let overlayFeature = overlayText.querySelector('[data-overlay="feature"]')
    let overlayNr = overlayText.querySelector('[data-overlay="nr"]')
    let activeElement;
    let panImageEvent;

    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseStillTimeout;

    const loop = horizontalLoop(boxes, {
      paused: true,
      draggable: true,
      center: true,
      onChange: (element, index) => {
        activeElement && activeElement.classList.remove("active");
        element.classList.add("active");
        activeElement = element;
      },
    });

    function checkMouseStillness() {
      clearTimeout(mouseStillTimeout);
      mouseStillTimeout = setTimeout(() => {
        cursorInner.classList.add("hover");
      }, 200);
    }

    function onMouseMove(event) {
      const dx = Math.abs(event.clientX - lastMouseX);
      const dy = Math.abs(event.clientY - lastMouseY);

      if (dx > 8 || dy > 8) {
        cursorInner.classList.remove("hover");
        checkMouseStillness();
      }

      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
    }

    boxes.forEach((box) => {
      let feature = box.querySelector('[data-slide="feature"]')
      let featureText = feature.innerText;
      let nr = box.querySelector('[data-slide="nr"]')
      let nrText = nr.innerText;

      overlayFeature.innerText = featureText;
      overlayNr.innerText = nrText;

      box.addEventListener("click", () => {
        lenis.stop()
        let originalSlide = box;
        originalSlide.classList.add("open");
        let image = box.querySelector(".slide-img__w");
        let info = box.querySelector(".slide-info__w");
        let boxSize = box.getBoundingClientRect();
        box.style.width = boxSize.width + "px";
        box.style.height = boxSize.height + "px";



        let tl = gsap.timeline({
          defaults: {
            ease: "power4.inOut",
            duration: 1,
          },
        });
        tl.set(overlayWrap, { display: "block" })
          .fromTo(
            [overlayText, overlayScroll],
            { y: "-6rem" },
            { y: "0rem", duration: 1, stagger: 0.1 },
            0.7,
          )
          .fromTo(
            overlayClose,
            { scale: 0, rotate: -25 },
            { scale: 1, rotate: 0, duration: 0.6 },
            "<",
          )
          .to(overlayLine, { scaleX: 1, duration: 0.7 }, "<")
          .to(".navbar-wrap", { y: "-5rem" }, "<+=0.1");

        let imageState = Flip.getState(image);

        gsap.delayedCall(0.01, () => {
          overlayWrap.appendChild(image);
          Flip.from(imageState, {
            duration: 1,
            ease: "power4.inOut",
            onComplete: () => {
              let imageHeight = image.offsetHeight;
              let windowHeight = window.innerHeight;

              panImage = (event) => {
                let mouseY = event.clientY;
                let maxOffset = imageHeight - windowHeight;
                let offset = (mouseY / windowHeight) * maxOffset;
                gsap.to(image, {
                  y: -offset,
                  ease: "power2.out",
                });
              };

              if (supportsTouch()) {
                window.addEventListener("mousemove", panImage);
              }

            },
          });
        });
      });

      if (!isMobile) {
        box.addEventListener("mouseenter", () => {
          lastMouseX = 0;
          lastMouseY = 0;
          window.addEventListener("mousemove", onMouseMove);
          checkMouseStillness();
        });

        box.addEventListener("mouseleave", () => {
          clearTimeout(mouseStillTimeout);
          cursorInner.classList.remove("hover");
          window.removeEventListener("mousemove", onMouseMove);
        });
      }
    });

    overlayClose.addEventListener("click", () => {
      let originalSlide = document.querySelector(".slide.open");
      let image = overlayWrap.querySelector(".slide-img__w");
      let imageTarget = originalSlide.querySelector(".slide-img");

      let imageState = Flip.getState(image);

      let tl = gsap.timeline({
        defaults: {
          ease: "power4.inOut",
          duration: 0.6,
        },
        onComplete: () => {
          lenis.start()
          originalSlide.classList.remove("open");
        },
      });
      tl.to([overlayScroll, overlayText], { y: "-6rem" }, 0)
        .to(overlayLine, { scaleX: 0 }, "<")
        .to(overlayClose, { scale: 0, rotate: -25 }, "<")
        .to(".navbar-wrap", { y: "0rem" }, "<+=0.2")
        .set(overlayWrap, { display: "none" });

      gsap.to(image, { y: 0, duration: 0.3 });

      gsap.delayedCall(0.3, () => {
        imageTarget.appendChild(image);
        Flip.from(imageState, {
          duration: 1,
          ease: "power4.inOut",
          absolute: true,
        });
        if (supportsTouch()) {
          window.removeEventListener("mousemove", panImage);
        }
      });
    });

    if (!isMobile) {
      wrapper.addEventListener("mouseenter", () => {
        gsap.set(cursorInner, { display: "flex" });
      });
      wrapper.addEventListener("mouseleave", () => {
        gsap.set(cursorInner, { display: "none" });
      });
      wrapper.addEventListener("mousemove", (event) => {
        const wrapperRect = wrapper.getBoundingClientRect();
        const cursorX = event.clientX - wrapperRect.left;

        if (cursorX < wrapperRect.width / 2) {
          cursorInner.classList.add("left");
        } else {
          cursorInner.classList.remove("left");
        }
      });
    }
  }
  initSlider();

  function horizontalLoop(items, config) {
    let timeline;
    items = gsap.utils.toArray(items);
    config = config || {};
    gsap.context(() => {
      // use a context so that if this is called from within another context or a gsap.matchMedia(), we can perform proper cleanup like the "resize" event handler on the window
      let onChange = config.onChange,
        lastIndex = 0,
        tl = gsap.timeline({
          repeat: config.repeat,
          onUpdate:
            onChange &&
            function () {
              let i = tl.closestIndex();
              if (lastIndex !== i) {
                lastIndex = i;
                onChange(items[i], i);
              }
            },
          paused: config.paused,
          defaults: { ease: "none" },
          onReverseComplete: () =>
            tl.totalTime(tl.rawTime() + tl.duration() * 100),
        }),
        length = items.length,
        startX = items[0].offsetLeft,
        times = [],
        widths = [],
        spaceBefore = [],
        xPercents = [],
        curIndex = 0,
        indexIsDirty = false,
        center = config.center,
        pixelsPerSecond = (config.speed || 1) * 100,
        snap =
          config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
        timeOffset = 0,
        container =
          center === true
            ? items[0].parentNode
            : gsap.utils.toArray(center)[0] || items[0].parentNode,
        totalWidth,
        getTotalWidth = () =>
          items[length - 1].offsetLeft +
          (xPercents[length - 1] / 100) * widths[length - 1] -
          startX +
          spaceBefore[0] +
          items[length - 1].offsetWidth *
          gsap.getProperty(items[length - 1], "scaleX") +
          (parseFloat(config.paddingRight) || 0),
        populateWidths = () => {
          let b1 = container.getBoundingClientRect(),
            b2;
          items.forEach((el, i) => {
            widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
            xPercents[i] = snap(
              (parseFloat(gsap.getProperty(el, "x", "px")) / widths[i]) * 100 +
              gsap.getProperty(el, "xPercent"),
            );
            b2 = el.getBoundingClientRect();
            spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
            b1 = b2;
          });
          gsap.set(items, {
            // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
            xPercent: (i) => xPercents[i],
          });
          totalWidth = getTotalWidth();
        },
        timeWrap,
        populateOffsets = () => {
          timeOffset = center
            ? (tl.duration() * (container.offsetWidth / 2)) / totalWidth
            : 0;
          center &&
            times.forEach((t, i) => {
              times[i] = timeWrap(
                tl.labels["label" + i] +
                (tl.duration() * widths[i]) / 2 / totalWidth -
                timeOffset,
              );
            });
        },
        getClosest = (values, value, wrap) => {
          let i = values.length,
            closest = 1e10,
            index = 0,
            d;
          while (i--) {
            d = Math.abs(values[i] - value);
            if (d > wrap / 2) {
              d = wrap - d;
            }
            if (d < closest) {
              closest = d;
              index = i;
            }
          }
          return index;
        },
        populateTimeline = () => {
          let i, item, curX, distanceToStart, distanceToLoop;
          tl.clear();
          for (i = 0; i < length; i++) {
            item = items[i];
            curX = (xPercents[i] / 100) * widths[i];
            distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
            distanceToLoop =
              distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
            tl.to(
              item,
              {
                xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
                duration: distanceToLoop / pixelsPerSecond,
              },
              0,
            )
              .fromTo(
                item,
                {
                  xPercent: snap(
                    ((curX - distanceToLoop + totalWidth) / widths[i]) * 100,
                  ),
                },
                {
                  xPercent: xPercents[i],
                  duration:
                    (curX - distanceToLoop + totalWidth - curX) /
                    pixelsPerSecond,
                  immediateRender: false,
                },
                distanceToLoop / pixelsPerSecond,
              )
              .add("label" + i, distanceToStart / pixelsPerSecond);
            times[i] = distanceToStart / pixelsPerSecond;
          }
          timeWrap = gsap.utils.wrap(0, tl.duration());
        },
        refresh = (deep) => {
          let progress = tl.progress();
          tl.progress(0, true);
          populateWidths();
          deep && populateTimeline();
          populateOffsets();
          deep && tl.draggable
            ? tl.time(times[curIndex], true)
            : tl.progress(progress, true);
        },
        onResize = () => refresh(true),
        proxy;
      gsap.set(items, { x: 0 });
      populateWidths();
      populateTimeline();
      populateOffsets();
      window.addEventListener("resize", onResize);
      function toIndex(index, vars) {
        vars = vars || {};
        Math.abs(index - curIndex) > length / 2 &&
          (index += index > curIndex ? -length : length); // always go in the shortest direction
        let newIndex = gsap.utils.wrap(0, length, index),
          time = times[newIndex];
        if (time > tl.time() !== index > curIndex && index !== curIndex) {
          // if we're wrapping the timeline's playhead, make the proper adjustments
          time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        if (time < 0 || time > tl.duration()) {
          vars.modifiers = { time: timeWrap };
        }
        curIndex = newIndex;
        vars.overwrite = true;
        gsap.killTweensOf(proxy);
        return vars.duration === 0
          ? tl.time(timeWrap(time))
          : tl.tweenTo(time, vars);
      }
      tl.toIndex = (index, vars) => toIndex(index, vars);
      tl.closestIndex = (setCurrent) => {
        let index = getClosest(times, tl.time(), tl.duration());
        if (setCurrent) {
          curIndex = index;
          indexIsDirty = false;
        }
        return index;
      };
      tl.current = () => (indexIsDirty ? tl.closestIndex(true) : curIndex);
      tl.next = (vars) => toIndex(tl.current() + 1, vars);
      tl.previous = (vars) => toIndex(tl.current() - 1, vars);
      tl.times = times;
      tl.progress(1, true).progress(0, true); // pre-render for performance
      if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
      }
      if (config.draggable && typeof Draggable === "function") {
        proxy = document.createElement("div");
        let wrap = gsap.utils.wrap(0, 1),
          ratio,
          startProgress,
          draggable,
          dragSnap,
          lastSnap,
          initChangeX,
          wasPlaying,
          align = () =>
            tl.progress(
              wrap(startProgress + (draggable.startX - draggable.x) * ratio),
            ),
          syncIndex = () => tl.closestIndex(true);
        typeof InertiaPlugin === "undefined" &&
          console.warn(
            "InertiaPlugin required for momentum-based scrolling and snapping. https://greensock.com/club",
          );
        draggable = Draggable.create(proxy, {
          trigger: items[0].parentNode,
          type: "x",
          onPressInit() {
            let x = this.x;
            gsap.killTweensOf(tl);
            wasPlaying = !tl.paused();
            tl.pause();
            startProgress = tl.progress();
            refresh();
            ratio = 1 / totalWidth;
            initChangeX = startProgress / -ratio - x;
            gsap.set(proxy, { x: startProgress / -ratio });
          },
          onDrag: align,
          onThrowUpdate: align,
          overshootTolerance: 0,
          inertia: true,
          snap(value) {
            //note: if the user presses and releases in the middle of a throw, due to the sudden correction of proxy.x in the onPressInit(), the velocity could be very large, throwing off the snap. So sense that condition and adjust for it. We also need to set overshootTolerance to 0 to prevent the inertia from causing it to shoot past and come back
            if (Math.abs(startProgress / -ratio - this.x) < 10) {
              return lastSnap + initChangeX;
            }
            let time = -(value * ratio) * tl.duration(),
              wrappedTime = timeWrap(time),
              snapTime = times[getClosest(times, wrappedTime, tl.duration())],
              dif = snapTime - wrappedTime;
            Math.abs(dif) > tl.duration() / 2 &&
              (dif += dif < 0 ? tl.duration() : -tl.duration());
            lastSnap = (time + dif) / tl.duration() / -ratio;
            return lastSnap;
          },
          onRelease() {
            syncIndex();
            draggable.isThrowing && (indexIsDirty = true);
          },
          onThrowComplete: () => {
            syncIndex();
            wasPlaying && tl.play();
          },
        })[0];
        tl.draggable = draggable;
      }
      tl.closestIndex(true);
      lastIndex = curIndex;
      onChange && onChange(items[curIndex], curIndex);
      timeline = tl;
      return () => window.removeEventListener("resize", onResize); // cleanup
    });
    return timeline;
  }

  function initSpecIllustrations() {
    let speakerIllustration = document.querySelectorAll(
      ".graph-img.is-speaker path",
    );

    let container = document.querySelector('[data-tabs="specs"]');

    gsap.set(speakerIllustration, {
      drawSVG: 0,
    });

    ScrollTrigger.create({
      trigger: container,
      start: "top center",
      onEnter: () => {
        gsap.to(speakerIllustration, {
          duration: 1,
          drawSVG: "100%",
        });
      },
      onLeaveBack: () => {
        gsap.to(speakerIllustration, {
          duration: 1,
          drawSVG: "0%",
        });
      },
    });
  }
  initSpecIllustrations();
});
