const actionButton = document.getElementById("actionButton");
const refreshNewsButton = document.getElementById("refreshNewsButton");
const message = document.getElementById("message");
const newsFeed = document.getElementById("newsFeed");

const liveNewsSource = "news.json";

function renderNewsCards(articles) {
  if (!articles || articles.length === 0) {
    newsFeed.innerHTML = '<div class="news-placeholder">No live news available right now. Try refreshing again in a few seconds.</div>';
    return;
  }

  newsFeed.innerHTML = articles
    .map(article => `
      <article class="news-card">
        <img src="${article.image}" alt="${article.title}" loading="lazy">
        <div class="news-card-content">
          <strong>${article.category}</strong>
          <h3>${article.title}</h3>
          <p>${article.description}</p>
          <a href="${article.url}" target="_blank" rel="noreferrer">Read full story</a>
        </div>
      </article>
    `)
    .join("");
}

async function loadLiveNews() {
  message.classList.remove("hidden");
  message.textContent = "Loading the latest football news...";

  try {
    const response = await fetch(liveNewsSource);
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
    const data = await response.json();
    renderNewsCards(data.articles);
    message.textContent = "Live news feed updated.";
  } catch (error) {
    console.error("Failed to load live news:", error);
    message.textContent = "Unable to fetch live news right now. Try again later.";
    newsFeed.innerHTML = '<div class="news-placeholder">Live feed is unavailable. Check your connection or news source.</div>';
  }
}

if (actionButton) {
  actionButton.addEventListener("click", () => loadLiveNews());
}

if (refreshNewsButton) {
  refreshNewsButton.addEventListener("click", () => loadLiveNews());
}

window.addEventListener('DOMContentLoaded', () => {
  // auto-load news on page open
  loadLiveNews();
  // auto-load live matches and refresh every 30s
  loadLiveMatches();
  const refreshLiveButton = document.getElementById('refreshLiveButton');
  if (refreshLiveButton) refreshLiveButton.addEventListener('click', () => loadLiveMatches());
  setInterval(loadLiveMatches, 30000);
  const loadWorldBtn = document.getElementById('loadWorld2026');
  if (loadWorldBtn) loadWorldBtn.addEventListener('click', () => loadWorld2026());
  // auto-load World Cup data once on page open
  loadWorld2026();
  // wire team filter inputs
  const teamFilter = document.getElementById('teamFilter');
  if (teamFilter) teamFilter.addEventListener('input', () => renderLiveMatchesFiltered());
  const liveFilter = document.getElementById('liveFilter');
  if (liveFilter) liveFilter.addEventListener('change', () => renderLiveMatchesFiltered());
  const worldTeamFilter = document.getElementById('worldTeamFilter');
  if (worldTeamFilter) worldTeamFilter.addEventListener('input', () => renderWorld2026Filtered());
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(console.error);
  });
}

