const textSlides = document.querySelectorAll('.text-slide');
let currentIndex = 0;

function showSlide(index) {
  textSlides.forEach(slide => slide.classList.remove('active'));
  textSlides[index].classList.add('active');
}

function nextSlide() {
  currentIndex++;
  if (currentIndex >= textSlides.length) {
    currentIndex = 0; 
  }
  showSlide(currentIndex);
}

setInterval(nextSlide, 2000);

const initSlider = () => {
    const imageList = document.querySelector(".slider-wrapper .image-list");
    const slideButtons = document.querySelectorAll(".slider-wrapper .slide-button");
    const sliderScrollbar = document.querySelector(".container .slider-scrollbar");
    const scrollbarThumb = sliderScrollbar.querySelector(".scrollbar-thumb");
    const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;
    
    // Handle scrollbar thumb drag
    scrollbarThumb.addEventListener("mousedown", (e) => {
        const startX = e.clientX;
        const thumbPosition = scrollbarThumb.offsetLeft;
        const maxThumbPosition = sliderScrollbar.getBoundingClientRect().width - scrollbarThumb.offsetWidth;
        
        // Update thumb position on mouse move
        const handleMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            const newThumbPosition = thumbPosition + deltaX;
            // Ensure the scrollbar thumb stays within bounds
            const boundedPosition = Math.max(0, Math.min(maxThumbPosition, newThumbPosition));
            const scrollPosition = (boundedPosition / maxThumbPosition) * maxScrollLeft;
            
            scrollbarThumb.style.left = `${boundedPosition}px`;
            imageList.scrollLeft = scrollPosition;
        }
        // Remove event listeners on mouse up
        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
        // Add event listeners for drag interaction
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    });
    // Slide images according to the slide button clicks
    slideButtons.forEach(button => {
        button.addEventListener("click", () => {
            const direction = button.id === "prev-slide" ? -1 : 1;
            const scrollAmount = imageList.clientWidth * direction;
            imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });
    });
     // Show or hide slide buttons based on scroll position
    const handleSlideButtons = () => {
        slideButtons[0].style.display = imageList.scrollLeft <= 0 ? "none" : "flex";
        slideButtons[1].style.display = imageList.scrollLeft >= maxScrollLeft ? "none" : "flex";
    }
    // Update scrollbar thumb position based on image scroll
    const updateScrollThumbPosition = () => {
        const scrollPosition = imageList.scrollLeft;
        const thumbPosition = (scrollPosition / maxScrollLeft) * (sliderScrollbar.clientWidth - scrollbarThumb.offsetWidth);
        scrollbarThumb.style.left = `${thumbPosition}px`;
    }
    // Call these two functions when image list scrolls
    imageList.addEventListener("scroll", () => {
        updateScrollThumbPosition();
        handleSlideButtons();
    });
}
window.addEventListener("resize", initSlider);
window.addEventListener("load", initSlider);



const carousel = document.querySelector(".carousel");
const firstImage = carousel.querySelector("img");
const arrowIcons = document.querySelectorAll(".wrapper i");
// Variables for state management
let isDragging = false;
let startX = 0;
let scrollStart = 0;
let scrollDiff = 0;
// Helper function to toggle arrow visibility
const toggleArrowIcons = () => {
  setTimeout(() => {
    const maxScroll = Math.round(carousel.scrollWidth - carousel.clientWidth);
    arrowIcons[0].style.display = carousel.scrollLeft <= 0 ? "none" : "block";
    arrowIcons[1].style.display = Math.round(carousel.scrollLeft) >= maxScroll ? "none" : "block";
  }, 100);
};
// Helper function to smoothly scroll the carousel
const scrollCarousel = (direction) => {
  const cardWidth = firstImage.clientWidth + 0; // Image width + margin
  const maxScroll = carousel.scrollWidth - carousel.clientWidth;
  const scrollAmount = direction === "right" ? cardWidth : -cardWidth;
  carousel.scrollLeft = Math.min(Math.max(carousel.scrollLeft + scrollAmount, 0), maxScroll);
  toggleArrowIcons();
};
// Event listeners for arrows
arrowIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    const direction = icon.id === "right" ? "right" : "left";
    scrollCarousel(direction);
  });
});
// Automatic adjustment after dragging
const autoCenterImage = () => {
  const cardWidth = firstImage.clientWidth + 0;
  const offset = carousel.scrollLeft % cardWidth;
  const maxScroll = carousel.scrollWidth - carousel.clientWidth;
  if (carousel.scrollLeft > 0 && carousel.scrollLeft < maxScroll) {
    if (offset > cardWidth / 3) {
      carousel.scrollLeft += cardWidth - offset; // Snap to the next image
    } else {
      carousel.scrollLeft -= offset; // Snap to the previous image
    }
  }
  toggleArrowIcons();
};
// Dragging logic
const startDragging = (event) => {
  isDragging = true;
  startX = event.pageX || event.touches[0].pageX;
  scrollStart = carousel.scrollLeft;
  carousel.classList.add("dragging");
};
const duringDrag = (event) => {
  if (!isDragging) return;
  const currentX = event.pageX || event.touches[0].pageX;
  scrollDiff = currentX - startX;
  carousel.scrollLeft = scrollStart - scrollDiff;
};
const stopDragging = () => {
  if (!isDragging) return;
  isDragging = false;
  carousel.classList.remove("dragging");
  if (Math.abs(scrollDiff) > 10) {
    autoCenterImage();
  }
};
// Attach event listeners
carousel.addEventListener("mousedown", startDragging);
carousel.addEventListener("touchstart", startDragging);
document.addEventListener("mousemove", duringDrag);
carousel.addEventListener("touchmove", duringDrag);
document.addEventListener("mouseup", stopDragging);
carousel.addEventListener("touchend", stopDragging);
// Initial setup
toggleArrowIcons();

// Auto slide every 3 seconds
let autoSlideInterval = setInterval(() => {
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
  
    if (Math.round(carousel.scrollLeft) >= maxScroll) {
      // If at the end, reset to the start
      carousel.scrollLeft = 0;
    } else {
      // Otherwise, scroll to the next image
      scrollCarousel("right");
    }
  }, 2000); // Adjust time in milliseconds as needed
  
