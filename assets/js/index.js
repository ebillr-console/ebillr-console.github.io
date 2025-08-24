document.addEventListener('DOMContentLoaded', () => {
  // Initialize typewriter animation
  const words = document.querySelectorAll('.typewriter-word span');
  words.forEach(word => {
    word.style.willChange = 'transform, opacity';
  });
});
