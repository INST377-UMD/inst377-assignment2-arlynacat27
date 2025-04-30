let slideIndex = 1;
let slides = [];

// random dogs slideshow
async function loadDogImages() {
  try {
    //fetch 10 random dog images from API
    const res = await fetch('https://dog.ceo/api/breeds/image/random/10');
    const data = await res.json();

    const slideshow = document.getElementById('dog-slideshow');
    slideshow.innerHTML = ''; // clear any exisiting images

    //dynamically makes and append <img> elements to slideshow
    data.message.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.className = 'mySlides';
      img.style.width = '100%';
      img.style.maxHeight = '400px';
      img.style.display = 'none'; //initially hidden 
      slideshow.appendChild(img);
    });

    //grab all slideshow images and display first one
    slides = document.getElementsByClassName('mySlides');
    showSlides(slideIndex);

  } catch (error) {
    alert('Error loading dog images.');
  }
}

//manual navigation (prev/next buttons)
function plusSlides(n) {
  showSlides(slideIndex += n);
}

//show the current slide based on slideIndex
function showSlides(n) {
  if (slides.length === 0) return; //do nothing is there are no slides

  if (n > slides.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = slides.length; }

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }
  slides[slideIndex - 1].style.display = 'block';
}


//dog breed buttons
async function loadDogBreeds() {
  try {
    const res = await fetch('https://api.thedogapi.com/v1/breeds');
    const breeds = await res.json();

    const breedButtonsDiv = document.getElementById('breed-buttons');

    breeds.forEach(breed => {
      const button = document.createElement('button');
      button.className = 'custom-button';
      button.textContent = breed.name;
      button.onclick = () => showBreedInfo(breed);
      breedButtonsDiv.appendChild(button);
    });
  } catch (error) {
    alert('Error loading dog breeds.');
  }
}

//dog breed information
function showBreedInfo(breed) {
  document.getElementById('breed-info').style.display = 'block';
  document.getElementById('breedName').textContent = breed.name;
  document.getElementById('breedDesc').textContent = breed.bred_for || 'No description available';
  
  //parse min and max life span 
  document.getElementById('breedMinLife').textContent = breed.life_span.split(' ')[0];
  document.getElementById('breedMaxLife').textContent = breed.life_span.split(' ')[2] || breed.life_span.split(' ')[0];
}

//voice command for dog breed 
if (annyang) {
  annyang.addCommands({
    'load dog breed *breed': (breedName) => {
      const buttons = document.querySelectorAll('#breed-buttons button');
      buttons.forEach(button => {
        if (button.textContent.toLowerCase() === breedName.toLowerCase()) {
          button.click();
        }
      });
    }
  });
}

//load everything when page is opened 
document.addEventListener('DOMContentLoaded', () => {
  loadDogImages();
  loadDogBreeds();
});
