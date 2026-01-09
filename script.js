
//     navbar toggle
function toggleMenu() {
  const body = document.body;
  body.classList.toggle("nav-active");
}
// ==========================================


// ======================================================
// 1. INITIAL SETUP & ANIMATIONS (AOS)
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS (Scroll Reveal)
  AOS.init({
    offset: 100,
    duration: 1000,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    delay: 50,
    once: true,
    mirror: false,
    anchorPlacement: "top-bottom",
  });
});

// ======================================================
// 2. PREMIUM LOADER LOGIC (FIXED)
// ======================================================
  document.addEventListener("DOMContentLoaded", () => {
    const loaderWrapper = document.querySelector(".loader-wrapper");
    const progressBar = document.querySelector(".loader-bar-fill");
    const percentText = document.getElementById("loader-percent");

    // SAFETY CHECK: Agar loader HTML mein nahi hai, toh return kar jao
    if (!loaderWrapper) return;

    let currentProgress = 0;
    let loadingInterval;

    // --- FUNCTION TO HIDE LOADER ---
    function hideLoader() {
        clearInterval(loadingInterval); // Loop roko
        
        // Progress bar full karo visuals ke liye
        if (progressBar) progressBar.style.width = "100%";
        if (percentText) percentText.innerText = "100%";

        // Fade Out Animation
        setTimeout(() => {
            loaderWrapper.classList.add("fade-out");
            
            // AOS (Scroll Animation) Trigger karo agar laga hai toh
            const aosElements = document.querySelectorAll(".hero-badge, .hero h1, .hero p, .hero-btns");
            aosElements.forEach(el => el.classList.add("aos-animate"));

            // Loader ko screen se hata do
            setTimeout(() => {
                loaderWrapper.style.display = "none";
            }, 800); 
        }, 200);
    }

    // --- 1. START LOADING ANIMATION ---
    loadingInterval = setInterval(() => {
        // Randomly increase progress
        currentProgress += Math.random() * 5 + 2; 
        
        // 95% par rok do jab tak asli load na ho
        if (currentProgress > 95) currentProgress = 95;

        if (progressBar) progressBar.style.width = `${currentProgress}%`;
        if (percentText) percentText.innerText = `${Math.floor(currentProgress)}%`;
    }, 100);

    // --- 2. JAB SITE LOAD HO JAYE (Real Event) ---
    window.addEventListener("load", () => {
        hideLoader();
    });

    // --- 3. SAFETY BACKUP (Agar Video Load hone mein time lagaye) ---
    // 4 Second baad loader apne aap hat jayega (Zabardasti)
    setTimeout(() => {
        hideLoader();
    }, 4000); 
});
// 4. CUSTOM CURSOR (Desktop Only)
// ======================================================
if (window.matchMedia("(pointer: fine)").matches) {
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");

  if (cursorDot && cursorOutline) {
    window.addEventListener("mousemove", (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      // Dot moves instantly
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      // Outline follows smoothly
      cursorOutline.animate(
        { left: `${posX}px`, top: `${posY}px` },
        { duration: 500, fill: "forwards" }
      );
    });

    // Hover Effects
    const hoverElements = document.querySelectorAll(
      "a, button, .nav-item, .card-visual, .reel-card"
    );
    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
        cursorOutline.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        cursorDot.style.transform = "translate(-50%, -50%) scale(2)";
      });
      el.addEventListener("mouseleave", () => {
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
        cursorOutline.style.backgroundColor = "transparent";
        cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
      });
    });
  }
}
// =================================================================================================
// ======================================================
// 5. THREE.JS PARTICLES (Background)
// ======================================================
function initThree() {
  const container = document.getElementById("canvas-container");
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize Performance
  container.appendChild(renderer.domElement);

  // Particles
  const geometry = new THREE.BufferGeometry();
  const count = window.innerWidth < 768 ? 600 : 1200; // Less particles on mobile
  const posArray = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 60;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
  const material = new THREE.PointsMaterial({
    size: 0.12,
    color: 0x0044ff,
    transparent: true,
    opacity: 0.8,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  camera.position.z = 25;

  // =================================================================================================
  // Mouse Interaction Variables
  let mouseX = 0;
  let mouseY = 0;

  if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    });
  }

  // Animation Loop
  const clock = new THREE.Clock();
  function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Gentle Rotation
    particles.rotation.y = elapsedTime * 0.05;

    // Mouse Influence
    particles.rotation.x += (mouseY * 0.5 - particles.rotation.x) * 0.05;
    particles.rotation.y += (mouseX * 0.5 - particles.rotation.y) * 0.05;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  // Handle Resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
initThree();

// ======================================================
// 6. VIDEO PLAYBACK (Reels)
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  const videos = document.querySelectorAll(".reel-card video");

  if (videos.length > 0) {
    if (window.innerWidth > 900) {
      // --- DESKTOP: Hover to Play ---
      videos.forEach((video) => {
        const card = video.closest(".reel-card");
        if (card) {
          card.addEventListener("mouseenter", () => video.play());
          card.addEventListener("mouseleave", () => {
            video.pause();
            video.currentTime = 0;
          });
        }
      });
    } else {
      // --- MOBILE: Auto Play when Visible ---
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target;
            if (entry.isIntersecting) {
              video.play().catch(() => { }); // Catch autoplay errors
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.6 }
      );

      videos.forEach((video) => observer.observe(video));
    }
  }
});
    
