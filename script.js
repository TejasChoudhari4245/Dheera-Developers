// flooting form
function updateGreeting() {
  const greetingElement = document.getElementById("greeting");
  const now = new Date();
  const hour = now.getHours();
  let greeting = "";

  if (hour < 12) {
    greeting = "Good Morning 🌅";
  } else if (hour < 17) {
    greeting = "Good Afternoon ☀️";
  } else if (hour < 20) {
    greeting = "Good Evening 🌇";
  } else {
    greeting = "Good Night 🌙";
  }

  greetingElement.textContent = greeting;
}

// Run greeting once on load
updateGreeting();

// Optional: Update every 1 min
setInterval(updateGreeting, 60000);

// =============================================
// Store Registered Users and Check Registration
// =============================================

// Function to store registered user info
function storeRegisteredUser(email, mobile) {
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  
  // Add new user if not already exists
  const userExists = registeredUsers.some(user => 
    user.email === email || user.mobile === mobile
  );
  
  if (!userExists) {
    registeredUsers.push({ email, mobile });
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }
  
  // Set flag that this user has registered
  localStorage.setItem('userRegistered', 'true');
}

// Check if user is already registered
function isUserRegistered() {
  // Check the simple flag first
  if (localStorage.getItem('userRegistered') === 'true') {
    return true;
  }
  
  return false;
}

// =============================================
// Form Submissions
// =============================================

document.addEventListener("DOMContentLoaded", () => {
  // Info Card Marquee Animation
  const marquee = document.getElementById("marquee-text");
  if (marquee) {
    marquee.style.animationDuration = "5s";
  }

  // Handle priceForm submission (popup form)
  const priceForm = document.getElementById("priceForm");
  if (priceForm) {
    priceForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(priceForm);
      const email = formData.get('email');
      const mobile = formData.get('mobile');
      
      // Store user info
      storeRegisteredUser(email, mobile);
      
      try {
        const response = await fetch(priceForm.action, {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          Swal.fire("Success!", "Message sent successfully.", "success");
          priceForm.reset();
          // Hide the modal after successful submission
          bootstrap.Modal.getInstance(document.getElementById('priceModal')).hide();
        } else {
          throw new Error("Failed to submit form.");
        }
      } catch (error) {
        console.error("Submission error:", error);
        Swal.fire("Error", "Something went wrong. Please try again.", "error");
      }
    });
  }

  // Handle priceFormright submission (sidebar form)
  const priceFormright = document.getElementById("priceFormright");
  if (priceFormright) {
    priceFormright.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(priceFormright);
      const email = formData.get('email');
      const mobile = formData.get('mobile');
      
      // Store user info
      storeRegisteredUser(email, mobile);
      
      try {
        const response = await fetch(priceFormright.action, {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          Swal.fire("Success!", "Message sent successfully.", "success");
          priceFormright.reset();
        } else {
          throw new Error("Failed to submit form.");
        }
      } catch (error) {
        console.error("Submission error:", error);
        Swal.fire("Error", "Something went wrong. Please try again.", "error");
      }
    });
  }

  // =============================================
  // Popup Form Logic
  // =============================================

  // Don't show if user is registered
  if (!isUserRegistered()) {
    // Function to show modal
    function showModal() {
      // Check again in case they registered during this session
      if (!isUserRegistered()) {
        const priceModal = new bootstrap.Modal(document.getElementById('priceModal'));
        priceModal.show();
      }
    }

    // Initial show after 2 seconds
    setTimeout(showModal, 2000);

    // Set interval to show every 20 seconds
    const modalInterval = setInterval(() => {
      if (!isUserRegistered()) {
        showModal();
      } else {
        clearInterval(modalInterval);
      }
    }, 20000);
  }

  // =============================================
  // Gallery Viewer Functionality
  // =============================================

  // Initialize variables
  let currentImageIndex = 0;
  const galleryImages = Array.from(document.querySelectorAll('.gallery-image'));
  const viewerModal = document.getElementById('imageViewerModal');
  
  if (viewerModal) {
    const fullSizeImage = document.getElementById('fullSizeImage');
    const viewerCaption = document.getElementById('viewerCaption');
    
    // Open viewer when clicking any gallery image
    galleryImages.forEach((img, index) => {
      img.addEventListener('click', function(e) {
        e.preventDefault();
        currentImageIndex = index;
        openViewer(this.src, this.alt);
      });
    });
    
    // Also handle the "Enlarge" buttons
    document.querySelectorAll('.gallery-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const img = this.closest('.gallery-item').querySelector('.gallery-image');
        currentImageIndex = galleryImages.indexOf(img);
        openViewer(img.src, img.alt);
      });
    });
    
    // Open viewer function
    function openViewer(src, alt) {
      fullSizeImage.src = src;
      viewerCaption.textContent = alt;
      viewerModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Reset zoom state
      fullSizeImage.classList.remove('zoomed');
    }
    
    // Close viewer
    document.querySelector('.close-viewer').addEventListener('click', closeViewer);
    
    // Close when clicking outside image
    viewerModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeViewer();
      }
    });
    
    // Close with ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && viewerModal.style.display === 'flex') {
        closeViewer();
      }
    });
    
    // Toggle zoom on image click
    fullSizeImage.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('zoomed');
    });
    
    function closeViewer() {
      viewerModal.style.display = 'none';
      document.body.style.overflow = '';
    }
    
    // Navigation between images
    const prevBtn = document.createElement('button');
    prevBtn.className = 'viewer-nav-btn';
    prevBtn.innerHTML = '&lt;';
    prevBtn.addEventListener('click', showPrevImage);
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'viewer-nav-btn';
    nextBtn.innerHTML = '&gt;';
    nextBtn.addEventListener('click', showNextImage);
    
    const navContainer = document.createElement('div');
    navContainer.className = 'viewer-nav';
    navContainer.appendChild(prevBtn);
    navContainer.appendChild(nextBtn);
    viewerModal.appendChild(navContainer);
    
    function showPrevImage(e) {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      const img = galleryImages[currentImageIndex];
      openViewer(img.src, img.alt);
    }
    
    function showNextImage(e) {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      const img = galleryImages[currentImageIndex];
      openViewer(img.src, img.alt);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (viewerModal.style.display === 'flex') {
        if (e.key === 'ArrowLeft') {
          showPrevImage(e);
        } else if (e.key === 'ArrowRight') {
          showNextImage(e);
        }
      }

      function updateSocialLinksPosition() {
    const socialLinks = document.getElementById('socialLinks');
    if (!socialLinks) return;

    if (window.innerWidth <= 768) { // Mobile breakpoint
      socialLinks.classList.add('sticky-bottom');
    } else {
      socialLinks.classList.remove('sticky-bottom');
    }
  }

  // Run on page load
  window.addEventListener('DOMContentLoaded', updateSocialLinksPosition);

  // Run on window resize
  window.addEventListener('resize', updateSocialLinksPosition);
    });
  }})


  

