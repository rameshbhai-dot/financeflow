/* ============================================
   FinanceFlow — Premium Finance Blog
   Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Errors are logged to console only (no pop-ups)

  // ==========================================
  // Theme Toggle (Dark / Light Mode)
  // ==========================================
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle?.querySelector('.theme-icon');
  
  const savedTheme = localStorage.getItem('financeflow-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('financeflow-theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  // ==========================================
  // Navbar Scroll Effect
  // ==========================================
  const navbar = document.querySelector('.navbar');
  const backToTop = document.querySelector('.back-to-top');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Add scrolled class for glass effect
    if (scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 500) {
      backToTop?.classList.add('visible');
    } else {
      backToTop?.classList.remove('visible');
    }

    lastScroll = scrollY;
  }, { passive: true });

  // Back to top click
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================
  // Mobile Navigation Toggle
  // ==========================================
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  mobileToggle?.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks?.classList.toggle('active');
    document.body.style.overflow = navLinks?.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile nav on link click
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle?.classList.remove('active');
      navLinks?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ==========================================
  // Smooth Scroll for Anchor Links
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return; // Skip bare # links (e.g. Privacy Policy, Terms)
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ==========================================
  // Scroll-Triggered Animations
  // ==========================================
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        // Don't unobserve so we keep the animation state
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll, .stagger-children').forEach(el => {
    scrollObserver.observe(el);
  });

  // ==========================================
  // Animated Counters
  // ==========================================
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        entry.target.classList.add('is-animated');
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(el => {
    counterObserver.observe(el);
  });

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-counter'));
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';
    const duration = 2000;
    const startTime = performance.now();
    const startVal = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * eased);
      
      element.textContent = prefix + current.toLocaleString('en-IN') + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Helper to re-animate an existing counter when real data arrives
  window.updateLiveStat = function(id, newTarget) {
    const el = document.getElementById(id);
    if (!el) return;
    
    const target = parseInt(newTarget);
    el.setAttribute('data-counter', target);

    if (el.classList.contains('is-animated')) {
      const currentText = el.textContent.replace(/[^0-9]/g, '');
      const startVal = parseInt(currentText) || 0;
      if (startVal === target) return;

      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 1500;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startVal + (target - startVal) * eased);
        el.textContent = prefix + current.toLocaleString('en-IN') + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }
  };

  // ==========================================
  // Newsletter Form Handler
  // ==========================================
  const newsletterForm = document.getElementById('newsletterForm');

  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]');
    const submitBtn = newsletterForm.querySelector('button');
    
    if (email && email.value) {
      // Simulate submission
      const originalText = submitBtn.textContent;
      submitBtn.textContent = '✓ Subscribed!';
      submitBtn.style.background = 'var(--success)';
      email.value = '';
      
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
      }, 3000);
    }
  });

  // ==========================================
  // Typewriter Effect for Hero
  // ==========================================
  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    const words = ['Smart Investing', 'Financial Freedom', 'Wealth Building', 'Money Mastery'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typewrite() {
      const current = words[wordIndex];
      
      if (isDeleting) {
        typewriterEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
      } else {
        typewriterEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 80;
      }

      if (!isDeleting && charIndex === current.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 300; // Pause before next word
      }

      setTimeout(typewrite, typeSpeed);
    }

    setTimeout(typewrite, 1000);
  }

  // ==========================================
  // Particle Background Effect
  // ==========================================
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const particleColor = isDark ? '245, 158, 11' : '217, 119, 6';

      particles.forEach((p, i) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${particleColor}, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });

    // Pause when not visible
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animationId) drawParticles();
        } else {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      });
    });
    heroObserver.observe(canvas);
  }

  // ==========================================
  // Reading Progress Bar (Optional enhancement)
  // ==========================================
  const progressBar = document.getElementById('readingProgress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / scrollable) * 100;
      progressBar.style.width = `${progress}%`;
    }, { passive: true });
  }

  // ==========================================
  // Featured Posts Click Handlers
  // ==========================================
  const featuredPostsData = [
    {
      title: "5 Smart Investment Strategies That Will Define 2026",
      category: "Investing",
      author: "Arjun Mehta",
      date: "June 20, 2026",
      readTime: "8 min",
      image: "images/investment-strategies.png",
      content: `<p>The investment landscape has fundamentally shifted. Here are the 5 core strategies you need to thrive in 2026.</p>
      <h2>1. AI-Driven Portfolios</h2><p>Algorithms are now accessible to retail investors, democratizing access to high-frequency trading insights.</p>
      <h2>2. Sustainable Alpha</h2><p>ESG is no longer a buzzword, it's a primary alpha driver as regulations tighten globally.</p>
      <h2>3. The Return of Fixed Income</h2><p>Bonds are finally yielding real returns again, making the 60/40 portfolio viable once more.</p>`
    },
    {
      title: "The Ultimate Guide to Building Your Emergency Fund",
      category: "Savings",
      author: "Priya Malhotra",
      date: "June 18, 2026",
      readTime: "6 min",
      image: "images/emergency-fund.png",
      content: `<p>An emergency fund is the bedrock of all personal finance. Without it, you are one crisis away from crushing debt.</p>
      <h2>How much do you need?</h2><p>The standard rule is 3-6 months of essential living expenses (needs, not wants).</p>
      <h2>Where to keep it?</h2><p>High-yield savings accounts or liquid mutual funds. Accessibility is the primary goal, not maximum returns.</p>`
    },
    {
      title: "Crypto vs. Traditional Investing: What's Right for You?",
      category: "Crypto",
      author: "Vikram Rao",
      date: "June 15, 2026",
      readTime: "10 min",
      image: "images/crypto-investing.png",
      content: `<p>The debate continues, but the lines are blurring as traditional institutions embrace digital assets via ETFs.</p>
      <h2>Volatility vs Stability</h2><p>Crypto offers asymmetric upside but terrifying drawdowns. Traditional markets offer slow, steady compounding.</p>
      <h2>The Hybrid Approach</h2><p>For most modern investors, a 95/5 or 90/10 split provides the perfect balance of safety and moonshot exposure.</p>`
    }
  ];

  document.querySelectorAll('.featured-card').forEach((card, index) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      alert('Opening featured article: ' + featuredPostsData[index].title);
      openArticleReader(featuredPostsData[index]);
    });
  });

  // ==========================================
  // Reader Modal (Full Screen Article)
  // ==========================================
  // ==========================================
  // Auth Modals — Sign In / Sign Up
  // ==========================================
  const authOverlay = document.getElementById('authOverlay');
  const signInModal = document.getElementById('signInModal');
  const signUpModal = document.getElementById('signUpModal');
  const authToast = document.getElementById('authToast');
  const authToastText = document.getElementById('authToastText');

  // Open buttons
  const openSignInBtn = document.getElementById('openSignIn');
  const openSignUpBtn = document.getElementById('openSignUp');

  // Close buttons
  const closeSignInBtn = document.getElementById('closeSignIn');
  const closeSignUpBtn = document.getElementById('closeSignUp');

  // Switch links
  const switchToSignUpLink = document.getElementById('switchToSignUp');
  const switchToSignInLink = document.getElementById('switchToSignIn');

  // --- Check if Firebase is available ---
  const isFirebaseReady = (typeof firebase !== 'undefined' && typeof auth !== 'undefined');
  
  // Legal Modals
  const legalModalOverlay = document.getElementById('legalModalOverlay');
  const privacyModal = document.getElementById('privacyModal');
  const termsModal = document.getElementById('termsModal');

  // --- Modal Open/Close Helpers ---
  function openModal(modal) {
    authOverlay?.classList.add('active');
    modal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    readerModal?.classList.remove('active');
    publishModalOverlay?.classList.remove('active');
    publishModal?.classList.remove('active');
    legalModalOverlay?.classList.remove('active');
    privacyModal?.classList.remove('active');
    termsModal?.classList.remove('active');
    authOverlay?.classList.remove('active');
    signInModal?.classList.remove('active');
    signUpModal?.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
  }

  function switchModal(from, to) {
    from?.classList.remove('active');
    setTimeout(() => to?.classList.add('active'), 150);
  }

  // Open Sign In
  const openSignInMobileBtn = document.getElementById('openSignInMobile');
  [openSignInBtn, openSignInMobileBtn].forEach(btn => {
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(signInModal);
    });
  });

  // Open Sign Up
  const openSignUpMobileBtn = document.getElementById('openSignUpMobile');
  [openSignUpBtn, openSignUpMobileBtn].forEach(btn => {
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(signUpModal);
    });
  });

  // Close buttons
  closeSignInBtn?.addEventListener('click', closeAllModals);
  closeSignUpBtn?.addEventListener('click', closeAllModals);

  // Overlay click to close
  authOverlay?.addEventListener('click', closeAllModals);

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // Switch between modals
  switchToSignUpLink?.addEventListener('click', (e) => {
    e.preventDefault();
    switchModal(signInModal, signUpModal);
  });

  switchToSignInLink?.addEventListener('click', (e) => {
    e.preventDefault();
    switchModal(signUpModal, signInModal);
  });

  // --- Password Visibility Toggle ---
  document.querySelectorAll('.auth-password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.textContent = isPassword ? '🙈' : '👁️';
      }
    });
  });

  // --- Password Strength Indicator ---
  const signUpPasswordInput = document.getElementById('signUpPassword');
  const strengthBars = document.querySelectorAll('#passwordStrength .strength-bar');
  const strengthText = document.querySelector('#passwordStrength .strength-text');

  signUpPasswordInput?.addEventListener('input', () => {
    const val = signUpPasswordInput.value;
    const strength = calculatePasswordStrength(val);
    updateStrengthUI(strength);
  });

  function calculatePasswordStrength(password) {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 1) return { level: 'weak', count: 1, label: 'Weak' };
    if (score === 2) return { level: 'fair', count: 2, label: 'Fair' };
    if (score === 3) return { level: 'good', count: 3, label: 'Good' };
    return { level: 'strong', count: 4, label: 'Strong' };
  }

  function updateStrengthUI({ level, count, label }) {
    strengthBars.forEach((bar, i) => {
      bar.className = 'strength-bar';
      if (i < count) bar.classList.add(level);
    });
    if (strengthText) {
      strengthText.textContent = label;
      strengthText.className = 'strength-text ' + level;
    }
  }

  // --- Toast Notification ---
  function showToast(message) {
    if (authToastText) authToastText.textContent = message;
    authToast?.classList.add('visible');
    setTimeout(() => authToast?.classList.remove('visible'), 3500);
  }

  // --- Show Auth Error on Field ---
  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId)?.closest('.auth-field');
    if (!field) return;
    field.classList.add('error');
    let errorText = field.querySelector('.auth-error-text');
    if (!errorText) {
      errorText = document.createElement('span');
      errorText.className = 'auth-error-text';
      field.appendChild(errorText);
    }
    errorText.textContent = message;
    setTimeout(() => field.classList.remove('error'), 4000);
  }

  // --- Map Firebase Error Codes to User-Friendly Messages ---
  function getAuthErrorMessage(errorCode) {
    const messages = {
      'auth/email-already-in-use': 'This email is already registered. Try signing in.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-credential': 'Invalid email or password. Please try again.',
      'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed.',
      'auth/network-request-failed': 'Network error. Check your internet connection.',
      'auth/popup-blocked': 'Popup was blocked. Please allow popups for this site.',
      'auth/operation-not-supported-in-this-environment': 'Google/GitHub sign-in requires a web server (http://). It cannot run from a local file (file://). Please use Email/Password instead.',
      'auth/unauthorized-domain': 'This domain is not authorized for OAuth operations. Please use Email/Password.'
    };
    return messages[errorCode] || ('An error occurred: ' + errorCode);
  }

  // --- Update Nav for Signed-In State ---
  function setSignedInState(name, photoURL, email = '') {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    
    // Always show Write Post button if it exists and user is signed in
    const openPublishModalBtn = document.getElementById('openPublishModal');
    if (openPublishModalBtn) {
      openPublishModalBtn.style.display = 'inline-block';
    }
    
    // Admin check for Delete Post buttons
    const adminActions = document.querySelectorAll('.admin-only-action');
    if (email === 'vs9826301@gmail.com') {
      adminActions.forEach(el => el.style.display = 'inline-block');
    } else {
      adminActions.forEach(el => el.style.display = 'none');
    }
    
    // Hide sign in / sign up buttons
    const openSignInMobileBtn = document.getElementById('openSignInMobile');
    const openSignUpMobileBtn = document.getElementById('openSignUpMobile');
    if (openSignInBtn) openSignInBtn.style.display = 'none';
    if (openSignUpBtn) openSignUpBtn.style.display = 'none';
    if (openSignInMobileBtn) openSignInMobileBtn.style.display = 'none';
    if (openSignUpMobileBtn) openSignUpMobileBtn.style.display = 'none';

    // Remove existing profile if present
    const existingProfile = document.querySelector('.nav-user-profile');
    if (existingProfile) existingProfile.remove();

    // Create user profile element
    const profile = document.createElement('div');
    profile.className = 'nav-user-profile';

    if (photoURL) {
      profile.innerHTML = `
        <img src="${photoURL}" alt="${name}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">
        <span class="nav-user-name">${name.split(' ')[0]}</span>
      `;
    } else {
      profile.innerHTML = `
        <div class="nav-user-avatar">${initials}</div>
        <span class="nav-user-name">${name.split(' ')[0]}</span>
      `;
    }

    // Insert before mobile toggle
    const mobileToggleEl = document.getElementById('mobileToggle');
    mobileToggleEl?.parentNode.insertBefore(profile, mobileToggleEl);

    // Add sign out on click
    profile.addEventListener('click', async () => {
      if (confirm('Sign out of FinanceFlow?')) {
        try {
          if (isFirebaseReady) {
            await auth.signOut();
          }
          clearSignedInState();
          showToast('Signed out successfully ✌️');
        } catch (error) {
          showToast('Error signing out. Please try again.');
        }
      }
    });
  }

  // --- Clear Signed-In State ---
  function clearSignedInState() {
    const profile = document.querySelector('.nav-user-profile');
    if (profile) profile.remove();
    const openSignInMobileBtn = document.getElementById('openSignInMobile');
    const openSignUpMobileBtn = document.getElementById('openSignUpMobile');
    
    if (openSignInBtn) openSignInBtn.style.display = '';
    if (openSignUpBtn) openSignUpBtn.style.display = '';
    if (openSignInMobileBtn) openSignInMobileBtn.style.display = '';
    if (openSignUpMobileBtn) openSignUpMobileBtn.style.display = '';
    
    const adminActions = document.querySelectorAll('.admin-only-action');
    adminActions.forEach(el => el.style.display = 'none');
    
    const openPublishModalBtn = document.getElementById('openPublishModal');
    if (openPublishModalBtn) openPublishModalBtn.style.display = 'none';
  }

  // ==========================================
  // 🔥 Firebase Authentication
  // ==========================================

  if (isFirebaseReady) {
    console.log('🔥 Firebase Auth active');

    // --- Auth State Listener (handles sign in/out + page refresh) ---
    let isFirstAuthCheck = true;

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const displayName = user.displayName || user.email.split('@')[0];
        setSignedInState(displayName, user.photoURL, user.email);
        closeAllModals();

        // Save/update user profile in Firestore
        try {
          await db.collection('users').doc(user.uid).set({
            name: displayName,
            email: user.email,
            photoURL: user.photoURL || null,
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        } catch (e) {
          console.warn('Could not save user profile to Firestore:', e.message);
        }

        // Only show toast on explicit sign-in, not page refresh
        if (!isFirstAuthCheck) {
          showToast(`Welcome back, ${displayName.split(' ')[0]}! 🎉`);
        }
      } else {
        clearSignedInState();
      }
      isFirstAuthCheck = false;
    });

    // --- Sign In with Email/Password ---
    const signInForm = document.getElementById('signInForm');
    signInForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = signInForm.querySelector('.auth-submit');

      const email = document.getElementById('signInEmail')?.value;
      const password = document.getElementById('signInPassword')?.value;
      if (!email || !password) return;

      // Disable button while loading
      submitBtn.textContent = 'Signing in...';
      submitBtn.disabled = true;

      try {
        await auth.signInWithEmailAndPassword(email, password);
        signInForm.reset();
        // Auth state listener handles the rest
      } catch (error) {
        const msg = getAuthErrorMessage(error.code);
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          showFieldError('signInPassword', msg);
        } else if (error.code === 'auth/user-not-found') {
          showFieldError('signInEmail', msg);
        } else {
          showToast(msg);
        }
      } finally {
        submitBtn.textContent = 'Sign In';
        submitBtn.disabled = false;
      }
    });

    // --- Sign Up with Email/Password ---
    const signUpForm = document.getElementById('signUpForm');
    signUpForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = signUpForm.querySelector('.auth-submit');

      const name = document.getElementById('signUpName')?.value;
      const email = document.getElementById('signUpEmail')?.value;
      const password = document.getElementById('signUpPassword')?.value;
      const confirmPw = document.getElementById('signUpConfirm')?.value;

      // Validate passwords match
      if (password !== confirmPw) {
        showFieldError('signUpConfirm', 'Passwords do not match');
        return;
      }

      if (!name || !email || !password) return;

      // Disable button while loading
      submitBtn.textContent = 'Creating account...';
      submitBtn.disabled = true;

      try {
        const result = await auth.createUserWithEmailAndPassword(email, password);

        // Set display name on Firebase user profile
        await result.user.updateProfile({ displayName: name });

        // Save user profile to Firestore
        await db.collection('users').doc(result.user.uid).set({
          name: name,
          email: email,
          photoURL: null,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });

        signUpForm.reset();
        // Reset password strength UI
        strengthBars.forEach(bar => bar.className = 'strength-bar');
        if (strengthText) {
          strengthText.textContent = 'Password strength';
          strengthText.className = 'strength-text';
        }

        showToast(`Account created! Welcome, ${name.split(' ')[0]}! 🎉`);
        // Auth state listener handles nav update
      } catch (error) {
        const msg = getAuthErrorMessage(error.code);
        if (error.code === 'auth/email-already-in-use') {
          showFieldError('signUpEmail', msg);
        } else if (error.code === 'auth/weak-password') {
          showFieldError('signUpPassword', msg);
        } else {
          showToast(msg);
        }
      } finally {
        submitBtn.textContent = 'Create Account';
        submitBtn.disabled = false;
      }
    });

    // --- Google Sign-In ---
    document.getElementById('googleSignIn')?.addEventListener('click', async () => {
      try {
        await auth.signInWithPopup(googleProvider);
      } catch (error) {
        if (error.code !== 'auth/popup-closed-by-user') {
          showToast(getAuthErrorMessage(error.code));
        }
      }
    });

    document.getElementById('googleSignUp')?.addEventListener('click', async () => {
      try {
        await auth.signInWithPopup(googleProvider);
      } catch (error) {
        if (error.code !== 'auth/popup-closed-by-user') {
          showToast(getAuthErrorMessage(error.code));
        }
      }
    });

    // --- GitHub Sign-In ---
    document.getElementById('githubSignIn')?.addEventListener('click', async () => {
      try {
        await auth.signInWithPopup(githubProvider);
      } catch (error) {
        if (error.code !== 'auth/popup-closed-by-user') {
          showToast(getAuthErrorMessage(error.code));
        }
      }
    });

    document.getElementById('githubSignUp')?.addEventListener('click', async () => {
      try {
        await auth.signInWithPopup(githubProvider);
      } catch (error) {
        if (error.code !== 'auth/popup-closed-by-user') {
          showToast(getAuthErrorMessage(error.code));
        }
      }
    });

  } else {
    // ==========================================
    // Fallback: localStorage Auth (no Firebase)
    // ==========================================
    console.warn('⚠️ Firebase not configured. Using localStorage auth as fallback.');

    // Check for existing session
    const savedUser = localStorage.getItem('financeflow-user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setSignedInState(user.name, null, user.email);
      } catch (e) { /* ignore */ }
    }

    // Sign In Form
    const signInForm = document.getElementById('signInForm');
    signInForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('signInEmail')?.value;
      const password = document.getElementById('signInPassword')?.value;
      if (!email || !password) return;

      const demoName = email.split('@')[0].replace(/[^a-zA-Z ]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      localStorage.setItem('financeflow-user', JSON.stringify({ name: demoName, email }));
      closeAllModals();
      setSignedInState(demoName, null, email);
      showToast(`Welcome, ${demoName.split(' ')[0]}! 🎉`);
      signInForm.reset();
    });

    // Sign Up Form
    const signUpForm = document.getElementById('signUpForm');
    signUpForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signUpName')?.value;
      const email = document.getElementById('signUpEmail')?.value;
      const password = document.getElementById('signUpPassword')?.value;
      const confirmPw = document.getElementById('signUpConfirm')?.value;

      if (password !== confirmPw) {
        showFieldError('signUpConfirm', 'Passwords do not match');
        return;
      }
      if (!name || !email || !password) return;

      localStorage.setItem('financeflow-user', JSON.stringify({ name, email }));
      closeAllModals();
      setSignedInState(name, null, email);
      showToast(`Welcome, ${name.split(' ')[0]}! 🎉`);
      signUpForm.reset();
      strengthBars.forEach(bar => bar.className = 'strength-bar');
      if (strengthText) { strengthText.textContent = 'Password strength'; strengthText.className = 'strength-text'; }
    });
  }

  // ==========================================
  // 🔥 Firestore — Blog Posts
  // ==========================================

  // Default blog posts data (used for seeding & fallback)
  const defaultPosts = [
    {
      title: "How to Budget Like a Pro: The 50/30/20 Rule Explained",
      excerpt: "The 50/30/20 rule is one of the simplest yet most powerful budgeting frameworks. Learn how to allocate 50% to needs, 30% to wants, and 20% to savings.",
      category: "Budgeting",
      author: "Priya Malhotra",
      date: "June 19, 2026",
      readTime: "5 min",
      image: "images/budgeting.png",
      content: `
        <p>The 50/30/20 rule is one of the simplest yet most powerful budgeting frameworks out there. Popularized by Senator Elizabeth Warren in her book <em>All Your Worth: The Ultimate Lifetime Money Plan</em>, this rule provides a straightforward way to divide your after-tax income into three distinct buckets.</p>
        <h2>The 50%: Needs</h2>
        <p>Half of your income should go towards essential living expenses. These are the bills that absolutely must be paid and are necessary for survival. This includes rent or mortgage payments, groceries, basic utilities, insurance premiums, and minimum debt payments.</p>
        <h2>The 30%: Wants</h2>
        <p>This is the fun bucket! 30% of your income can be allocated to non-essential expenses. Think dining out, entertainment, vacations, the latest gadgets, or that premium gym membership. It's crucial to have this bucket so you don't feel deprived, making your budget sustainable long-term.</p>
        <h2>The 20%: Savings and Investments</h2>
        <p>The final 20% is dedicated to your future self. This includes building an emergency fund, investing in the stock market (like mutual funds or ETFs), maxing out your retirement accounts, or making extra payments on high-interest debt.</p>
        <blockquote>"A budget is telling your money where to go instead of wondering where it went." — Dave Ramsey</blockquote>
        <p>Start tracking your expenses for a month without changing any habits, then categorize them into these three buckets. You might be surprised to find your "wants" are eating into your "savings". Adjust gradually, and you'll be budgeting like a pro in no time.</p>
      `
    },
    {
      title: "Tax-Saving Tips Every Salaried Employee Should Know in India",
      excerpt: "From Section 80C to HRA exemptions, discover the most effective tax-saving instruments available under the old and new Indian tax regimes.",
      category: "Tax Tips",
      author: "Rahul Kapoor",
      date: "June 17, 2026",
      readTime: "7 min",
      image: "images/tax-saving.png",
      content: `
        <p>Navigating the Indian tax system can feel like deciphering an ancient language. However, with the right knowledge, salaried employees can legally save a significant portion of their income from the taxman. Let's explore the most effective ways to optimize your taxes.</p>
        <h2>Mastering Section 80C</h2>
        <p>Section 80C is the cornerstone of tax planning in India, offering deductions up to ₹1.5 Lakhs per financial year. But where should you invest?</p>
        <ul>
          <li><strong>ELSS (Equity Linked Savings Scheme):</strong> The wealth builder. With a short lock-in period of just 3 years, ELSS offers the dual benefit of tax deduction and equity market returns.</li>
          <li><strong>PPF (Public Provident Fund):</strong> The safe haven. Offering guaranteed tax-free returns with a 15-year lock-in, it's perfect for conservative investors.</li>
          <li><strong>EPF (Employee Provident Fund):</strong> Your automatic savings. Both your contribution and your employer's contribution count here.</li>
        </ul>
        <h2>Beyond 80C: Hidden Gems</h2>
        <p>Don't stop at 80C. There are several other sections you can leverage:</p>
        <p><strong>Section 80D (Health Insurance):</strong> You can claim up to ₹25,000 for premiums paid for yourself and your family, and an additional ₹50,000 for senior citizen parents.</p>
        <p><strong>NPS (National Pension System) under 80CCD(1B):</strong> An exclusive extra deduction of ₹50,000 specifically for NPS contributions, over and above the 80C limit!</p>
        <blockquote>Remember: Tax planning should align with your financial goals, not just be a desperate scramble in March to save tax.</blockquote>
      `
    },
    {
      title: "10 Side Hustles That Can Earn You ₹50,000/Month in 2026",
      excerpt: "From freelancing and content creation to dropshipping and stock photography — explore proven side hustles that Indians are using to build secondary income.",
      category: "Side Hustles",
      author: "Ananya Sharma",
      date: "June 14, 2026",
      readTime: "9 min",
      image: "images/side-hustles.png",
      content: `
        <p>In 2026, relying on a single source of income is increasingly seen as a financial risk. The gig economy has exploded, and the barrier to entry for starting a side hustle has never been lower. Whether you want to pay off debt, invest more, or simply have more disposable income, here are proven ways to earn an extra ₹50,000 per month.</p>
        <h2>1. Freelance High-Income Skills</h2>
        <p>If you have skills in software development, UI/UX design, or specialized copywriting, platforms like Upwork and Fiverr are goldmines. Instead of competing on price, niche down. Become the "go-to AI Prompt Engineer" or the "expert Web3 copywriter." Specialization commands higher rates.</p>
        <h2>2. Digital Product Creation</h2>
        <p>Create once, sell infinitely. This is the beauty of digital products. You can create Notion templates, eBooks, or comprehensive video courses on platforms like Gumroad or Udemy. If you know how to solve a specific problem well, people will pay for your framework.</p>
        <h2>3. Niche Newsletter Publishing</h2>
        <p>Newsletters are making a massive comeback. Platforms like Substack allow you to build an audience around a hyper-specific topic (e.g., "Vegan Baking in Mumbai" or "Tech Policy in India"). Once you have a loyal readership, you can monetize through paid subscriptions or sponsorships.</p>
        <blockquote>"The most successful side hustles don't feel like work because they are built at the intersection of your skills and your genuine curiosities."</blockquote>
        <p>The key to hitting the ₹50,000 mark isn't trying to do all ten of these. It's picking ONE that aligns with your skills, dedicating 10 hours a week to it consistently for 6 months, and iterating based on market feedback.</p>
      `
    },
    {
      title: "Understanding Mutual Funds: A Beginner's Guide for Indian Investors",
      excerpt: "Confused about equity, debt, and hybrid mutual funds? This comprehensive guide breaks down every type of mutual fund, their risk profiles, and how to pick the best ones.",
      category: "Investing",
      author: "Arjun Mehta",
      date: "June 12, 2026",
      readTime: "8 min",
      image: "images/investment-strategies.png",
      content: `
        <p>Mutual funds have revolutionized investing for the middle class. By pooling money from thousands of investors, they offer professional management and diversification that was previously only accessible to the ultra-wealthy. But with thousands of funds available, where do you start?</p>
        <h2>The Three Main Categories</h2>
        <p>At their core, mutual funds invest in different asset classes. Understanding these is the first step to building a portfolio.</p>
        <ul>
          <li><strong>Equity Funds:</strong> These invest primarily in stocks. They offer the highest potential returns over the long term but come with high short-term volatility. Best for goals that are 5+ years away.</li>
          <li><strong>Debt Funds:</strong> These invest in fixed-income securities like government bonds and corporate debentures. They are relatively safe and provide stable, predictable returns. Best for short-term goals (1-3 years).</li>
          <li><strong>Hybrid Funds:</strong> A mix of both equity and debt. They aim to balance risk and reward, making them great for first-time investors who want growth but can't stomach extreme market swings.</li>
        </ul>
        <h2>Active vs. Passive Funds</h2>
        <p>This is the great debate in modern finance. <strong>Active funds</strong> are managed by a human fund manager who tries to beat the market by picking winning stocks. They charge a higher fee (Expense Ratio). <strong>Passive funds (Index Funds)</strong> simply track an existing market index (like the Nifty 50) automatically. They have very low fees.</p>
        <blockquote>Warren Buffett famously won a million-dollar bet that a simple S&P 500 index fund would outperform a basket of highly paid hedge funds over 10 years. He was right.</blockquote>
        <p>For beginners, starting with a broad market Index Fund is often the smartest, lowest-stress way to begin your wealth-building journey.</p>
      `
    },
    {
      title: "How to Start a SIP and Build Long-Term Wealth with ₹500/Month",
      excerpt: "Systematic Investment Plans (SIPs) are the most accessible way to build wealth in India. Learn how starting with just ₹500 per month can grow into ₹1 Crore.",
      category: "Savings",
      author: "Neha Joshi",
      date: "June 10, 2026",
      readTime: "6 min",
      image: "images/emergency-fund.png",
      content: `
        <p>The biggest myth in investing is that you need to be rich to start. The truth is, you get rich <em>by</em> starting. And in India, the Systematic Investment Plan (SIP) is the ultimate tool for the everyday wealth builder.</p>
        <h2>The Magic of Compounding</h2>
        <p>A SIP allows you to invest a fixed amount of money (as little as ₹500) into a mutual fund at regular intervals (usually monthly). This disciplined approach harnesses the power of compound interest.</p>
        <p>Let's look at the math. If you invest just ₹5,000 every month in an equity mutual fund that returns an average of 12% annually:</p>
        <ul>
          <li>In 10 years, you will have invested ₹6 Lakhs, but your portfolio will be worth <strong>₹11.6 Lakhs</strong>.</li>
          <li>In 20 years, your investment of ₹12 Lakhs will grow to <strong>₹50 Lakhs</strong>.</li>
          <li>In 30 years, an investment of ₹18 Lakhs will explode to an astonishing <strong>₹1.76 Crores</strong>.</li>
        </ul>
        <h2>Rupee Cost Averaging</h2>
        <p>The other superpower of a SIP is Rupee Cost Averaging. Because you invest a fixed amount every month regardless of market conditions, you automatically buy more units when the market is down (prices are low) and fewer units when the market is up (prices are high). This completely removes the stressful need to "time the market".</p>
        <blockquote>"Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it." — Albert Einstein</blockquote>
        <p>Don't wait for the "perfect time" to invest. The best time to plant a tree was 20 years ago. The second best time is today. Set up that ₹500 SIP right now.</p>
      `
    },
    {
      title: "Global Crypto Regulations in 2026: What Indian Investors Need to Know",
      excerpt: "With India's 30% crypto tax and 1% TDS in place, navigating the regulatory landscape is crucial. We break down rules across India, US, EU, and how they affect your portfolio.",
      category: "Crypto",
      author: "Vikram Rao",
      date: "June 8, 2026",
      readTime: "11 min",
      image: "images/crypto-investing.png",
      content: `
        <p>The wild west days of cryptocurrency are officially over. As we move deeper into 2026, global governments have established firm regulatory frameworks. For Indian investors, understanding these rules is no longer optional—it's critical for protecting your portfolio and staying out of legal trouble.</p>
        <h2>The Indian Landscape: Tax Heavy</h2>
        <p>India has taken a stringent approach to virtual digital assets (VDAs). The current rules remain strict:</p>
        <ul>
          <li><strong>Flat 30% Tax:</strong> All profits from crypto trading are taxed at a flat 30%, irrespective of your income tax slab.</li>
          <li><strong>No Set-Offs:</strong> Losses in one crypto cannot be set off against gains in another. If you make ₹1 Lakh on Bitcoin and lose ₹50,000 on Ethereum, you still pay 30% tax on the full ₹1 Lakh Bitcoin gain.</li>
          <li><strong>1% TDS:</strong> A 1% Tax Deducted at Source applies to all crypto transactions, significantly reducing the viability of day trading and high-frequency arbitrage.</li>
        </ul>
        <h2>The Global Context: MiCA and the SEC</h2>
        <p>While India focuses on taxation, other jurisdictions are focusing on market structure. The European Union's <em>Markets in Crypto-Assets (MiCA)</em> regulation is now fully in effect, providing the world's most comprehensive framework for stablecoin issuers and exchanges. It has made Europe a hub for compliant crypto businesses.</p>
        <p>Meanwhile, in the US, the SEC has shifted from enforcement-only to creating clear registration pathways for tokens, classifying the majority of Layer-1 tokens as commodities rather than securities.</p>
        <blockquote>Regulatory clarity, while painful in the short term regarding taxes, is what will eventually bring institutional trillions into the crypto space.</blockquote>
        <p>For the Indian investor, the strategy must shift from quick speculative flips to long-term holding of blue-chip assets like Bitcoin and Ethereum, minimizing transaction volume to avoid excessive TDS erosion.</p>
      `
    },
    // ===== NEW POSTS: 2 more per category =====
    // --- Budgeting #2 ---
    {
      title: "Zero-Based Budgeting: Give Every Rupee a Job",
      excerpt: "Zero-based budgeting ensures every single rupee of your income is assigned a purpose — from bills to savings to fun money. Here's how to master it.",
      category: "Budgeting",
      author: "Priya Malhotra",
      date: "June 5, 2026",
      readTime: "6 min",
      image: "images/budgeting.png",
      content: `
        <p>Unlike the 50/30/20 rule, zero-based budgeting (ZBB) takes a more granular approach. The core principle is simple: your income minus your expenses should equal exactly zero. Every rupee has a job.</p>
        <h2>How It Works</h2>
        <p>At the beginning of each month, you list all your expected income sources. Then, you allocate every single rupee to a specific category until you reach ₹0. This doesn't mean you spend everything — "savings" and "investments" are categories too!</p>
        <h2>Step-by-Step Guide</h2>
        <ul>
          <li><strong>Step 1:</strong> Write down your total monthly income (salary, freelance, etc.).</li>
          <li><strong>Step 2:</strong> List every expense category: rent, groceries, transport, subscriptions, SIPs, emergency fund, entertainment.</li>
          <li><strong>Step 3:</strong> Assign a specific amount to each category until the remaining balance is ₹0.</li>
          <li><strong>Step 4:</strong> Track your spending throughout the month and adjust as needed.</li>
        </ul>
        <h2>Why It Works Better for Some People</h2>
        <p>ZBB forces you to be intentional with every purchase. There's no vague "leftover money" that mysteriously disappears. People who struggle with impulse spending often find this method transformative because it creates accountability for every rupee.</p>
        <blockquote>"A zero-based budget doesn't mean you have zero money. It means you have zero money without a purpose." — Rachel Cruze</blockquote>
        <p>Try ZBB for just one month. You'll be amazed at how much more control you feel over your finances.</p>
      `
    },
    // --- Budgeting #3 ---
    {
      title: "5 Free Apps That Make Budgeting Effortless in India",
      excerpt: "Struggling to track expenses manually? These 5 free Indian budgeting apps automate everything from UPI tracking to investment monitoring.",
      category: "Budgeting",
      author: "Sneha Gupta",
      date: "May 28, 2026",
      readTime: "4 min",
      image: "images/budgeting.png",
      content: `
        <p>Manual budgeting with spreadsheets is powerful, but let's be honest — most of us forget to log expenses after a few days. Thankfully, India's fintech revolution has produced some incredible free apps that do the heavy lifting for you.</p>
        <h2>1. Walnut (by Axio)</h2>
        <p>Walnut automatically reads your SMS transaction alerts and categorizes expenses. It tracks UPI, card transactions, and even bill payments. The visual spending breakdown is eye-opening.</p>
        <h2>2. Money Manager</h2>
        <p>A clean, no-nonsense expense tracker with double-entry bookkeeping. Perfect for those who want detailed control without complexity. Supports multiple accounts and generates beautiful charts.</p>
        <h2>3. ET Money</h2>
        <p>More than just a budgeter — ET Money tracks your mutual funds, insurance, and expenses all in one place. It even analyses your spending patterns and suggests where to cut back.</p>
        <h2>4. Goodbudget</h2>
        <p>Based on the envelope budgeting method, Goodbudget lets you create virtual envelopes for each spending category. When an envelope is empty, you stop spending in that category. Simple and effective.</p>
        <h2>5. Fi Money</h2>
        <p>A neo-banking app that automatically categorizes every UPI and card transaction. Its "Ask Fi" AI feature answers questions like "How much did I spend on food this month?" instantly.</p>
        <blockquote>The best budgeting app is the one you actually use consistently. Try two or three and stick with the one that feels natural.</blockquote>
      `
    },
    // --- Tax Tips #2 ---
    {
      title: "Old Tax Regime vs New Tax Regime: Which One Saves You More?",
      excerpt: "The 2026 budget brought major changes to the new tax regime. We compare both regimes with real salary examples to help you pick the right one.",
      category: "Tax Tips",
      author: "Rahul Kapoor",
      date: "June 2, 2026",
      readTime: "8 min",
      image: "images/tax-saving.png",
      content: `
        <p>Every financial year, millions of Indian taxpayers face the same dilemma: should I stick with the old tax regime or switch to the new one? With the 2026 budget increasing the new regime's standard deduction and tweaking slab rates, this question is more relevant than ever.</p>
        <h2>The New Regime (Default)</h2>
        <p>The new regime offers lower tax rates but removes almost all deductions and exemptions. As of 2026:</p>
        <ul>
          <li>Income up to ₹3 Lakhs: Nil</li>
          <li>₹3-7 Lakhs: 5%</li>
          <li>₹7-10 Lakhs: 10%</li>
          <li>₹10-12 Lakhs: 15%</li>
          <li>₹12-15 Lakhs: 20%</li>
          <li>Above ₹15 Lakhs: 30%</li>
        </ul>
        <h2>The Old Regime</h2>
        <p>Higher tax rates, but you get to claim deductions under 80C (₹1.5L), 80D (health insurance), HRA exemption, LTA, and more. If you have significant investments and rent payments, the old regime can sometimes result in lower tax.</p>
        <h2>The Verdict</h2>
        <p>If your total deductions exceed ₹3.75 Lakhs, the old regime usually wins. If you have minimal deductions (no home loan, no HRA, minimal investments), the new regime is almost always better.</p>
        <blockquote>Pro tip: Use the income tax calculator on the official IT department website to compare your exact liability under both regimes before filing.</blockquote>
      `
    },
    // --- Tax Tips #3 ---
    {
      title: "How Freelancers and Gig Workers Should File Taxes in India",
      excerpt: "Freelancers face unique tax challenges — from advance tax to GST registration. This guide covers everything self-employed professionals need to know.",
      category: "Tax Tips",
      author: "Kavita Iyer",
      date: "May 20, 2026",
      readTime: "7 min",
      image: "images/tax-saving.png",
      content: `
        <p>If you're a freelancer, content creator, or gig worker in India, your tax situation is fundamentally different from a salaried employee. Nobody deducts TDS for you automatically, and you're responsible for calculating and paying your own taxes. Here's your complete guide.</p>
        <h2>Income Classification</h2>
        <p>Freelance income falls under "Profits and Gains from Business or Profession" (not "Income from Salary"). This means you can deduct legitimate business expenses like your laptop, internet bills, co-working space fees, and software subscriptions before calculating taxable income.</p>
        <h2>Advance Tax: Pay As You Earn</h2>
        <p>If your total tax liability exceeds ₹10,000 in a year, you must pay advance tax in quarterly installments:</p>
        <ul>
          <li>15% by June 15</li>
          <li>45% by September 15</li>
          <li>75% by December 15</li>
          <li>100% by March 15</li>
        </ul>
        <p>Missing these deadlines attracts interest under Sections 234B and 234C.</p>
        <h2>GST Registration</h2>
        <p>If your annual revenue exceeds ₹20 Lakhs (₹10 Lakhs for special category states), GST registration becomes mandatory. Many freelancers opt for the Composition Scheme for simplified compliance.</p>
        <blockquote>Keep meticulous records of every business expense. A well-maintained expense log can save you lakhs in taxes over a year.</blockquote>
      `
    },
    // --- Side Hustles #2 ---
    {
      title: "How to Start Dropshipping in India with Zero Inventory",
      excerpt: "Dropshipping lets you run an online store without holding any stock. Learn how to set up a profitable dropshipping business from your bedroom.",
      category: "Side Hustles",
      author: "Ananya Sharma",
      date: "May 30, 2026",
      readTime: "8 min",
      image: "images/side-hustles.png",
      content: `
        <p>Dropshipping is a business model where you sell products online without ever holding inventory. When a customer places an order, the supplier ships the product directly to them. Your profit is the difference between your selling price and the supplier's price.</p>
        <h2>Getting Started: The Basics</h2>
        <p>You need three things: a niche, a supplier, and an online store. Platforms like Shopify or WooCommerce make setting up a store incredibly easy, even without coding knowledge.</p>
        <h2>Finding Winning Products</h2>
        <ul>
          <li><strong>Solve a problem:</strong> Products that solve everyday problems sell better than "cool" gadgets. Think ergonomic back supports, phone sanitizers, or pet grooming tools.</li>
          <li><strong>Check demand:</strong> Use Google Trends to verify that interest in your product is growing, not declining.</li>
          <li><strong>Avoid fragile items:</strong> Since you don't control shipping, avoid products that break easily in transit.</li>
        </ul>
        <h2>Indian Supplier Platforms</h2>
        <p>While AliExpress is popular globally, Indian dropshippers should also explore IndiaMart, GlowRoad, and Meesho for domestic suppliers. Domestic shipping means faster delivery and happier customers.</p>
        <blockquote>The biggest mistake new dropshippers make is trying to sell everything. Pick one niche, master it, then expand.</blockquote>
        <p>Start with a budget of ₹5,000-10,000 for your store setup and initial advertising. Test 3-5 products, double down on the winner, and scale from there.</p>
      `
    },
    // --- Side Hustles #3 ---
    {
      title: "Earn Passive Income with YouTube Automation in 2026",
      excerpt: "You don't need to show your face to earn on YouTube. Learn how faceless YouTube channels are generating ₹1-5 Lakhs per month on autopilot.",
      category: "Side Hustles",
      author: "Rohan Desai",
      date: "May 18, 2026",
      readTime: "7 min",
      image: "images/side-hustles.png",
      content: `
        <p>YouTube Automation refers to running a YouTube channel where you outsource every aspect of content creation — scripting, voiceover, editing, and thumbnails — while you manage the strategy and collect the revenue. It's a legitimate business model that's booming in 2026.</p>
        <h2>How It Works</h2>
        <p>You identify a profitable niche (finance, tech reviews, history, top-10 lists), hire freelancers to create the content, and upload consistently. The channel earns money through YouTube AdSense, sponsorships, and affiliate links.</p>
        <h2>The Economics</h2>
        <ul>
          <li><strong>Video cost:</strong> ₹2,000-5,000 per video (script + voiceover + editing)</li>
          <li><strong>Upload frequency:</strong> 3-4 videos per week</li>
          <li><strong>Break-even:</strong> Typically 3-6 months to reach monetization (1,000 subscribers + 4,000 watch hours)</li>
          <li><strong>Revenue potential:</strong> Finance and tech niches earn ₹300-800 per 1,000 views (CPM)</li>
        </ul>
        <h2>Best Niches for Indian Creators</h2>
        <p>High-CPM niches include personal finance, stock market analysis, tech comparisons, and business case studies. A channel with 500K monthly views in the finance niche can earn ₹2-5 Lakhs per month from ads alone.</p>
        <blockquote>Think of a YouTube automation channel as a digital real estate asset. It costs money to build, but once established, it generates income while you sleep.</blockquote>
      `
    },
    // --- Investing #2 ---
    {
      title: "Gold vs Stocks vs Real Estate: Where Should You Invest in 2026?",
      excerpt: "Every asset class has its moment. We compare gold, equities, and property across returns, liquidity, and risk to help you allocate wisely.",
      category: "Investing",
      author: "Arjun Mehta",
      date: "May 25, 2026",
      readTime: "9 min",
      image: "images/investment-strategies.png",
      content: `
        <p>The eternal debate among Indian investors: should you buy gold, invest in the stock market, or purchase property? Each asset class has distinct advantages and drawbacks, and the "best" choice depends entirely on your financial situation, goals, and risk tolerance.</p>
        <h2>Gold: The Safe Haven</h2>
        <p>Gold has been an integral part of Indian culture and wealth preservation for centuries. In 2026, with global uncertainty, gold continues to perform well.</p>
        <ul>
          <li><strong>Pros:</strong> Hedge against inflation, high liquidity (especially Sovereign Gold Bonds and Gold ETFs), no maintenance cost for digital gold.</li>
          <li><strong>Cons:</strong> No regular income (no dividends or rent), long-term returns historically lower than equities (8-10% vs 12-15%).</li>
        </ul>
        <h2>Stocks: The Wealth Builder</h2>
        <p>Equities have historically delivered the highest inflation-adjusted returns over long periods. With India's GDP growth story intact, the Nifty 50 remains a compelling long-term bet.</p>
        <ul>
          <li><strong>Pros:</strong> Highest long-term returns, highly liquid, easy to start with just ₹500 via SIPs, dividend income.</li>
          <li><strong>Cons:</strong> High short-term volatility, emotional decision-making can erode returns.</li>
        </ul>
        <h2>Real Estate: The Tangible Asset</h2>
        <ul>
          <li><strong>Pros:</strong> Rental income, leverage through home loans, tangible asset you can live in.</li>
          <li><strong>Cons:</strong> Massive capital requirement, poor liquidity, maintenance headaches, transaction costs (stamp duty, registration).</li>
        </ul>
        <blockquote>The smartest investors don't pick one — they diversify across all three. A common allocation: 60% equities, 20% gold, 20% real estate (through REITs if not buying property).</blockquote>
      `
    },
    // --- Investing #3 ---
    {
      title: "How to Read a Stock's Balance Sheet Like a Pro",
      excerpt: "Stop investing blindly. Learn to read the three key financial statements — balance sheet, P&L, and cash flow — to pick fundamentally strong stocks.",
      category: "Investing",
      author: "Deepak Shenoy",
      date: "May 15, 2026",
      readTime: "10 min",
      image: "images/investment-strategies.png",
      content: `
        <p>Most retail investors pick stocks based on tips, news headlines, or social media hype. The professionals, however, start with one thing: the financial statements. Learning to read a company's balance sheet is the single most valuable skill you can develop as an investor.</p>
        <h2>The Balance Sheet: A Snapshot</h2>
        <p>The balance sheet shows what a company owns (Assets), what it owes (Liabilities), and what belongs to shareholders (Equity) at a specific point in time. The fundamental equation is:</p>
        <p><strong>Assets = Liabilities + Shareholders' Equity</strong></p>
        <h2>Key Ratios to Calculate</h2>
        <ul>
          <li><strong>Debt-to-Equity Ratio:</strong> Total Debt / Shareholders' Equity. A ratio above 1.0 means the company owes more than it owns. For most industries, below 0.5 is considered healthy.</li>
          <li><strong>Current Ratio:</strong> Current Assets / Current Liabilities. A ratio above 1.5 means the company can comfortably meet short-term obligations.</li>
          <li><strong>Return on Equity (ROE):</strong> Net Income / Shareholders' Equity. Measures how efficiently the company uses shareholder money. Above 15% is generally excellent.</li>
        </ul>
        <h2>Red Flags to Watch</h2>
        <p>Rising debt with declining revenue, increasing "other income" masking weak core business, and frequent equity dilution (issuing new shares) are all warning signs that a company may not be as strong as its stock price suggests.</p>
        <blockquote>"Price is what you pay. Value is what you get." — Warren Buffett. The balance sheet tells you the value.</blockquote>
      `
    },
    // --- Savings #2 ---
    {
      title: "Fixed Deposits vs Liquid Funds: Where to Park Your Emergency Fund",
      excerpt: "Your emergency fund needs safety AND accessibility. We compare FDs and liquid mutual funds to find the best home for your rainy-day money.",
      category: "Savings",
      author: "Neha Joshi",
      date: "May 22, 2026",
      readTime: "5 min",
      image: "images/emergency-fund.png",
      content: `
        <p>You've built your emergency fund — congratulations! But where should you keep it? Stuffing cash under your mattress loses value to inflation. A regular savings account earns barely 3%. Let's compare two smarter options.</p>
        <h2>Fixed Deposits (FDs)</h2>
        <p>The classic Indian choice. FDs offer guaranteed returns and are backed by deposit insurance (up to ₹5 Lakhs per bank).</p>
        <ul>
          <li><strong>Current rates:</strong> 6.5-7.5% for 1-year FDs (as of 2026)</li>
          <li><strong>Liquidity:</strong> Premature withdrawal is possible but incurs a 0.5-1% penalty</li>
          <li><strong>Taxation:</strong> Interest is fully taxable at your income slab rate</li>
        </ul>
        <h2>Liquid Mutual Funds</h2>
        <p>Liquid funds invest in ultra-short-term debt instruments (maturity under 91 days). They're designed for parking surplus cash.</p>
        <ul>
          <li><strong>Current returns:</strong> 6-7% (comparable to FDs)</li>
          <li><strong>Liquidity:</strong> Instant redemption up to ₹50,000. Full redemption within 1 business day</li>
          <li><strong>Taxation:</strong> Gains taxed at your slab rate, but only on the gains (not the principal)</li>
        </ul>
        <h2>The Verdict</h2>
        <p>For emergency funds, liquid funds win on accessibility. Keep 1-2 months of expenses in a liquid fund for instant access, and the remaining 3-4 months in a short-term FD ladder (multiple FDs maturing at different intervals).</p>
        <blockquote>The best emergency fund strategy combines both: instant access for true emergencies, and slightly higher returns for the rest.</blockquote>
      `
    },
    // --- Savings #3 ---
    {
      title: "The Latte Factor: How Small Daily Expenses Drain Your Wealth",
      excerpt: "That ₹200 daily coffee habit costs you ₹73,000 a year. Here's how small, mindless spending silently destroys your savings potential.",
      category: "Savings",
      author: "Meera Krishnan",
      date: "May 10, 2026",
      readTime: "5 min",
      image: "images/emergency-fund.png",
      content: `
        <p>David Bach coined the term "The Latte Factor" to describe how small, recurring, seemingly insignificant expenses can add up to enormous sums over time. In India, it's not just lattes — it's the daily chai from the tapri, the Swiggy convenience orders, and the impulse Amazon purchases.</p>
        <h2>The Math That Will Shock You</h2>
        <p>Let's say you spend ₹300 per day on "small" indulgences — a fancy coffee, a snack, a quick auto ride instead of walking. That's:</p>
        <ul>
          <li>₹9,000 per month</li>
          <li>₹1,08,000 per year</li>
          <li>If invested in a mutual fund at 12% returns: <strong>₹25 Lakhs in 10 years</strong></li>
          <li>Over 20 years: <strong>₹1 Crore</strong></li>
        </ul>
        <h2>This Doesn't Mean Stop Living</h2>
        <p>The point isn't to never enjoy a coffee. It's about being conscious of where your money goes. Most people have no idea they're spending ₹1 Lakh+ per year on things they don't even remember buying.</p>
        <h2>The 24-Hour Rule</h2>
        <p>Before any non-essential purchase above ₹500, wait 24 hours. If you still want it the next day, buy it. You'll find that 70% of impulse purchases evaporate overnight.</p>
        <blockquote>"It's not about how much money you make. It's about how much money you keep, and how hard it works for you." — Robert Kiyosaki</blockquote>
        <p>Track your "latte factor" for just one week. The results will motivate you to redirect that money towards your future self.</p>
      `
    },
    // --- Crypto #2 ---
    {
      title: "Bitcoin vs Ethereum in 2026: Which One Should You Hold?",
      excerpt: "Bitcoin is digital gold. Ethereum is a decentralized computer. Both have surged this year, but which one deserves a place in your portfolio?",
      category: "Crypto",
      author: "Vikram Rao",
      date: "May 26, 2026",
      readTime: "8 min",
      image: "images/crypto-investing.png",
      content: `
        <p>In the world of cryptocurrency, Bitcoin (BTC) and Ethereum (ETH) are the two undisputed giants. Together, they make up over 60% of the entire crypto market cap. But they serve fundamentally different purposes, and understanding this is key to making smart investment decisions.</p>
        <h2>Bitcoin: Digital Gold</h2>
        <p>Bitcoin's value proposition is simple: it's a scarce, decentralized store of value. With a hard cap of 21 million coins (roughly 19.7 million already mined), Bitcoin is designed to be deflationary. Its primary use case is as "digital gold" — a hedge against currency debasement and inflation.</p>
        <ul>
          <li><strong>Supply:</strong> Fixed at 21 million forever</li>
          <li><strong>Use case:</strong> Store of value, digital gold</li>
          <li><strong>Risk level:</strong> Lower (by crypto standards)</li>
        </ul>
        <h2>Ethereum: The World Computer</h2>
        <p>Ethereum is a programmable blockchain. It powers smart contracts, DeFi protocols, NFTs, and thousands of decentralized applications. Think of Bitcoin as gold, and Ethereum as the internet — a platform on which entire economies are built.</p>
        <ul>
          <li><strong>Supply:</strong> No hard cap, but post-merge burn mechanism makes it potentially deflationary</li>
          <li><strong>Use case:</strong> Platform for decentralized applications</li>
          <li><strong>Risk level:</strong> Higher, but with higher upside potential</li>
        </ul>
        <h2>The Smart Allocation</h2>
        <p>For most crypto beginners, a 60/40 split (60% BTC, 40% ETH) provides the best balance of safety and growth. As you learn more about the space, you can adjust based on your conviction.</p>
        <blockquote>Never invest more than 5-10% of your total portfolio in crypto. It's a high-risk, high-reward asset class that should complement — not replace — your core investments.</blockquote>
      `
    },
    // --- Crypto #3 ---
    {
      title: "DeFi Explained: How Decentralized Finance Is Replacing Banks",
      excerpt: "Earn 5-15% on your crypto without a bank. DeFi protocols are revolutionizing lending, borrowing, and yield generation. Here's how it works.",
      category: "Crypto",
      author: "Aisha Patel",
      date: "May 12, 2026",
      readTime: "9 min",
      image: "images/crypto-investing.png",
      content: `
        <p>Decentralized Finance (DeFi) is one of the most revolutionary applications of blockchain technology. In simple terms, DeFi recreates traditional financial services — lending, borrowing, trading, insurance — using smart contracts on a blockchain, without any bank or intermediary.</p>
        <h2>How DeFi Lending Works</h2>
        <p>Imagine you have some Ethereum sitting idle. Instead of letting it collect dust, you can deposit it into a DeFi lending protocol like Aave or Compound. Borrowers who need ETH pay interest, and that interest goes directly to you — no bank taking a 90% cut.</p>
        <h2>Key DeFi Concepts</h2>
        <ul>
          <li><strong>Liquidity Pools:</strong> Instead of order books, DeFi exchanges use pools of tokens. You can become a liquidity provider and earn trading fees.</li>
          <li><strong>Yield Farming:</strong> The practice of moving your assets between different DeFi protocols to maximize returns. Think of it as switching between the highest-interest savings accounts, but automated.</li>
          <li><strong>Stablecoins:</strong> Crypto tokens pegged to the US Dollar (like USDC or DAI). You can earn 5-8% on stablecoins in DeFi — far more than any bank savings account.</li>
        </ul>
        <h2>The Risks</h2>
        <p>DeFi is not without danger. Smart contract bugs can lead to hacks (billions have been lost). Impermanent loss can eat into liquidity provider profits. And regulatory uncertainty in India means the tax treatment of DeFi yields is still a grey area.</p>
        <blockquote>DeFi is the future of finance, but it's still the early innings. Start small, use only battle-tested protocols, and never invest money you can't afford to lose.</blockquote>
      `
    }
  ];

  // --- Seed Firestore with Default Posts ---
  async function seedPosts() {
    if (!isFirebaseReady) return;

    try {
      const snapshot = await db.collection('posts').limit(1).get();
      if (!snapshot.empty) {
        console.log('📝 Posts already exist in Firestore');
        return;
      }

      console.log('📝 Seeding Firestore with default posts...');
      const batch = db.batch();
      defaultPosts.forEach((post, i) => {
        const ref = db.collection('posts').doc();
        batch.set(ref, {
          ...post,
          createdAt: new Date(2026, 5, 19 - (i * 2)), // Stagger dates
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
      await batch.commit();
      console.log('✅ Seeded', defaultPosts.length, 'posts');
    } catch (e) {
      console.warn('Could not seed posts:', e.message);
    }
  }

  // --- Fetch Posts from Firestore ---
  async function fetchPostsFromFirestore() {
    if (!isFirebaseReady) return null;

    try {
      const snapshot = await db.collection('posts')
        .orderBy('createdAt', 'desc')
        .get();

      if (snapshot.empty) return null;

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (e) {
      console.warn('Could not fetch posts from Firestore:', e.message);
      return null;
    }
  }

  // --- Render Article Card HTML ---
  function renderArticleCard(post, index) {
    let initials = 'A';
    if (post.author && typeof post.author === 'string') {
      initials = post.author.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
    }
    
    let dateStr = post.date || 'Recent';
    if (!post.date && post.createdAt && typeof post.createdAt.toDate === 'function') {
      dateStr = post.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    // Store content in a hidden div or data attribute, or we can just keep it in memory
    // Because stringifying HTML into data attributes can break, we will store it globally

    return `
      <article class="article-card animate-on-scroll delay-${index}" data-post-index="${index}" style="cursor: pointer;">
        <div class="article-card-image">
          <span class="card-category">${post.category}</span>
          <img src="${post.image}" alt="${post.title}" loading="lazy">
        </div>
        <div class="article-card-body">
          <h3 class="card-title">${post.title}</h3>
          <p class="card-excerpt">${post.excerpt}</p>
          <div class="card-footer">
            <div class="card-author">
              <div class="card-author-avatar">${initials}</div>
              <div>
                <div class="card-author-name">${post.author}</div>
                <div class="card-author-date">${dateStr}</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="card-read-time">⏱️ ${post.readTime}</span>
              <button class="admin-only-action delete-post-btn" data-post-id="${post.id || ''}" data-post-index="${index}" style="display: none; background: #ef4444; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer; z-index: 10;">🗑️ Delete</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // Store fetched posts globally for the reader modal
  window.currentPostsData = [];

  // --- Load & Render Posts ---
  async function loadArticles() {
    const articlesGrid = document.querySelector('.articles-grid');
    if (!articlesGrid) return;
    
    // Attempt to load live stats from Firestore first
    async function loadLiveStats() {
      if (!isFirebaseReady) return;
      try {
        const postsSnapshot = await db.collection('posts').get();
        const usersSnapshot = await db.collection('users').get();
        
        if (typeof window.updateLiveStat === 'function') {
          // Add real database records to a realistic baseline
          const baseArticles = 500;
          const baseAuthors = 12;
          
          window.updateLiveStat('stat-articles', baseArticles + postsSnapshot.size);
          window.updateLiveStat('stat-authors', baseAuthors + usersSnapshot.size);
          
          // Gradually increase readers for a "live" feel
          const baseReaders = 52430;
          const randomBump = Math.floor(Math.random() * 150);
          window.updateLiveStat('stat-readers', baseReaders + randomBump);
        }
      } catch (e) {
        console.warn('Could not fetch live stats:', e.message);
      }
    }
    
    // Fire off stats load in the background
    loadLiveStats();

    let postsToRender = defaultPosts;

    // Try Firestore first
    const firestorePosts = await fetchPostsFromFirestore();
    if (firestorePosts && firestorePosts.length > 0) {
      console.log('📰 Loaded', firestorePosts.length, 'posts from Firestore');
      
      // Merge local content into firestore posts (in case DB was seeded before content was added)
      postsToRender = firestorePosts.map(fp => {
        const localMatch = defaultPosts.find(dp => dp.title === fp.title);
        if (!fp.content && localMatch) {
          fp.content = localMatch.content;
        }
        return fp;
      });
    }

    // Save to global variable for reader
    window.currentPostsData = postsToRender;

    // Render HTML
    articlesGrid.innerHTML = '';
    
    // Admin Delete Event Delegation
    articlesGrid.addEventListener('click', async (e) => {
      const deleteBtn = e.target.closest('.delete-post-btn');
      if (deleteBtn) {
        e.stopPropagation(); // prevent opening reader modal
        const postId = deleteBtn.getAttribute('data-post-id');
        
        // Strict security check again
        const isFirebaseAdmin = isFirebaseReady && auth.currentUser && auth.currentUser.email === 'vs9826301@gmail.com';
        const storedUser = JSON.parse(localStorage.getItem('financeflow-user') || 'null');
        const isLocalAdmin = !isFirebaseReady && storedUser && storedUser.email === 'vs9826301@gmail.com';
        
        if (!isFirebaseAdmin && !isLocalAdmin) {
          showToast('Admin privileges required to delete. 🚫');
          return;
        }

        if (confirm('Are you sure you want to permanently delete this post?')) {
          const card = deleteBtn.closest('.article-card');
          if (postId && isFirebaseReady) {
            try {
              await db.collection('posts').doc(postId).delete();
              showToast('Post deleted successfully! 🗑️');
              if (card) card.remove();
            } catch (err) {
              showToast('Error deleting post: ' + err.message);
            }
          } else {
            showToast('Local post removed! 🗑️');
            if (card) card.remove();
          }
        }
        return; // Stop further execution
      }
      
      // If not delete button, open article reader
      const card = e.target.closest('.article-card');
      if (card) {
        const index = card.getAttribute('data-post-index');
        openArticleReader(window.currentPostsData[index]);
      }
    });

    // Save to global for filtering
    window.currentPostsData = postsToRender;

    // --- Dynamically Update Category Counts ---
    document.querySelectorAll('.category-card').forEach(card => {
      const catName = card.querySelector('.category-name')?.textContent.trim().toLowerCase();
      if (catName) {
        const count = postsToRender.filter(p => (p.category || '').trim().toLowerCase() === catName).length;
        const countSpan = card.querySelector('.category-count');
        if (countSpan) {
          countSpan.textContent = count + (count === 1 ? ' Article' : ' Articles');
        }
      }
    });

    articlesGrid.innerHTML = postsToRender.map((post, i) => renderArticleCard(post, i)).join('');
    
    // Attach scroll observers to new cards
    articlesGrid.querySelectorAll('.article-card').forEach(card => {
      scrollObserver.observe(card);
    });
  }

  // --- Category Filtering Logic ---
  const categoryCards = document.querySelectorAll('.category-card');
  let activeCategory = null;

  categoryCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const catName = card.querySelector('.category-name').textContent;
      const articlesGrid = document.querySelector('.articles-grid');
      
      if (activeCategory === catName) {
        // Reset filter
        activeCategory = null;
        categoryCards.forEach(c => c.style.boxShadow = '');
        articlesGrid.innerHTML = window.currentPostsData.map((post, i) => renderArticleCard(post, i)).join('');
        articlesGrid.querySelectorAll('.article-card').forEach(card => card.classList.add('animated'));
      } else {
        // Apply filter
        activeCategory = catName;
        categoryCards.forEach(c => c.style.boxShadow = '');
        card.style.boxShadow = '0 0 0 2px var(--accent)';
        card.style.borderRadius = 'var(--radius-lg)'; // Match card radius
        
        const cleanCatName = catName.trim().toLowerCase();
        const filtered = window.currentPostsData.filter(post => (post.category || '').trim().toLowerCase() === cleanCatName);
        if (filtered.length > 0) {
          articlesGrid.innerHTML = filtered.map(post => {
            const originalIndex = window.currentPostsData.indexOf(post);
            return renderArticleCard(post, originalIndex);
          }).join('');
          articlesGrid.querySelectorAll('.article-card').forEach(card => card.classList.add('animated'));
        } else {
          articlesGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem; font-size: 1.2rem;">No articles in <b>${catName}</b> yet. Check back later! <br><br> <a href="#" id="resetFilterBtn" style="color:var(--accent); font-weight:bold;">View All Articles</a></p>`;
          
          document.getElementById('resetFilterBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            activeCategory = null;
            categoryCards.forEach(c => c.style.boxShadow = '');
            articlesGrid.innerHTML = window.currentPostsData.map((post, i) => renderArticleCard(post, i)).join('');
            articlesGrid.querySelectorAll('.article-card').forEach(card => card.classList.add('animated'));
          });
        }
      }

      // Smooth scroll to articles section (accounting for sticky nav)
      const section = document.getElementById('articles');
      const offset = 80;
      const topPos = section.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: topPos, behavior: 'smooth' });
    });
  });


  // --- Initialize Firestore ---
  if (isFirebaseReady) {
    seedPosts().then(() => loadArticles());
  } else {
    // Fallback if firebase not ready
    loadArticles();
  }

  // ==========================================
  // 🔥 Firestore — Newsletter Subscribers
  // ==========================================
  const fbNewsletterForm = document.getElementById('newsletterForm');
  fbNewsletterForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = fbNewsletterForm.querySelector('input[type="email"]');
    const submitBtn = fbNewsletterForm.querySelector('button');
    const email = emailInput?.value;

    if (!email) return;

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;

    try {
      if (isFirebaseReady) {
        // Save subscriber to Firestore
        await db.collection('subscribers').add({
          email: email,
          subscribedAt: firebase.firestore.FieldValue.serverTimestamp(),
          source: 'website'
        });
      }

      submitBtn.textContent = '✓ Subscribed!';
      submitBtn.style.background = 'var(--success)';
      emailInput.value = '';
      showToast('Successfully subscribed to our newsletter! 📬');
    } catch (error) {
      showToast('Could not subscribe. Please try again.');
    } finally {
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    }
  });

  // ==========================================
  // Article Reader Modal Logic
  // ==========================================
  const readerModal = document.getElementById('articleReaderModal');
  const closeReaderBtn = document.getElementById('closeReaderBtn');
  const readerProgress = document.getElementById('readerProgress');
  
  function openArticleReader(post) {
    if (!post) {
      console.warn('Tried to open reader, but post is undefined');
      return;
    }
    if (!readerModal) {
      console.error('Reader modal element not found in HTML!');
      return;
    }
    
    try {
      // Populate Modal Data safely
      const categoryEl = document.getElementById('readerCategory');
      if (categoryEl) categoryEl.textContent = post.category || 'Article';
      
      const titleEl = document.getElementById('readerTitle');
      if (titleEl) titleEl.textContent = post.title || 'Untitled';
      
      const imageEl = document.getElementById('readerImage');
      if (imageEl) imageEl.src = post.image || '';
      
      const authorNameEl = document.getElementById('readerAuthorName');
      if (authorNameEl) authorNameEl.textContent = post.author || 'Author';
      
      const authorAvatarEl = document.getElementById('readerAuthorAvatar');
      if (authorAvatarEl) {
        authorAvatarEl.textContent = post.author ? post.author.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'A';
      }
      
      const readTimeEl = document.getElementById('readerReadTime');
      if (readTimeEl) readTimeEl.textContent = post.readTime || '5 min';
      
      let dateStr = post.date || 'Recent';
      if (!post.date && post.createdAt && typeof post.createdAt.toDate === 'function') {
        dateStr = post.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
      const dateEl = document.getElementById('readerDate');
      if (dateEl) dateEl.textContent = dateStr;
      
      // Inject Content (fallback if missing)
      const bodyEl = document.getElementById('readerBody');
      if (bodyEl) {
        bodyEl.innerHTML = post.content || `<p>${post.excerpt || 'No excerpt available.'}</p><p><em>Full content for this post was not found.</em></p>`;
      }

      // Show Modal
      readerModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scroll
      
      // Reset scroll & progress
      readerModal.scrollTop = 0;
      if (readerProgress) readerProgress.style.width = '0%';
    } catch (err) {
      alert('CRITICAL ERROR in openArticleReader: ' + err.message + '\n' + err.stack);
      console.error('Error opening article reader:', err);
    }
  }

  function closeArticleReader() {
    readerModal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scroll
  }

  // Close Events
  closeReaderBtn?.addEventListener('click', closeArticleReader);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (readerModal?.classList.contains('active')) closeArticleReader();
      if (document.getElementById('publishModal')?.classList.contains('active')) closePublishModal();
    }
  });

  // Reading Progress Bar
  readerModal?.addEventListener('scroll', () => {
    const scrollable = readerModal.scrollHeight - readerModal.clientHeight;
    if (scrollable > 0) {
      const scrolled = readerModal.scrollTop;
      const progress = (scrolled / scrollable) * 100;
      readerProgress.style.width = `${progress}%`;
    }
  });

  // ==========================================
  // Publisher Modal Logic
  // ==========================================
  const publishModalOverlay = document.getElementById('publishModalOverlay');
  const publishModal = document.getElementById('publishModal');
  const openPublishModalBtn = document.getElementById('openPublishModal');
  const openPublishModalMobileBtn = document.getElementById('openPublishModalMobile');
  const publishForm = document.getElementById('publishForm');
  const closePublishModalBtn = document.getElementById('closePublishModal');

  function openPublishModal() {
    publishModalOverlay?.classList.add('active');
    publishModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePublishModal() {
    publishModalOverlay?.classList.remove('active');
    publishModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  [openPublishModalBtn, openPublishModalMobileBtn].forEach(btn => {
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      // Only close mobile menu if it is open
      const navLinks = document.getElementById('navLinks');
      const mobileToggle = document.getElementById('mobileToggle');
      if (navLinks?.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileToggle?.classList.remove('active');
        document.body.style.overflow = '';
      }

      if (isFirebaseReady) {
        if (!auth.currentUser) {
          showToast('Please sign in to write a post! 🔒');
          openModal(signInModal);
          return;
        }
      } else {
        const storedUser = JSON.parse(localStorage.getItem('financeflow-user') || 'null');
        if (!storedUser) {
          showToast('Please sign in to write a post! 🔒');
          openModal(signInModal);
          return;
        }
      }
      openPublishModal();
    });
  });

  closePublishModalBtn?.addEventListener('click', closePublishModal);
  publishModalOverlay?.addEventListener('click', closePublishModal);

  publishForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('pubTitle').value;
    const category = document.getElementById('pubCategory').value;
    const excerpt = document.getElementById('pubExcerpt').value;
    const content = document.getElementById('pubContent').value;
    
    if (!title || !content) return;
    
    // Check if user is authenticated before allowing submit
    let isAuthenticated = false;
    let currentUserData = null;
    if (isFirebaseReady) {
      if (auth.currentUser) {
        isAuthenticated = true;
        currentUserData = {
          name: auth.currentUser.displayName || auth.currentUser.email.split('@')[0],
          email: auth.currentUser.email
        };
      }
    } else {
      const storedUser = JSON.parse(localStorage.getItem('financeflow-user') || 'null');
      if (storedUser) {
        isAuthenticated = true;
        currentUserData = storedUser;
      }
    }
    
    if (!isAuthenticated) {
      showToast('Action forbidden: You must be signed in to publish. 🔒');
      return;
    }
    
    const submitBtn = publishForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Processing Image...';
    submitBtn.disabled = true;

    // Handle Image Upload
    let finalImageUrl = document.getElementById('pubImage')?.value || '';
    const fileInput = document.getElementById('pubImageFile');
    
    if (fileInput && fileInput.files && fileInput.files[0]) {
      try {
        finalImageUrl = await resizeImageToBase64(fileInput.files[0]);
      } catch (err) {
        showToast('Error processing image. Please try another one.');
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        return;
      }
    }
    
    submitBtn.textContent = 'Publishing...';
    try {
      const authorName = currentUserData.name || 'Anonymous';
      const uid = isFirebaseReady && auth.currentUser ? auth.currentUser.uid : 'local-user';
      
      // Calculate approximate read time (200 words per minute)
      const wordCount = content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min';

      const postData = {
        title,
        category,
        image: finalImageUrl,
        excerpt,
        content,
        author: authorName,
        authorUid: uid,
        readTime
      };

      if (isFirebaseReady) {
        postData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection('posts').add(postData);
      } else {
        // Local fallback: just add to currentPostsData and re-render
        postData.id = 'local-' + Date.now();
        postData.date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        window.currentPostsData.unshift(postData);
        // We'd need to re-render, but loadArticles() re-fetches. Let's just mock it:
        const articlesGrid = document.querySelector('.articles-grid');
        if (articlesGrid) {
          articlesGrid.innerHTML = '';
          articlesGrid.insertAdjacentHTML('beforeend', window.currentPostsData.map((post, i) => renderArticleCard(post, i)).join(''));
        }
      }

      showToast('Article published successfully! 🎉');
      publishForm.reset();
      if (fileInput) fileInput.value = '';
      closePublishModal();
      
      if (isFirebaseReady) {
        // Refresh the articles list from DB
        loadArticles();
      }
      
      // Scroll to articles
      const offset = 80;
      const section = document.getElementById('articles');
      if (section) {
        const topPos = section.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: topPos, behavior: 'smooth' });
      }
    } catch (err) {
      alert('Error publishing article: ' + err.message);
    } finally {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  });

  // --- Image Resizer Helper ---
  function resizeImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;
          
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Export as compressed JPEG (0.7 quality) to keep under 1MB Firestore limit
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // ==========================================
  // Legal Modals Logic
  // ==========================================
  document.getElementById('openPrivacyModal')?.addEventListener('click', (e) => {
    e.preventDefault();
    legalModalOverlay?.classList.add('active');
    privacyModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  document.getElementById('openTermsModal')?.addEventListener('click', (e) => {
    e.preventDefault();
    legalModalOverlay?.classList.add('active');
    termsModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  document.getElementById('closePrivacyModal')?.addEventListener('click', closeAllModals);
  document.getElementById('closeTermsModal')?.addEventListener('click', closeAllModals);
  legalModalOverlay?.addEventListener('click', closeAllModals);

});