// --- UPDATED UNIVERSAL AUDIO TOGGLE ---
function toggleAudio(btn, event) {
  event.stopPropagation(); // Click ko failne se roko

  // 1. Parent dhundo (Chahe wo Reel Card ho ya Anatomy Video Frame)
  const container = btn.closest('.reel-card') || btn.closest('.video-frame');
  
  // Agar container nahi mila toh wapas jao (Error safety)
  if (!container) return;

  // 2. Video aur Icon dhundo
  const video = container.querySelector('video');
  const icon = btn.querySelector('i');

  // 3. Mute/Unmute Logic
  if (video.muted) {
    video.muted = false; // Unmute (Awaaz On)
    icon.classList.remove('fa-volume-mute');
    icon.classList.add('fa-volume-up');
  } else {
    video.muted = true; // Mute (Awaaz Off)
    icon.classList.remove('fa-volume-up');
    icon.classList.add('fa-volume-mute');
  }
}

// =================================================================================================

// STACKING CARDS SCALE EFFECT (Desktop Only)
window.addEventListener("scroll", () => {
  if (window.innerWidth > 900) { // Sirf Desktop par
    const cards = document.querySelectorAll(".stack-card");
    const stackArea = document.querySelector(".stack-wrapper");

    // Check if section is in view
    if (stackArea) {
      const areaTop = stackArea.offsetTop;
      const scrollY = window.scrollY;

      cards.forEach((card, index) => {
        // Logic: Jitna scroll karoge, utna card thoda scale down hoga
        // Taaki depth feel ho
        const cardTop = card.offsetTop;

        // Agar scroll card tak pahunch gaya hai
        if (scrollY > areaTop + (index * 100)) {
          // Scale kam karo (e.g. 1 -> 0.95 -> 0.9)
          // card.style.transform = `scale(${1 - (index * 0.05)})`; 
          // Upar wala line hata diya taaki sticky na tute,
          // CSS sticky default hi kaafi smooth hai.
        }
      });
    }
  }
});


// =================================================================================================

document.addEventListener("DOMContentLoaded", function () {
  const features = document.querySelectorAll(".feature-item");

  features.forEach(item => {
    // 1. Mouse Over (Desktop)
    item.addEventListener("mouseenter", () => {
      removeActiveClasses();
      item.classList.add("active");
    });

    // 2. Touch/Click (Mobile)
    item.addEventListener("click", () => {
      // If already active, don't do anything (keep it open)
      if (item.classList.contains("active")) return;

      removeActiveClasses();
      item.classList.add("active");
    });
  });

  function removeActiveClasses() {
    features.forEach(item => {
      item.classList.remove("active");
    });
  }
});
//     whatapppp send logic------------


function sendToWhatsapp(e) {
    e.preventDefault();

    // 1. Data Uthao
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var service = document.getElementById("service").value;
    var message = document.getElementById("message").value;

    // 2. Validation
    if(name === "" || service === "") {
        Swal.fire({
            icon: 'warning',
            title: 'MISSING DETAILS',
            text: 'Please fill Name & Service.',
            // Custom Colors for Warning
            color: '#fff',
            confirmButtonColor: '#333'
        });
        return;
    }

    // 3. PREMIUM LOADING POP-UP
    Swal.fire({
        // Custom HTML for Spinner
        html: `
            <div class="custom-loader"></div>
            <h3 style="color:white; margin-top:10px; font-family:'Clash Display', sans-serif;">CONNECTING...</h3>
            <p style="color:#888; font-size:0.9rem;">Securing line with Editxify Agent</p>
        `,
        background: 'transparent', // CSS handle karega glass effect
        showConfirmButton: false, // Button chupao
        allowOutsideClick: false, // Bahar click karne se band na ho
        timer: 2000, // 2 Second ka delay (Feel ke liye)
        
        // Animation Settings (Animate.css style)
        showClass: {
            popup: 'swal2-show',
            backdrop: 'swal2-backdrop-show',
            icon: 'swal2-icon-show'
        },
        hideClass: {
            popup: 'swal2-hide',
            backdrop: 'swal2-backdrop-hide',
            icon: 'swal2-icon-hide'
        }
    }).then(() => {
        // 4. BACKGROUND SEND & REDIRECT
        
        // Auto-Send Logic (CallMeBot)
        fetch('/send_lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, service, message })
        });

        // WhatsApp Redirect Logic
        var phoneStatus = phone === "" ? "Not Provided" : phone;
        var whatsappMessage = 
            "*🔥 New Lead from Website*" + "%0a" +
            "-------------------------" + "%0a" +
            "*👤 Name:* " + name + "%0a" +
            "*📧 Email:* " + email + "%0a" +
            "*📱 Phone:* " + phoneStatus + "%0a" +
            "*🛠 Service:* " + service + "%0a" +
            "-------------------------" + "%0a" +
            "*📝 Msg:* " + message;

        var myNumber = "919696554268"; 
        var url = "https://wa.me/" + myNumber + "?text=" + whatsappMessage;

        window.open(url, '_blank').focus();
    });
}