import {
  select,
  create,
  selectAll,
  getRandomNumber,
  getRandomNumberRange,
  SmoothScrollConfig,
} from "./helpers";
import { gsap, Power1, Power3 } from "gsap";
import { DATA } from "./data";

const PADDING = 20;
const ELEMENT_SIZE = 201;
const pos = ["left", "right"];

window.addEventListener("load", () => {
  const items = select(".items");
  const circle = select(".cursor-circle");

  const mouseEvents = {
    clientX: 0,
    clientY: 0,
    hover: false,
    target: null,
  };

  const scroll = {
    current: 0,
    target: 0,
  };

  let selectedImg = null;

  let position = pos[getRandomNumber(pos.length)];
  let num = getRandomNumberRange(5, 7);

  const generateList = () => {
    DATA.forEach((d, index) => {
      const imageHover = create("img");
      imageHover.classList.add("hover-img");
      imageHover.src = d.imgUrl;
      gsap.set(imageHover, {
        position: "absolute",
        opacity: 0,
        top: "40%",
        zIndex: -2,
        left: "45%",
        scale: 0.6,
        width: 250,
        height: 350,
        rotate: `${position === "left" ? -num + "deg" : num + "deg"}`,
        attr: { "data-id": index + 1 },
      });
      document
        .querySelector("body")
        .insertAdjacentElement("afterbegin", imageHover);
      const textContainer = create("div");
      textContainer.classList.add("text-container");
      textContainer.setAttribute("data-id", index + 1);
      const title = create("div");
      const title2 = create("div");
      title2.setAttribute("data-id", index + 1);

      title2.classList.add("title-2");
      title.classList.add("title");
      title.textContent = d.title;
      title2.textContent = d.title;
      textContainer.appendChild(title);
      textContainer.appendChild(title2);

      const pos = (ELEMENT_SIZE + PADDING) * index;

      gsap.to(textContainer, { y: pos });

      items.appendChild(textContainer);
    });
  };

  generateList();

  const updateTarget = (e) => {
    scroll.target += e.deltaY;
  };

  document.addEventListener("mousewheel", updateTarget);

  const updateMouseEvents = (e) => {
    const isTitle = e.target?.className?.includes("title");

    mouseEvents.hover = isTitle;
    mouseEvents.target = isTitle ? e.target : null;

    mouseEvents.clientX = e.clientX;
    mouseEvents.clientY = e.clientY;
  };

  window.addEventListener("mousemove", updateMouseEvents);

  const getHoverImage = (target) => {
    const isHovering = target?.className?.includes("title");

    const title = isHovering
      ? target.parentNode.querySelector(".title-2")
      : null;

    const img = document.querySelector(`img[data-id="${title?.dataset?.id}"]`);

    return img;
  };

  document.querySelectorAll(".text-container").forEach((t) => {
    t.addEventListener("mouseover", (e) => {
      const img = getHoverImage(e.target);

      if (e.target.className === "title") {
        selectedImg = img;

        if (img) {
          gsap.to(img, {
            opacity: 1,
            scale: 1,
            zIndex: -1,
            duration: 0.5,
            top: "40%",
            ease: Power3.easeInOut,
          });
        }

        position = pos[getRandomNumber(pos.length)];
        num = getRandomNumberRange(5, 7);
      }
    });

    t.addEventListener("mouseleave", (e) => {
      if (selectedImg) {
        gsap.to(selectedImg, {
          opacity: 0,
          scale: 0.6,
          rotate: `${position === "left" ? -num + "deg" : num + "deg"}`,
          zIndex: -1,
          duration: 0.5,
          top: "40%",
          ease: Power3.easeInOut,
        });
      }
    });
  });

  let prev = null;
  const list = selectAll(".text-container");

  const init = () => {
    const { current, target } = scroll;

    const transition = SmoothScrollConfig.lerp(current, target);

    scroll.current = transition;

    const skew = SmoothScrollConfig.getSkew(target, current);

    const hoverElement = document.elementFromPoint(
      mouseEvents.clientX,
      mouseEvents.clientY
    );

    const isHovering =
      hoverElement?.className?.includes("title") ||
      hoverElement?.className?.includes("title-2");

    const title = isHovering
      ? hoverElement.parentNode.querySelector(".title-2")
      : null;

    const id = title?.dataset?.id ?? 0;

    const img = document.querySelector(`img[data-id="${id}"]`);

    if (prev !== title) {
      if (prev) {
        gsap.set(prev, { width: "0%" });
      }

      prev = title;
    } else {
      if (title) {
        gsap.set(title, { width: "100%" });
      }

      if (img) {
        const ease = 0.05;
        const directionX = window.innerWidth - mouseEvents.clientX;
        const directionY = window.innerHeight - mouseEvents.clientY;

        gsap.to(img, {
          rotate: `${position === "left" ? -num + "deg" : num + "deg"}`,
          translateX: `-${gsap.getProperty(img, "x") + directionX * ease}%`,
          translateY: `-${gsap.getProperty(img, "y") + directionY * ease}%`,
        });
      }
    }

    gsap.to(circle, {
      top: mouseEvents.clientY - (isHovering ? 55 : 8.5),
      left: mouseEvents.clientX - (isHovering ? 55 : 8.5),
      duration: 0.3,
      className: isHovering ? "cursor-circle active" : "cursor-circle",
    });

    list.forEach((it) => {
      const y = gsap.getProperty(it, "y");

      const size = (ELEMENT_SIZE + PADDING) * DATA.length;

      const scrollY = y - scroll.current;

      let result = (scrollY % size) - (ELEMENT_SIZE + PADDING);

      if (result < -231) {
        result = (scrollY % size) + size - (ELEMENT_SIZE + PADDING);
      }

      it.style.transform = `translate3d(0, ${result}px, 0) skewY(${skew}deg)`;
    });

    window.requestAnimationFrame(init);
  };

  init();

  // Load
  const pic = selectAll(".hover-img");
  pic[pic.length - 1].addEventListener("load", () => {
    gsap.to(".blank", {
      height: "0%",
      delay: 1,
      duration: 0.9,
      ease: Power1.easeInOut,
    });
    gsap.to(circle, {
      autoAlpha: 1,
      delay: 1,
      duration: 0.9,
      ease: Power1.easeInOut,
    });
  });
});
