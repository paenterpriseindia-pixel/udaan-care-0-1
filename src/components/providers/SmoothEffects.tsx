"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * SmoothEffects — mounts once, wires up:
 *  1. Scroll progress bar (thin gradient bar at top)
 *  2. Navbar shrink on scroll (adds .nav-scrolled class)
 *  3. IntersectionObserver scroll-reveal for .reveal, .reveal-stagger, etc.
 *  4. Image lazy-load fade-in
 */
export default function SmoothEffects() {
  const pathname = usePathname();

  // ── 1 & 2: Scroll progress + navbar shrink ─────────────────────────────────
  useEffect(() => {
    // Create progress bar element
    let bar = document.getElementById("scroll-progress-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "scroll-progress-bar";
      bar.className = "scroll-progress";
      document.body.appendChild(bar);
    }

    const nav = document.querySelector("nav");

    const onScroll = () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = docHeight > 0 ? scrollTop / docHeight : 0;

      // Progress bar
      if (bar) bar.style.transform = `scaleX(${progress})`;

      // Navbar shrink
      if (nav) {
        if (scrollTop > 60) nav.classList.add("nav-scrolled");
        else                nav.classList.remove("nav-scrolled");
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── 3: Scroll-reveal IntersectionObserver ──────────────────────────────────
  useEffect(() => {
    const SELECTORS = [
      ".reveal",
      ".reveal-left",
      ".reveal-right",
      ".reveal-scale",
      ".reveal-stagger",
    ].join(", ");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            // Don't re-animate once revealed
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    // Observe existing elements
    const observe = () => {
      document.querySelectorAll(SELECTORS).forEach((el) => {
        if (!el.classList.contains("revealed")) {
          io.observe(el);
        }
      });
    };

    // Small delay so Next.js has time to render the page content
    const timer = setTimeout(observe, 80);

    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, [pathname]); // re-run on route change

  // ── 4: Image fade-in on load ───────────────────────────────────────────────
  useEffect(() => {
    const imgs = document.querySelectorAll<HTMLImageElement>("img:not([data-smooth-done])");
    imgs.forEach((img) => {
      img.setAttribute("data-smooth-done", "1");
      img.style.transition = "opacity 0.4s ease";
      if (!img.complete) {
        img.style.opacity = "0";
        img.addEventListener("load", () => { img.style.opacity = "1"; }, { once: true });
      }
    });
  }, [pathname]);

  return null; // renders nothing
}
