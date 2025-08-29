const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const newQuoteBtn = document.getElementById("new-quote");
const categorySelect = document.getElementById("category-select");
const favoriteBtn = document.getElementById("favorite-quote");
const favoritesList = document.getElementById("favorites-list");

// Load favorites from localStorage
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Render favorites
function renderFavorites() {
  favoritesList.innerHTML = "";
  favorites.forEach((fav, index) => {
    const li = document.createElement("li");
    li.textContent = `"${fav.text}" — ${fav.author}`;
    li.className = "border-b py-1 flex justify-between";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.className = "ml-2 text-red-500";
    removeBtn.onclick = () => {
      favorites.splice(index, 1);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      renderFavorites();
    };

    li.appendChild(removeBtn);
    favoritesList.appendChild(li);
  });
}

// Fetch quote based on selected category
async function getQuote() {
  const category = categorySelect.value;
  let apiUrl = "";

  if (category === "motivation") {
    apiUrl = "https://zenquotes.io/api/random";
  } else if (category === "tech") {
    apiUrl = "https://programming-quotes-api.vercel.app/api/random";
  } else if (category === "humor") {
    apiUrl = "https://v2.jokeapi.dev/joke/Any?type=single"; // JokeAPI
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    let quote = "";
    let author = "";

    if (category === "motivation") {
      quote = data[0].q;
      author = data[0].a;
    } else if (category === "tech") {
      quote = data.en;
      author = data.author;
    } else if (category === "humor") {
      quote = data.joke;
      author = "Humor Bot 🤖";
    }

    quoteText.textContent = quote;
    quoteAuthor.textContent = `— ${author}`;
  } catch (error) {
    quoteText.textContent = "Oops! Could not fetch a quote.";
    quoteAuthor.textContent = "";
  }
}

// Add current quote to favorites
favoriteBtn.addEventListener("click", () => {
  if (quoteText.textContent && quoteAuthor.textContent) {
    const newFav = {
      text: quoteText.textContent,
      author: quoteAuthor.textContent.replace("— ", "")
    };
    favorites.push(newFav);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
  }
});

// Event listeners
newQuoteBtn.addEventListener("click", getQuote);
categorySelect.addEventListener("change", getQuote);

// Toggle Favorites Collapsible
const toggleBtn = document.getElementById("toggle-favorites");
const favoritesContainer = document.getElementById("favorites-container");
const toggleIcon = document.getElementById("toggle-icon");

toggleBtn.addEventListener("click", () => {
  favoritesContainer.classList.toggle("hidden");
  toggleIcon.textContent = favoritesContainer.classList.contains("hidden") ? "▼" : "▲";
});

// Initialize
renderFavorites();
getQuote();
