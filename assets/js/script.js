document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. PRELOADER FADE OUT (ELIMINATES FLASH ON REFRESH)
     ========================================================================== */
  const hidePreloader = () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.visibility = 'hidden';
        preloader.style.display = 'none';
      }, 500);
    }
  };

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }

  /* ==========================================================================
     2. FLOATING NAVBAR SCROLL EFFECT
     ========================================================================== */
  const navbar = document.querySelector('.navbar-floating');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  /* ==========================================================================
     3. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
     ========================================================================== */
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');
  revealElements.forEach(el => revealObserver.observe(el));

/* ==========================================================================
     4. 3D TILT EFFECT ON CARDS (Excludes Form & Admin Cards)
     ========================================================================== */
  const tiltCards = document.querySelectorAll('.glass-card-advanced');
  
  tiltCards.forEach(card => {
    // Double check that the element is NOT inside a form or admin container
    if (card.closest('#submissionForm') || card.closest('.tab-content') || card.closest('#register')) {
      return;
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 12;
      const rotateY = (centerX - x) / 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });

});

/* ==========================================================================
   5. MULTI-STEP FORM NAVIGATION WITH ANIMATED PROGRESS BAR
   ========================================================================== */
function nextStep(stepNumber) {
  const steps = document.querySelectorAll('.form-step');
  const circles = document.querySelectorAll('.step-circle');
  const progressBar = document.getElementById('stepProgress');

  if (progressBar) {
    if (stepNumber === 1) progressBar.style.width = '0%';
    else if (stepNumber === 2) progressBar.style.width = '50%';
    else if (stepNumber === 3) progressBar.style.width = '100%';
  }

  steps.forEach(step => {
    step.classList.remove('active');
    setTimeout(() => {
      if (step.id === `step-${stepNumber}`) {
        step.classList.add('active');
      }
    }, 150);
  });

  circles.forEach((circle, idx) => {
    if (idx + 1 <= stepNumber) {
      circle.classList.add('active');
    } else {
      circle.classList.remove('active');
    }
  });
}

/* ==========================================================================
   PHOTO PREVIEW & REMOVE FUNCTIONALITY FOR SUBMISSION FORM
   ========================================================================== */
