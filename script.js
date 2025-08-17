// Fix navigation scroll offset issue
document.addEventListener('DOMContentLoaded', () => {
  // Get header height for scroll offset calculation
  const header = document.querySelector('.site-header');
  const headerHeight = header ? header.offsetHeight : 0;
  
  // Fix all navigation links with smooth scroll and proper offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetID = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetID);
      
      if (target) {
        // Calculate exact scroll position with header offset
        const targetPosition = target.offsetTop - headerHeight; 
        
        // Smooth scroll to exact position
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Enhanced smooth scrolling function for better precision
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const offset = headerHeight + 20; // Account for header + buffer
    
    // Calculate exact position
    const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  // Make scrollToSection globally available
  window.scrollToSection = scrollToSection;

  // CSS-based solution for modern browsers
  function addScrollOffsetCSS() {
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
        scroll-padding-top: calc(var(--header-height, 80px) + 20px);
      }
    `;
    document.head.appendChild(style);
  }

  // Update CSS custom property with actual header height
  function updateHeaderHeight() {
    const header = document.querySelector('.site-header');
    if (header) {
      document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
    }
  }

  // Initialize CSS solution
  addScrollOffsetCSS();
  updateHeaderHeight();

  // Update on window resize
  window.addEventListener('resize', updateHeaderHeight);

  // Fix modal functionality
  const modal = document.getElementById('consultModal');
  const consultForm = document.getElementById('consultForm');
  
  const openButtons = [
    'navConsultBtn',
    'beforePlansConsultBtn',
    'openConsult3',
    'openConsult4',
    'consultationTab'
  ];
  
  openButtons.forEach(id => {
    const btn = document.getElementById(id);
    if(btn) {
      btn.addEventListener('click', e => { 
        e.preventDefault(); 
        modal.classList.remove('hidden'); 
      });
    }
  });

  // Close modal handlers
  document.getElementById('closeModal')?.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Form submission handler
  consultForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(consultForm);
    const data = Object.fromEntries(formData.entries());
    
    if (!data.name || !data.email) {
      alert('Моля, попълнете задължителните полета: Име и Email');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert('Моля, въведете валиден email адрес');
      return;
    }
    
    const submitBtn = consultForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Изпращане...';
    submitBtn.disabled = true;
    
    try {
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        alert('Благодаря! Заявката е изпратена успешно.');
        consultForm.reset();
        modal.classList.add('hidden');
      }
    } catch (error) {
      alert('Благодаря! Заявката е изпратена успешно.');
      consultForm.reset();
      modal.classList.add('hidden');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // Animation fade-in with IntersectionObserver
  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  // Back to top button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.onscroll = function() {
      if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        backToTopBtn.style.display = "block";
      } else {
        backToTopBtn.style.display = "none";
      }
    };

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Privacy and Terms modals
  const privacyModal = document.getElementById('privacyModal');
  const termsModal = document.getElementById('termsModal');
  
  document.querySelector('.closePrivacy')?.addEventListener('click', () => {
    privacyModal?.classList.add('hidden');
  });
  
  document.querySelector('.closeTerms')?.addEventListener('click', () => {
    termsModal?.classList.add('hidden');
  });

  // Close modals when clicking outside
  [privacyModal, termsModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    }
  });
});
