/**
 * SlimSync - Dashboard JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardTabs();
  initMobileSidebar();
  initPrescriptionUpload();
  initSubscriptionControls();
  initLogout();
});

/* ==========================================
   Tab Navigation
========================================== */
function initDashboardTabs() {
  const menuItems = document.querySelectorAll('.menu-item[data-target]');
  
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active from all
      menuItems.forEach(m => m.classList.remove('active'));
      document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
      
      // Set new active
      item.classList.add('active');
      const targetId = item.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
      
      // Update Title
      document.getElementById('dashTitle').innerText = item.innerText;

      // Auto-close sidebar on mobile
      const sidebar = document.getElementById('sidebar');
      if (window.innerWidth <= 1024 && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
    });
  });
}

// Global switch function for quick action buttons
window.switchTab = function(targetId) {
  const targetItem = document.querySelector(`.menu-item[data-target="${targetId}"]`);
  if(targetItem) targetItem.click();
};

/* ==========================================
   Mobile Sidebar
========================================== */
function initMobileSidebar() {
  const openBtn = document.getElementById('openSidebar');
  const closeBtn = document.getElementById('closeSidebar');
  const sidebar = document.getElementById('sidebar');

  if(openBtn) openBtn.addEventListener('click', () => sidebar.classList.add('open'));
  if(closeBtn) closeBtn.addEventListener('click', () => sidebar.classList.remove('open'));
}

/* ==========================================
   Prescription Upload Validation & Drag-Drop
========================================== */
function initPrescriptionUpload() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const fileInfo = document.getElementById('fileInfo');
  const fileError = document.getElementById('fileError');
  const uploadBtn = document.getElementById('uploadBtn');

  if(!dropZone) return;

  const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/heic'];
  const maxBytes = 10 * 1024 * 1024; // 10MB
  let currentFile = null;

  // Drag events
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  // Input event
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
      handleFile(fileInput.files[0]);
    }
  });

  function handleFile(file) {
    fileError.style.display = 'none';
    fileInfo.style.display = 'none';
    uploadBtn.disabled = true;
    currentFile = null;

    if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.heic')) {
      fileError.innerText = 'Invalid file type. Please upload a PDF, JPG, PNG, or HEIC.';
      fileError.style.display = 'block';
      return;
    }

    if (file.size > maxBytes) {
      fileError.innerText = 'File is too large. Maximum size is 10MB.';
      fileError.style.display = 'block';
      return;
    }

    currentFile = file;
    fileInfo.innerText = `${file.name} (${(file.size / (1024*1024)).toFixed(2)} MB)`;
    fileInfo.style.display = 'block';
    uploadBtn.disabled = false;
  }

  uploadBtn.addEventListener('click', () => {
    if(currentFile) {
      // Simulated fetch POST
      uploadBtn.innerText = 'Uploading...';
      uploadBtn.disabled = true;
      
      setTimeout(() => {
        uploadBtn.innerText = 'Upload Successful';
        uploadBtn.style.background = 'var(--color-success)';
        uploadBtn.style.borderColor = 'var(--color-success)';
        
        setTimeout(() => {
          // Reset
          uploadBtn.innerText = 'Upload Document';
          uploadBtn.style.background = '';
          uploadBtn.style.borderColor = '';
          fileInfo.style.display = 'none';
          currentFile = null;
          fileInput.value = '';
        }, 3000);
      }, 1500);
    }
  });
}

/* ==========================================
   Subscription Controls
========================================== */
function initSubscriptionControls() {
  const pauseBtn = document.getElementById('pauseSubBtn');
  const cancelBtn = document.getElementById('cancelSubBtn');
  const statusBadge = document.getElementById('subStatus');

  if(pauseBtn && statusBadge) {
    pauseBtn.addEventListener('click', () => {
      if(statusBadge.classList.contains('active')) {
        statusBadge.className = 'badge paused';
        statusBadge.innerText = 'Paused';
        pauseBtn.innerText = 'Resume Subscription';
      } else {
        statusBadge.className = 'badge active';
        statusBadge.innerText = 'Active';
        pauseBtn.innerText = 'Pause Subscription';
      }
    });
  }

  if(cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      openModal('cancelModal');
    });
  }
}

/* ==========================================
   Modals & Logout
========================================== */
window.openModal = function(id) {
  const modal = document.getElementById(id);
  if(modal) modal.classList.add('active');
};

window.closeModal = function(id) {
  const modal = document.getElementById(id);
  if(modal) modal.classList.remove('active');
};

function initLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      openModal('logoutModal');
    });
  }
}

window.confirmLogout = function() {
  localStorage.clear();
  window.location.href = 'index.html';
};

window.confirmCancel = function() {
  // Simulate cancel
  closeModal('cancelModal');
  const statusBadge = document.getElementById('subStatus');
  if(statusBadge) {
    statusBadge.className = 'badge rejected';
    statusBadge.innerText = 'Cancelled';
  }
  const pauseBtn = document.getElementById('pauseSubBtn');
  if(pauseBtn) pauseBtn.disabled = true;
};
