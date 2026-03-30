// ============================================================
//  PORTFOLIO SCRIPT — Shreyans Prajapati
// ============================================================

// ===== TYPING ANIMATION =====
const typedWords = ["Frontend Developer", "UI Designer", "BCA Student", "Web Developer"];
let wordIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 90;

function typeEffect() {
  const el = document.getElementById("typedText");
  if (!el) return;
  const word = typedWords[wordIndex];
  if (!isDeleting) {
    el.textContent = word.slice(0, ++charIndex);
    if (charIndex === word.length) { isDeleting = true; typingSpeed = 1800; }
    else typingSpeed = 90;
  } else {
    el.textContent = word.slice(0, --charIndex);
    typingSpeed = 48;
    if (charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % typedWords.length; typingSpeed = 400; }
  }
  setTimeout(typeEffect, typingSpeed);
}
setTimeout(typeEffect, 900);


// ===== NAVBAR =====
const navbar  = document.getElementById("navbar");
const navLinkEls = document.querySelectorAll(".nav-link");
const sections   = document.querySelectorAll("section[id]");
const threeCanvas = document.getElementById("threeCanvas");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  navbar.classList.toggle("scrolled", scrollY > 30);
  document.getElementById("scrollTop").classList.toggle("show", scrollY > 300);

  // Active nav link
  let cur = "";
  sections.forEach(s => { if (scrollY >= s.offsetTop - 110) cur = s.id; });
  navLinkEls.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + cur));

  // Hide 3D canvas once scrolled past hero
  const heroSection = document.getElementById("home");
  if (heroSection) {
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    if (threeCanvas) threeCanvas.classList.toggle("hidden", scrollY > heroBottom - 100);
  }
});

// hamburger
const hbg  = document.getElementById("hamburger");
const mNav = document.getElementById("navLinks");
hbg.addEventListener("click", () => { hbg.classList.toggle("open"); mNav.classList.toggle("open"); });
document.querySelectorAll(".nav-link").forEach(l => l.addEventListener("click", () => { hbg.classList.remove("open"); mNav.classList.remove("open"); }));
document.addEventListener("click", e => { if (!navbar.contains(e.target)) { hbg.classList.remove("open"); mNav.classList.remove("open"); } });

// scroll top
document.getElementById("scrollTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));


// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(".reveal,.reveal-left,.reveal-right");
const ro = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      e.target.querySelectorAll(".skill-fill").forEach(f => f.style.width = f.style.getPropertyValue("--w"));
      e.target.querySelectorAll(".progress-fill").forEach(f => f.style.width = f.style.getPropertyValue("--pw"));
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });
revealEls.forEach(el => ro.observe(el));

const so = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { const f = e.target.querySelector(".skill-fill"); if (f) setTimeout(() => f.style.width = f.style.getPropertyValue("--w"), 200); } });
}, { threshold: 0.3 });
document.querySelectorAll(".skill-card").forEach(c => so.observe(c));

const po = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll(".progress-fill").forEach((f, i) => setTimeout(() => f.style.width = f.style.getPropertyValue("--pw"), i * 200 + 300)); });
}, { threshold: 0.2 });
const wCard = document.querySelector(".working-card");
if (wCard) po.observe(wCard);

window.addEventListener("load", () => setTimeout(() => {
  revealEls.forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight - 60) el.classList.add("visible"); });
}, 100));


// ===== PROJECT FILTER =====
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    document.querySelectorAll(".project-card").forEach(c => c.classList.toggle("hidden", f !== "all" && c.dataset.category !== f));
  });
});


// ===== CONTACT FORM (FormSubmit) =====
// The form uses FormSubmit (action="https://formsubmit.co/...") to send emails directly.
// On first submission FormSubmit will ask to confirm your email — do that once and all future
// messages will arrive in your inbox automatically.
// For JS submission with success message (optional override):
const cForm = document.getElementById("contactForm");
if (cForm) {
  cForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const txt = document.getElementById("sendBtnText");
    const ico = document.getElementById("sendBtnIcon");
    const success = document.getElementById("formSuccess");

    txt.textContent = "Sending...";
    ico.className = "fas fa-spinner fa-spin";

    try {
      const data = new FormData(cForm);
      const res = await fetch(cForm.action, {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" }
      });

      if (res.ok || res.status === 200) {
        txt.textContent = "Sent!";
        ico.className = "fas fa-check";
        success.classList.add("show");
        cForm.reset();
        setTimeout(() => {
          txt.textContent = "Send Message";
          ico.className = "fas fa-paper-plane";
          success.classList.remove("show");
        }, 5000);
      } else {
        txt.textContent = "Send Message";
        ico.className = "fas fa-paper-plane";
        alert("Something went wrong. Please try emailing directly: shreyansprajapati7081@gmail.com");
      }
    } catch (err) {
      txt.textContent = "Send Message";
      ico.className = "fas fa-paper-plane";
      alert("Could not send. Please email: shreyansprajapati7081@gmail.com");
    }
  });
}


// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const t = document.querySelector(a.getAttribute("href"));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth", block: "start" }); }
  });
});


// ===================================================
//  THREE.JS — 3D COMPUTER SETUP
//  Only rendered while hero is in view
// ===================================================
(function initThree() {
  if (typeof THREE === "undefined") return;

  const canvas  = document.getElementById("threeCanvas");
  if (!canvas) return;

  const scene   = new THREE.Scene();
  const camera  = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 2, 14);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  // Colors to match site palette
  const COL = {
    purple:    0xa855f7,
    blue:      0x6366f1,
    pink:      0xec4899,
    cyan:      0x06b6d4,
    darkPanel: 0x110920,
    screen:    0x0d0621,
    glow:      0xc084fc,
    desk:      0x1a0f2e,
    key:       0x1e1035,
    keyCap:    0x2a1a4a,
  };

  // LIGHTS
  scene.add(new THREE.AmbientLight(0x8b5cf6, 0.4));
  const purpleLight = new THREE.PointLight(COL.purple, 2.5, 30);
  purpleLight.position.set(-6, 6, 4);
  scene.add(purpleLight);
  const pinkLight = new THREE.PointLight(COL.pink, 1.8, 25);
  pinkLight.position.set(6, 4, 3);
  scene.add(pinkLight);
  const cyanLight = new THREE.PointLight(COL.cyan, 1.2, 20);
  cyanLight.position.set(0, -2, 8);
  scene.add(cyanLight);
  const screenLight = new THREE.PointLight(COL.glow, 3, 12);
  screenLight.position.set(0, 2.5, 4);
  scene.add(screenLight);

  function mat(color, metalness = 0.6, roughness = 0.3, emissive = 0x000000, emissiveIntensity = 0) {
    return new THREE.MeshStandardMaterial({ color, metalness, roughness, emissive, emissiveIntensity });
  }
  function box(w, h, d, material) {
    return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  }

  // Group for the setup
  const setupGroup = new THREE.Group();
  scene.add(setupGroup);

  // DESK
  const desk = box(14, 0.18, 6, mat(COL.desk, 0.4, 0.6));
  desk.position.set(0, -1.5, 0);
  setupGroup.add(desk);

  // Desk legs
  const legMat = mat(0x0f0820, 0.5, 0.5);
  [[-5.5,-1.5],[5.5,-1.5],[-5.5,1.5],[5.5,1.5]].forEach(([x,z]) => {
    const leg = box(0.18, 2.6, 0.18, legMat);
    leg.position.set(x, -2.8, z);
    setupGroup.add(leg);
  });

  // MONITOR STAND
  const standMat = mat(0x1a1030, 0.7, 0.3);
  const standBase = box(2.4, 0.1, 1.2, standMat);
  standBase.position.set(0, -1.41, -0.5);
  setupGroup.add(standBase);
  const standNeck = box(0.22, 1.4, 0.22, standMat);
  standNeck.position.set(0, -0.8, -0.5);
  setupGroup.add(standNeck);

  // MONITOR FRAME
  const monitorFrame = box(7.2, 4.4, 0.22, mat(COL.darkPanel, 0.8, 0.2));
  monitorFrame.position.set(0, 2.2, -0.5);
  setupGroup.add(monitorFrame);

  // SCREEN
  const screenMat = new THREE.MeshStandardMaterial({
    color: COL.screen, emissive: 0x6b21a8, emissiveIntensity: 0.6, roughness: 0.05, metalness: 0.1,
  });
  const screen = box(6.6, 3.8, 0.05, screenMat);
  screen.position.set(0, 2.2, -0.37);
  setupGroup.add(screen);

  // Code lines on screen
  const barColors = [0xa855f7,0x6366f1,0xec4899,0x06b6d4,0x22c55e,0xa855f7,0x6366f1,0xec4899];
  barColors.forEach((c, i) => {
    const bar = new THREE.Mesh(
      new THREE.PlaneGeometry(Math.random() * 2.5 + 1.5, 0.09),
      new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.75 })
    );
    bar.position.set(-1.5 + Math.random() * 1.2, 3.5 - i * 0.42, -0.33);
    setupGroup.add(bar);
  });

  // Corner dots on screen
  [[-3, 0.3],[3, 0.3]].forEach(([x]) => {
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.18, 32), new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.6 }));
    dot.position.set(x, 2.2, -0.33);
    setupGroup.add(dot);
  });

  // KEYBOARD
  const keyboard = box(5.4, 0.14, 1.8, mat(COL.key, 0.7, 0.3));
  keyboard.position.set(0, -1.41, 1.6);
  setupGroup.add(keyboard);

  const keyMat = mat(COL.keyCap, 0.5, 0.5, 0x6600aa, 0.15);
  const keyGap = 0.38;
  [12,13,12,11].forEach((count, row) => {
    for (let k = 0; k < count; k++) {
      const key = box(0.3, 0.1, 0.28, keyMat);
      key.position.set(-((count-1)/2)*keyGap + k*keyGap, -1.33, 1.2 + row*0.35);
      setupGroup.add(key);
    }
  });
  const space = box(2.2, 0.1, 0.28, keyMat);
  space.position.set(0, -1.33, 2.6);
  setupGroup.add(space);

  // MOUSE
  const mouseMesh = box(0.55, 0.14, 0.9, mat(0x1a1030, 0.7, 0.25, 0x6b21a8, 0.1));
  mouseMesh.position.set(3.6, -1.41, 1.6);
  setupGroup.add(mouseMesh);
  const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.2, 12), mat(0x6d28d9, 0.5, 0.3, 0xa855f7, 0.5));
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(3.6, -1.33, 1.3);
  setupGroup.add(wheel);

  // SPEAKERS
  [-5, 5].forEach(x => {
    const sp = box(0.7, 1.4, 0.5, mat(0x120c20, 0.7, 0.3));
    sp.position.set(x, -0.8, 0.2);
    setupGroup.add(sp);
    const grill = new THREE.Mesh(new THREE.CircleGeometry(0.18, 24), new THREE.MeshBasicMaterial({ color: x < 0 ? 0xa855f7 : 0xec4899, transparent: true, opacity: 0.4 }));
    grill.position.set(x, -0.8, 0.46);
    setupGroup.add(grill);
  });

  // Plant orbs (left)
  [0, 0.3, -0.2].forEach((dx, i) => {
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.12 - i*0.02, 12, 12), new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.8, roughness: 0.4 }));
    orb.position.set(-5.5 + dx, -1.32 + i*0.12, -0.5);
    setupGroup.add(orb);
  });

  // Deco cube (right)
  const deco = box(0.3, 0.3, 0.3, mat(0xec4899, 0.9, 0.1, 0xec4899, 0.8));
  deco.position.set(5.5, -1.32, -0.5);
  setupGroup.add(deco);

  // PARTICLES
  const pCount = 120;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i*3]   = (Math.random()-0.5)*24;
    pPos[i*3+1] = (Math.random()-0.5)*16;
    pPos[i*3+2] = (Math.random()-0.5)*16;
  }
  const pgeo = new THREE.BufferGeometry();
  pgeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pgeo, new THREE.PointsMaterial({ color: 0xa855f7, size: 0.06, transparent: true, opacity: 0.5 }));
  scene.add(particles);

  // DRAG / TOUCH ROTATION
  let isDragging = false, prevX = 0, prevY = 0;
  let rotY = 0.18, rotX = -0.08;
  let velX = 0, velY = 0;
  let autoRotate = true;

  canvas.addEventListener("mousedown", e => { isDragging = true; autoRotate = false; prevX = e.clientX; prevY = e.clientY; canvas.style.cursor = "grabbing"; });
  window.addEventListener("mouseup", () => { isDragging = false; canvas.style.cursor = "grab"; setTimeout(() => { autoRotate = true; }, 3000); });
  window.addEventListener("mousemove", e => {
    if (!isDragging) return;
    velY += (e.clientX - prevX) * 0.008;
    velX += (e.clientY - prevY) * 0.004;
    prevX = e.clientX; prevY = e.clientY;
  });

  canvas.addEventListener("touchstart", e => { isDragging = true; autoRotate = false; prevX = e.touches[0].clientX; prevY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener("touchend", () => { isDragging = false; setTimeout(() => { autoRotate = true; }, 3000); });
  window.addEventListener("touchmove", e => {
    if (!isDragging) return;
    velY += (e.touches[0].clientX - prevX) * 0.008;
    velX += (e.touches[0].clientY - prevY) * 0.004;
    prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
  }, { passive: true });

  canvas.style.cursor = "grab";

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let frame = 0;
  const heroEl = document.getElementById("home");

  function animate() {
    requestAnimationFrame(animate);
    frame++;

    // Stop rendering if hero is not in view (performance optimization)
    if (threeCanvas.classList.contains("hidden")) return;

    rotY += velY; rotX += velX;
    velY *= 0.88; velX *= 0.88;
    rotX = Math.max(-0.35, Math.min(0.3, rotX));
    if (autoRotate) rotY += 0.003;

    setupGroup.rotation.y = rotY;
    setupGroup.rotation.x = rotX;
    particles.rotation.y += 0.0008;
    particles.rotation.x += 0.0003;

    const glow = 0.5 + Math.sin(frame * 0.03) * 0.2;
    screenMat.emissiveIntensity = glow;
    screenLight.intensity = 2.5 + Math.sin(frame * 0.04) * 0.8;
    purpleLight.intensity  = 2   + Math.sin(frame * 0.02) * 0.6;
    pinkLight.intensity    = 1.5 + Math.cos(frame * 0.025) * 0.5;

    renderer.render(scene, camera);
  }
  animate();
})();