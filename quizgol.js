document.addEventListener('DOMContentLoaded', () => {
    let mushrooms = [];
    let currentMushroomIndex = 0;
    let currentImageIndex = 0;
  
    async function fetchData() {
      try {
        const response = await fetch('gol.json');
        if (!response.ok) {
          throw new Error('Failed to load gol.json');
        }
        const data = await response.json();
        mushrooms = data;
        displayMushroom();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    function displayMushroom() {
      const mushroom = mushrooms[currentMushroomIndex];
      const image = document.getElementById('quizImage');
      image.src = `images/${mushroom.images[currentImageIndex]}`;
  
      const answer = document.getElementById('answer');
      answer.textContent = `${mushroom.norwegianName} (${mushroom.scientificName})`;
  
      answer.classList.add('hidden');
    }
  
    // Handle image click to open modal
    const quizImage = document.getElementById('quizImage');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeModal = document.getElementsByClassName('close')[0];
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
  
    quizImage.addEventListener('click', () => {
      modal.style.display = "flex";
      modalImg.src = quizImage.src;
    });
  
    closeModal.addEventListener('click', () => {
      modal.style.display = "none";
    });
  
    prevButton.addEventListener('click', () => {
      if (currentImageIndex > 0) {
        currentImageIndex--;
      } else {
        currentImageIndex = mushrooms[currentMushroomIndex].images.length - 1;
      }
      modalImg.src = `images/${mushrooms[currentMushroomIndex].images[currentImageIndex]}`;
    });
  
    nextButton.addEventListener('click', () => {
      if (currentImageIndex < mushrooms[currentMushroomIndex].images.length - 1) {
        currentImageIndex++;
      } else {
        currentImageIndex = 0;
      }
      modalImg.src = `images/${mushrooms[currentMushroomIndex].images[currentImageIndex]}`;
    });
  
    document.getElementById('prevImage').addEventListener('click', () => {
      if (currentImageIndex > 0) {
        currentImageIndex--;
        displayMushroom();
      }
    });
  
    document.getElementById('nextImage').addEventListener('click', () => {
      if (currentImageIndex < mushrooms[currentMushroomIndex].images.length - 1) {
        currentImageIndex++;
        displayMushroom();
      }
    });
  
    document.getElementById('showAnswer').addEventListener('click', () => {
      const answer = document.getElementById('answer');
      answer.classList.remove('hidden');
    });
  
    document.getElementById('prevMushroom').addEventListener('click', () => {
      if (currentMushroomIndex > 0) {
        currentMushroomIndex--;
        currentImageIndex = 0;
        displayMushroom();
      }
    });
  
    document.getElementById('nextMushroom').addEventListener('click', () => {
      if (currentMushroomIndex < mushrooms.length - 1) {
        currentMushroomIndex++;
        currentImageIndex = 0;
        displayMushroom();
      }
    });
  
    fetchData();
  });
  