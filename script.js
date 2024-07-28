const mushrooms = [];

async function fetchData() {
  const response = await fetch('data.json');
  const data = await response.json();
  mushrooms.push(...data);
  populateHomePage();
  populateComparePage();
}

function populateHomePage() {
  const mushroomGrid = document.querySelector('.mushroom-grid');
  mushroomGrid.innerHTML = '';

  let row = document.createElement('div');
  row.classList.add('mushroom-row');

  mushrooms.forEach((mushroom, index) => {
    const image = document.createElement('img');

    if (mushroom.images && mushroom.images.length > 0) {
      image.src = `images/${mushroom.images[0]}`;
    } else {
      image.src = 'default_image.jpg'; // Replace with your default image path
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
  searchInput.addEventListener('input', handleSearch);
}

function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase();
  const suggestions = document.getElementById('suggestions');
  suggestions.innerHTML = '';

  const filteredMushrooms = mushrooms.filter(mushroom => mushroom.norwegianName.toLowerCase().includes(searchTerm));

  filteredMushrooms.forEach(mushroom => {
    const suggestion = document.createElement('li');
    suggestion.textContent = mushroom.norwegianName;
    suggestions.appendChild(suggestion);
  });
}

function populateMushroomPage() {
  const id = new URLSearchParams(window.location.search).get('id');
  const mushroom = mushrooms[id];

  const nameElement = document.getElementById('mushroom-name');
  const scientificNameElement = document.getElementById('mushroom-scientific-name');
  const imagesContainer = document.querySelector('.mushroom-images');
  const descriptionElement = document.getElementById('mushroom-description');

  nameElement.textContent = mushroom.norwegianName;
  scientificNameElement.textContent = mushroom.scientificName;

  mushroom.images.forEach(imageFilename => {
    const image = document.createElement('img');
    image.src = `images/${imageFilename}`;
    image.alt = mushroom.norwegianName;
    imagesContainer.appendChild(image);
  });

  descriptionElement.textContent = mushroom.description;
}

function populateComparePage() {
  const searchInput1 = document.getElementById('search1');
  const searchInput2 = document.getElementById('search2');
  const mushroom1Images = document.getElementById('mushroom1-images');
  const mushroom2Images = document.getElementById('mushroom2-images');

  searchInput1.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredMushrooms = mushrooms.filter(mushroom => mushroom.norwegianName.toLowerCase().includes(searchTerm));

    if (filteredMushrooms.length > 0) {
      const mushroom = filteredMushrooms[0]; // Assuming only one result for simplicity
      mushroom1Images.innerHTML = '';
      mushroom.images.forEach(imageFilename => {
        const image = document.createElement('img');
        image.src = `images/${imageFilename}`;
        image.alt = mushroom.norwegianName;
        image.classList.add('mushroom-image');
        mushroom1Images.appendChild(image);
      });
    } else {
      mushroom1Images.innerHTML = 'No results found';
    }
  });

  searchInput2.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredMushrooms = mushrooms.filter(mushroom => mushroom.norwegianName.toLowerCase().includes(searchTerm));

    if (filteredMushrooms.length > 0) {
      const mushroom = filteredMushrooms[0]; // Assuming only one result for simplicity
      mushroom2Images.innerHTML = '';
      mushroom.images.forEach(imageFilename => {
        const image = document.createElement('img');
        image.src = `images/${imageFilename}`;
        image.alt = mushroom.norwegianName;
        image.classList.add('mushroom-image');
        mushroom2Images.appendChild(image);
      });
    } else {
      mushroom2Images.innerHTML = 'No results found';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
});
