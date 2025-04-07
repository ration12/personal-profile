document.addEventListener('DOMContentLoaded', () => {
  // ========== COUNTDOWN TIMER ==========
  function updateCountdown() {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const remainingTime = endOfDay - now;
    const secondsLeft = Math.floor(remainingTime / 1000);
    const formattedSeconds = String(secondsLeft).padStart(5, '0');
    const digits = document.querySelectorAll('.digit');
    digits.forEach((digit, index) => {
      digit.innerText = formattedSeconds[index];
    });
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // ========== SLIDER THUMB DRAGGING ==========
  const slider = document.querySelector('.slider');
  const sliderThumb = document.querySelector('.slider-thumb');
  const body = document.body;

  sliderThumb.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const sliderRect = slider.getBoundingClientRect();
    const sliderWidth = sliderRect.width;
    const thumbWidth = sliderThumb.offsetWidth;
    const maxOffset = sliderWidth - thumbWidth;

    function onMouseMove(e) {
      const newX = e.clientX - sliderRect.left;
      const newLeft = Math.min(Math.max(newX, 0), maxOffset);
      sliderThumb.style.transform = `translate(${newLeft}px, -50%)`;

      const percentage = newLeft / maxOffset;
      slider.value = Math.round(percentage * 100);
      slider.dispatchEvent(new Event('input'));
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // ========== BACKGROUND BLENDING + MODE TOGGLE ==========
  slider.addEventListener('input', function() {
    const value = parseInt(slider.value, 10);
    const max = parseInt(slider.max, 10);
    const percentage = value / max;

    // Blend background from light to dark
    const lightColor = [224, 224, 224];
    const darkColor = [13, 13, 13];
    const blendedColor = lightColor.map((start, i) =>
      Math.round(start + percentage * (darkColor[i] - start))
    );
    body.style.backgroundColor = `rgb(${blendedColor.join(',')})`;

    // Toggle text color at 50% threshold
    if (percentage < 0.5) {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
    } else {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
    }
  });

  // ========== INITIAL SETUP: Start fully dark (slider=100) ==========
  slider.value = 100;

  // Calculate the initial position of the slider thumb
  const sliderRect = slider.getBoundingClientRect();
  const sliderWidth = sliderRect.width;
  const thumbWidth = sliderThumb.offsetWidth;
  const maxOffset = sliderWidth - thumbWidth;
  const initialLeft = (slider.value / 100) * maxOffset;

  // Update the slider thumb's position
  sliderThumb.style.transform = `translate(${initialLeft}px, -50%)`;

  // Set the initial background color and mode
  body.style.backgroundColor = 'rgb(13,13,13)';
  body.classList.add('dark-mode');
});