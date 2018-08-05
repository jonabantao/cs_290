document.addEventListener('DOMContentLoaded', () => {
  const toggleModal = function toggleModalFnc() {
    document.getElementById('jobsModal').classList
      .toggle('is-active');
  };

  const activateModalListeners = function activateModalListenersFnc() {
    const modalBackground = document.getElementById('modalBackground');
    const modalClose = document.getElementById('modalClose');

    modalBackground.addEventListener('click', () => {
      toggleModal();
    });

    modalClose.addEventListener('click', () => {
      toggleModal();
    });
  };

  document.getElementById('jobPostings').addEventListener('click', (e) => {
    const applyButton = e.target;

    if (!applyButton.classList.contains('apply')) return;

    toggleModal();
  });

  activateModalListeners();
});
