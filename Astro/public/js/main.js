/* CargoHype theme scripts (smooth scroll + stat counters), carried over from the original template. */

/* Lenis smooth scrolling */
const lenis = new Lenis({
  smooth: true,
  lerp: .1,
  wheelMultiplier: 1,
  infinite: false,
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/* Animated number counters: add data-counter to any element containing a number */
window.SiteRuntime ||= [];
window.SiteRuntime.push(() => {
  document.querySelectorAll("[data-counter]").forEach((counter) => {
    const textEl = counter.firstElementChild || counter;
    const original = textEl.textContent.trim();
    const match = original.match(/^([^0-9.-]*)([0-9.,-]+)(.*)$/);
    if (!match) return;
    const prefix = match[1];
    const number = match[2].replace(/,/g, "");
    const suffix = match[3];
    const target = parseFloat(number);
    if (isNaN(target)) return;
    const hasDecimal = number.includes(".");
    const hasComma = original.includes(",");
    const obj = { value: 0 };
    gsap.fromTo(
      obj,
      { value: 0 },
      {
        value: target,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: counter,
          start: "top 88%",
          once: true,
        },
        onUpdate() {
          let value = hasDecimal
            ? obj.value.toFixed(1)
            : Math.floor(obj.value);
          if (hasComma && !hasDecimal) {
            value = Number(value).toLocaleString();
          }
          textEl.textContent = prefix + value + suffix;
        },
      }
    );
  });
});
