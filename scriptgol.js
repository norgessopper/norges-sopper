const mushrooms = [];

// Load mushrooms data from LocalStorage or fetch from JSON file
async function fetchData() {
  try {
    const storedMushrooms = localStorage.getItem('mushrooms');
    
    if (storedMushrooms) {
      mushrooms.push(...JSON.parse(storedMushrooms));
    } else {
      const response = await fetch('gol.json');
      if (!response.ok) throw new Error('Failed to fetch mushroom data');
      const data = await response.json();
      mushrooms.push(...data);
      localStorage.setItem('mushrooms', JSON.stringify(mushrooms));
    }

    populateHomePage();
    populateComparePage();
    populateMushroomPage();
  } catch (error) {
    console.error('Error fetching mushroom data:', error);
  }
}

function populateHomePage() {
  const mushroomGrid = document.querySelector('.mushroom-grid');
  mushroomGrid.innerHTML = '';

  let row = document.createElement('div');
  row.classList.add('mushroom-row');

  mushrooms.forEach((mushroom, index) => {
    const image = document.createElement('img');

    if (mushroom.images && mushroom.images.length > 0) {
      image.src = `images/gol/${mushroom.images[0]}`;
    } else {
      image.src = 'default_image.jpg'; 
    }

    image.alt = mushroom.norwegianName;
    image.classList.add('mushroom-image');

    const link = document.createElement('a');
    link.href = `mushrooms.html?id=${index}`;

    const name = document.createElement('p');
    name.textContent = `${mushroom.norwegianName} - ${mushroom.scientificName}`;
    link.appendChild(image);
    link.appendChild(name);
    row.appendChild(link);

    if ((index + 1) % 3 === 0) {
      mushroomGrid.appendChild(row);
      row = document.createElement('div');
      row.classList.add('mushroom-row');
    }
  });

  if (row.children.length > 0) {
    mushroomGrid.appendChild(row);
  }

  const searchInput = document.getElementById('search');
  const suggestionsContainer = document.getElementById('suggestions');

  searchInput.addEventListener('input', debounce(handleSearch, 300));

  // Add event listener for clicking outside the suggestion box
  document.addEventListener('click', (event) => {
    if (!suggestionsContainer.contains(event.target) && event.target !== searchInput) {
      suggestionsContainer.innerHTML = ''; // Clear suggestions when clicking outside
    }
  });

  // Prevent closing suggestions when clicking inside the container
  suggestionsContainer.addEventListener('click', (event) => {
    event.stopPropagation();
  });
}

function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase();
  const suggestions = document.getElementById('suggestions');
  suggestions.innerHTML = '';

  const filteredMushrooms = mushrooms.filter(mushroom => 
    mushroom.norwegianName.toLowerCase().includes(searchTerm) ||
    mushroom.scientificName.toLowerCase().includes(searchTerm)
  );

  filteredMushrooms.forEach(mushroom => {
    const suggestion = document.createElement('li');
    suggestion.innerHTML = `${mushroom.norwegianName} <em>(${mushroom.scientificName})</em>`;
    suggestions.appendChild(suggestion);

    suggestion.addEventListener('click', () => {
      document.getElementById('search').value = mushroom.norwegianName;
      suggestions.innerHTML = '';
      populateGallery([mushroom]);
    });
  });
}

function populateMushroomPage() {
  const id = new URLSearchParams(window.location.search).get('id');
  const mushroom = mushrooms[id];

  if (!mushroom) {
    console.error("Mushroom not found");
    return;
  }

  const nameElement = document.getElementById('mushroom-name');
  const scientificNameElement = document.getElementById('mushroom-scientific-name');
  const imagesContainer = document.querySelector('.mushroom-images');
  const descriptionElement = document.getElementById('mushroom-description');
  const copyrightInput = document.getElementById('copyright-name');
  const saveButton = document.getElementById('save-copyright');

  nameElement.textContent = mushroom.norwegianName;
  scientificNameElement.textContent = mushroom.scientificName;

  imagesContainer.innerHTML = '';
  mushroom.images.forEach(imageFilename => {
    const image = document.createElement('img');
    image.src = `images/gol/${imageFilename}`;
    image.alt = mushroom.norwegianName;
    image.style.maxWidth = '200px';
    image.style.maxHeight = '200px';
    imagesContainer.appendChild(image);
  });

  descriptionElement.textContent = mushroom.description || "No description available.";

  // Handle save action
  saveButton.addEventListener('click', () => {
    const copyrightName = copyrightInput.value;
    if (copyrightName) {
      mushroom.copyrightHolder = copyrightName;

      // Update the data in LocalStorage
      localStorage.setItem('mushrooms', JSON.stringify(mushrooms));
      
      alert('Copyright holder name saved successfully.');
    } else {
      alert('Please enter a valid name.');
    }
  });
}

function populateComparePage() {
  const searchInput1 = document.getElementById('search1');
  const searchInput2 = document.getElementById('search2');
  const mushroom1Images = document.getElementById('mushroom1-images');
  const mushroom2Images = document.getElementById('mushroom2-images');

  searchInput1.addEventListener('input', debounce((event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredMushrooms = mushrooms.filter(mushroom => mushroom.norwegianName.toLowerCase().includes(searchTerm));

    if (filteredMushrooms.length > 0) {
      mushroom1Images.innerHTML = '';
      filteredMushrooms.forEach(mushroom => {
        mushroom.images.forEach(imageFilename => {
          const image = document.createElement('img');
          image.src = `images/gol/${imageFilename}`;
          image.alt = mushroom.norwegianName;
          image.classList.add('mushroom-image');
          image.style.maxWidth = '200px';
          image.style.maxHeight = '200px';
          mushroom1Images.appendChild(image);
        });
      });
    } else {
      mushroom1Images.innerHTML = 'No results found';
    }
  }, 300));

  searchInput2.addEventListener('input', debounce((event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredMushrooms = mushrooms.filter(mushroom => mushroom.norwegianName.toLowerCase().includes(searchTerm));

    if (filteredMushrooms.length > 0) {
      mushroom2Images.innerHTML = '';
      filteredMushrooms.forEach(mushroom => {
        mushroom.images.forEach(imageFilename => {
          const image = document.createElement('img');
          image.src = `images/gol/${imageFilename}`;
          image.alt = mushroom.norwegianName;
          image.classList.add('mushroom-image');
          image.style.maxWidth = '200px';
          image.style.maxHeight = '200px';
          mushroom2Images.appendChild(image);
        });
      });
    } else {
      mushroom2Images.innerHTML = 'No results found';
    }
  }, 300));
}

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
});

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