function previewPhoto(input) {
  const card = input.closest('.photo-upload-card');
  const previewImg = card.querySelector('.img-preview');
  const previewIcon = card.querySelector('.preview-icon');
  const removeBtn = card.querySelector('.remove-btn');
  const customBtn = card.querySelector('.custom-file-btn');

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      previewImg.src = e.target.result;
      previewImg.classList.remove('d-none');
      previewIcon.classList.add('d-none');
      removeBtn.classList.remove('d-none');
      if (customBtn) customBtn.classList.add('d-none');
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function removePhoto(button) {
  const card = button.closest('.photo-upload-card');
  const titleInput = card.querySelector('input[type="text"]');
  const fileInput = card.querySelector('.file-input');
  const previewImg = card.querySelector('.img-preview');
  const previewIcon = card.querySelector('.preview-icon');
  const customBtn = card.querySelector('.custom-file-btn');

  if (titleInput) titleInput.value = '';
  if (fileInput) fileInput.value = '';

  previewImg.src = '';
  previewImg.classList.add('d-none');
  previewIcon.classList.remove('d-none');
  button.classList.add('d-none');
  if (customBtn) customBtn.classList.remove('d-none');
}

/* ==========================================================================
   DYNAMIC CATEGORY SELECTION LOGIC
   ========================================================================== */
function handleCategoryChange() {
  const categorySelect = document.getElementById('mainCategory');
  if (!categorySelect) return;

  const val = categorySelect.value;
  const schoolFieldsWrapper = document.getElementById('schoolFieldsWrapper');
  const openFieldsWrapper = document.getElementById('openFieldsWrapper');
  const step2Title = document.getElementById('step2Title');

  const schoolName = document.getElementById('schoolName');
  const schoolAddress = document.getElementById('schoolAddress');
  const presidentName = document.getElementById('presidentName');
  const presidentContact = document.getElementById('presidentContact');
  const nicNumber = document.getElementById('nicNumber');

  if (val === 'Inner') {
    // Show School Details & Pre-fill default values
    schoolFieldsWrapper.classList.remove('d-none');
    openFieldsWrapper.classList.add('d-none');
    step2Title.textContent = 'Step 2: School Details (Inner-School)';

    schoolName.value = 'R/Sivali Central College';
    schoolAddress.value = 'Hidellana Rathnapura';
    presidentName.value = 'Uthum Methsara';
    presidentContact.value = '0775990039';

    // Lock fields
    schoolName.readOnly = true;
    schoolAddress.readOnly = true;
    presidentName.readOnly = true;
    presidentContact.readOnly = true;

    // Set validation flags
    schoolName.required = true;
    schoolAddress.required = true;
    presidentName.required = true;
    presidentContact.required = true;
    nicNumber.required = false;

  } else if (val === 'Inter') {
    // Show School Details & Clear pre-filled values
    schoolFieldsWrapper.classList.remove('d-none');
    openFieldsWrapper.classList.add('d-none');
    step2Title.textContent = 'Step 2: School Details (Inter-School)';

    if (schoolName.readOnly) {
      schoolName.value = '';
      schoolAddress.value = '';
      presidentName.value = '';
      presidentContact.value = '';
    }

    schoolName.readOnly = false;
    schoolAddress.readOnly = false;
    presidentName.readOnly = false;
    presidentContact.readOnly = false;

    // Set validation flags
    schoolName.required = true;
    schoolAddress.required = true;
    presidentName.required = true;
    presidentContact.required = true;
    nicNumber.required = false;

  } else if (val === 'Open') {
    // Hide School Details & Show NIC/Open Category details
    schoolFieldsWrapper.classList.add('d-none');
    openFieldsWrapper.classList.remove('d-none');
    step2Title.textContent = 'Step 2: Identity & Organization Details';

    // Remove requirements for hidden fields
    schoolName.required = false;
    schoolAddress.required = false;
    presidentName.required = false;
    presidentContact.required = false;

    // Require NIC field
    nicNumber.required = true;
  }
}

/* ==========================================================================
   MULTI-STEP FORM NAVIGATION WITH CUSTOM VALIDATION & TOOLTIPS
   ========================================================================== */
let currentStep = 1;

function goToStep(targetStep) {
  // Validate current step before proceeding forward
  if (targetStep > currentStep) {
    if (!validateCurrentStep(currentStep)) {
      return;
    }
  }

  currentStep = targetStep;

  const steps = document.querySelectorAll('.form-step');
  const circles = document.querySelectorAll('.step-circle');
  const progressBar = document.getElementById('stepProgress');

  // Update Progress Bar
  if (progressBar) {
    if (targetStep === 1) progressBar.style.width = '0%';
    else if (targetStep === 2) progressBar.style.width = '50%';
    else if (targetStep === 3) progressBar.style.width = '100%';
  }

  // Switch Active Form Step
  steps.forEach(step => {
    step.classList.remove('active');
    setTimeout(() => {
      if (step.id === `step-${targetStep}`) {
        step.classList.add('active');
      }
    }, 150);
  });

  // Update Circle Indicators
  circles.forEach((circle, idx) => {
    if (idx + 1 <= targetStep) {
      circle.classList.add('active');
    } else {
      circle.classList.remove('active');
    }
  });
}

function validateCurrentStep(stepNum) {
  const activeStepEl = document.getElementById(`step-${stepNum}`);
  if (!activeStepEl) return true;

  // Clear existing error messages
  clearTooltips(activeStepEl);

  let isValid = true;
  let firstInvalidEl = null;

  const fields = activeStepEl.querySelectorAll('input, select, textarea');

  fields.forEach(field => {
    // Ignore hidden or non-required fields
    if (!field.required || field.offsetParent === null) return;

    let fieldValid = true;
    if (field.tagName === 'SELECT') {
      if (!field.value || field.value === '') fieldValid = false;
    } else {
      if (!field.value || field.value.trim() === '') fieldValid = false;
    }

    if (!fieldValid) {
      isValid = false;
      showTooltip(field, 'This field is required');
      if (!firstInvalidEl) firstInvalidEl = field;
    }
  });

  if (firstInvalidEl) {
    firstInvalidEl.focus();
  }

  return isValid;
}

function showTooltip(field, message) {
  field.classList.add('is-invalid');

  const wrapper = field.parentElement;
  if (wrapper) {
    const tooltip = document.createElement('div');
    tooltip.className = 'field-tooltip-msg';
    tooltip.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
    wrapper.appendChild(tooltip);
  }
}

function clearTooltips(container) {
  const invalidFields = container.querySelectorAll('.is-invalid');
  invalidFields.forEach(f => f.classList.remove('is-invalid'));

  const tooltips = container.querySelectorAll('.field-tooltip-msg');
  tooltips.forEach(t => t.remove());
}

// Remove error tooltip on user typing/selecting
document.addEventListener('input', (e) => {
  if (e.target.classList.contains('is-invalid')) {
    e.target.classList.remove('is-invalid');
    const parent = e.target.parentElement;
    const tooltip = parent.querySelector('.field-tooltip-msg');
    if (tooltip) tooltip.remove();
  }
});


/* ==========================================================================
   HELPER FUNCTION: CALCULATE AGE FROM DOB
   ========================================================================== */
function calculateAge(dobString) {
  const birthDate = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/* ==========================================================================
   MULTI-STEP FORM VALIDATION WITH AGE & CATEGORY RULES
   ========================================================================== */
function validateCurrentStep(stepNum) {
  const activeStepEl = document.getElementById(`step-${stepNum}`);
  if (!activeStepEl) return true;

  // Clear existing errors
  clearTooltips(activeStepEl);

  let isValid = true;
  let firstInvalidEl = null;

  // 1. Check basic required fields
  const fields = activeStepEl.querySelectorAll('input, select, textarea');

  fields.forEach(field => {
    if (!field.required || field.offsetParent === null) return;

    let fieldValid = true;
    if (field.tagName === 'SELECT') {
      if (!field.value || field.value === '') fieldValid = false;
    } else {
      if (!field.value || field.value.trim() === '') fieldValid = false;
    }

    if (!fieldValid) {
      isValid = false;
      showTooltip(field, 'This field is required');
      if (!firstInvalidEl) firstInvalidEl = field;
    }
  });

  // 2. Age & Category Rule Checks (Only for Step 1 when required fields are filled)
  if (stepNum === 1 && isValid) {
    const categoryEl = document.getElementById('mainCategory');
    const dobEl = document.getElementById('dob');

    if (categoryEl && dobEl && dobEl.value) {
      const category = categoryEl.value;
      const userAge = calculateAge(dobEl.value);

      // Rule 1: Inter / Inner category restricts age to 18 or under
      if ((category === 'Inter' || category === 'Inner') && userAge > 20) {
        isValid = false;
        showTooltip(dobEl, 'Inter/Inner school categories are restricted to students 18 years or under');
        if (!firstInvalidEl) firstInvalidEl = dobEl;
      } 
      // Rule 2: Open category restricts age to 20 or older
      else if (category === 'Open' && userAge < 20) {
        isValid = false;
        showTooltip(dobEl, 'Open category is restricted to participants 20 years or older');
        if (!firstInvalidEl) firstInvalidEl = dobEl;
      }
    }
  }

  if (firstInvalidEl) {
    firstInvalidEl.focus();
  }

  return isValid;
}
