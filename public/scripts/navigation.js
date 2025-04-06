// navigation.js
export function navigateTo(page) {
  window.location.href = `${page}.html`;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-navigate]').forEach(button => {
      button.addEventListener('click', () => {
          navigateTo(button.dataset.navigate);
      });
  });
});