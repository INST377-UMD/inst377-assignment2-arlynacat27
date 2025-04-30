let stockChart; // reference to Chart.js chart

//search and display stock data
async function searchStock(tickerFromVoice = '') {
  const tickerInput = document.getElementById('tickerInput');
  const dayRange = document.getElementById('dayRange').value;

  //grab voice/typed input and convert to uppercase
  const ticker = tickerFromVoice || tickerInput.value.trim().toUpperCase();
  if (!ticker) {
    alert('Please enter a stock ticker.');
    return;
  }

  //calculate date range
  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - parseInt(dayRange));

  //format dates as YYYY-MM-DD
  const formatDate = (date) => date.toISOString().split('T')[0];

  const fromDate = formatDate(pastDate);
  const toDate = formatDate(today);

  try {
    const apiKey = 'n8sZVJQa6dnB07QhdGoHP1pkVu7EWmkg';
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      alert('No stock data found for this ticker.');
      return;
    }

    //chart labels (dates) and data (closing prices)
    const labels = data.results.map(entry => {
      const date = new Date(entry.t); //Epoch time
      return `${date.getMonth()+1}/${date.getDate()}`; //format: MM/DD
    });

    const closePrices = data.results.map(entry => entry.c); //close price

    //if there is already a chart, destroy it before creating a new one
    if (stockChart) {
      stockChart.destroy();
    }

    //create new Chart.js line chart
    const create = document.getElementById('stockChartCanvas').getContext('2d');
    stockChart = new Chart(create, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `${ticker} Closing Prices`,
          data: closePrices,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: 'Date' }
          },
          y: {
            title: { display: true, text: 'Closing Price ($)' }
          }
        }
      }
    });

  } catch (error) {
    alert('Error fetching stock data.');
  }
}

//top 5 stocks
async function loadRedditStocks() {
  try {
    const res = await fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03');
    const data = await res.json();

    const tbody = document.getElementById('redditStocksBody');
    tbody.innerHTML = ''; //clears any previous results

    //displays top 5 stocks in table 
    data.slice(0, 5).forEach(stock => {
      const row = document.createElement('tr');

      //ticker column 
      const tickerCell = document.createElement('td');
      const link = document.createElement('a');
      link.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
      link.target = '_blank';
      link.textContent = stock.ticker;
      tickerCell.appendChild(link);

      //comment count column 
      const commentCell = document.createElement('td');
      commentCell.textContent = stock.no_of_comments;

      //sentiment column (emoji)
      const sentimentCell = document.createElement('td');
      sentimentCell.innerHTML = stock.sentiment === 'Bullish' ? '🐂' : '🐻';

      //add all cells to row
      row.appendChild(tickerCell);
      row.appendChild(commentCell);
      row.appendChild(sentimentCell);

      //add row to table body 
      tbody.appendChild(row);
    });
  } catch (error) {
    alert('Error loading Reddit stocks.');
  }
}

//voice command for stock lookup
if (annyang) {
  annyang.addCommands({
    'lookup *stock': (stock) => {
      searchStock(stock.toUpperCase());
    }
  });
}

//load top 5 stocks when page is opened
document.addEventListener('DOMContentLoaded', loadRedditStocks);
