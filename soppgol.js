document.addEventListener('DOMContentLoaded', async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      let mushroomName = params.get('name') ? params.get('name').toLowerCase() : "bjørkevokssopp";
      
      const response = await fetch('gol.json'); // Ensure the file path is correct
      if (!response.ok) {
        throw new Error('Failed to load gol.json');
      }
  
      const mushrooms = await response.json();
  
      let currentIndex = mushrooms.findIndex(m => m.norwegianName.toLowerCase() === mushroomName);
  
      if (currentIndex === -1) {
        currentIndex = mushrooms.findIndex(m => m.norwegianName.toLowerCase() === "rød fluesopp");
      }
  
      if (currentIndex === -1) {
        document.getElementById('mushroom-name').textContent = "Mushroom not found";
        return;
      }
  
      function updateMushroomDetails(index) {
        const mushroom = mushrooms[index];
        document.getElementById('mushroom-name').textContent = mushroom.norwegianName;
        document.getElementById('scientific-name').innerHTML = `<i>${mushroom.scientificName}</i>`;
  
        const imagesContainer = document.getElementById('images-container');
        imagesContainer.innerHTML = '';
        mushroom.images.forEach((image, imgIndex) => {
          const img = document.createElement('img');
          img.src = `images/gol/${image}`;  // Updated path to images in /images/gol/
          img.alt = `${mushroom.norwegianName}`;
          img.classList.add('mushroom-image');
          img.setAttribute('data-index', imgIndex);
          imagesContainer.appendChild(img);
        });
  
        // Modal image viewer
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-image');
        const captionText = document.getElementById('caption');
  
        imagesContainer.addEventListener('click', (event) => {
          if (event.target.tagName === 'IMG') {
            modal.style.display = "flex";
            currentIndex = parseInt(event.target.getAttribute('data-index'));
            modalImg.src = event.target.src;
            captionText.textContent = event.target.alt;
          }
        });
  
        const closeBtn = document.getElementsByClassName('close')[0];
        closeBtn.onclick = () => {
          modal.style.display = "none";
        };
  
        const prevBtn = document.getElementsByClassName('prev')[0];
        const nextBtn = document.getElementsByClassName('next')[0];
  
        prevBtn.onclick = () => {
          currentIndex = (currentIndex > 0) ? currentIndex - 1 : mushroom.images.length - 1;
          modalImg.src = `images/gol/${mushroom.images[currentIndex]}`;  // Updated path to images in /images/gol/
          captionText.textContent = mushroom.norwegianName;
        };
  
        nextBtn.onclick = () => {
          currentIndex = (currentIndex < mushroom.images.length - 1) ? currentIndex + 1 : 0;
          modalImg.src = `images/gol/${mushroom.images[currentIndex]}`;  // Updated path to images in /images/gol/
          captionText.textContent = mushroom.norwegianName;
        };
      }
  
      updateMushroomDetails(currentIndex);
  
      document.getElementById('prev-mushroom').onclick = () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : mushrooms.length - 1;
        updateMushroomDetails(currentIndex);
      };
  
      document.getElementById('next-mushroom').onclick = () => {
        currentIndex = (currentIndex < mushrooms.length - 1) ? currentIndex + 1 : 0;
        updateMushroomDetails(currentIndex);
      };
  
      // Add event listener for search input
      const searchInput = document.getElementById('main-search');
      const suggestionsContainer = document.getElementById('suggestions');
  
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        suggestionsContainer.innerHTML = ''; // Clear previous suggestions
  
        // Filter mushrooms by both Norwegian name and Latin name
        const filteredMushrooms = mushrooms.filter(m => 
          m.norwegianName.toLowerCase().includes(query) || 
          m.scientificName.toLowerCase().includes(query)
        );
  
        filteredMushrooms.forEach(m => {
          const suggestion = document.createElement('div');
          suggestion.classList.add('suggestion');
          suggestion.textContent = `${m.norwegianName} (${m.scientificName})`; // Display both names
          suggestion.onclick = () => {
            searchInput.value = m.norwegianName;
            suggestionsContainer.innerHTML = '';
            updateMushroomDetails(mushrooms.findIndex(mushroom => mushroom.norwegianName === m.norwegianName));
          };
          suggestionsContainer.appendChild(suggestion);
        });
      });
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('mushroom-name').textContent = "Error loading mushroom details";
    }
  });
