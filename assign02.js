// start and stop audio
function startAudio() {
    if (annyang) {
      annyang.start(); //start voice recognition 
    }
}
function stopAudio() {
    if (annyang) {
      annyang.abort(); //stop voice recognition 
    }
}

//define voice commands
  if (annyang) {
    const commands = {
      'hello': () => alert('Hello World'),
      'change the color to *color': (color) => {
        document.body.style.backgroundColor = color;
      },
      'navigate to *page': (page) => {
        page = page.toLowerCase();
        if (page.includes('home')) window.location.href = 'home.html';
        else if (page.includes('stocks')) window.location.href = 'stocks.html';
        else if (page.includes('dogs')) window.location.href = 'dogs.html';
      }
    };
    annyang.addCommands(commands); // add commands to Annyang
  }


//when page is fully loaded, it will check the current page
//if it is the home page, the quote generator will activate
window.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.includes('home.html')) {
      loadQuote();
    }
});
  
//load random quote
async function loadQuote() {
    try {
      const res = await fetch('https://zenquotes.io/api/random');
      const data = await res.json();

      //display the quote and author inside id "quote"
      document.getElementById('quote').textContent = data[0].q + ' — ' + data[0].a;
    
    } catch (error) {
      document.getElementById('quote').textContent = 'Could not load quote.';
    }
}