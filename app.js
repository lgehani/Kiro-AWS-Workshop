// Activity Suggester — talks to the Bored API from the browser.
const API_BASE = "https://bored-api.appbrewery.com/api/v1/activity";

const els = {
  type: document.getElementById("type"),
  participants: document.getElementById("participants"),
  price: document.getElementById("price"),
  button: document.getElementById("suggestBtn"),
  result: document.getElementById("result"),
};

const PRICE_LABELS = [
  { max: 0, label: "Free" },
  { max: 0.3, label: "Cheap" },
  { max: 0.6, label: "Moderate" },
  { max: 1, label: "Pricey" },
];

function priceLabel(price) {
  if (typeof price !== "number") return "Unknown cost";
  const match = PRICE_LABELS.find((p) => price <= p.max);
  return match ? match.label : "Pricey";
}

function buildUrl() {
  const params = new URLSearchParams();
  if (els.type.value) params.set("type", els.type.value);
  if (els.participants.value) params.set("participants", els.participants.value);
  // "Max cost" maps to the maxprice filter (0 = free only).
  if (els.price.value !== "") params.set("maxprice", els.price.value);
  const qs = params.toString();
  return qs ? `${API_BASE}?${qs}` : API_BASE;
}

function render(html) {
  els.result.innerHTML = html;
}

function showLoading() {
  render('<div class="loading"><div class="spinner"></div>Finding something to do…</div>');
}

function showError(message) {
  render(`<div class="error">${message}</div>`);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function showActivity(a) {
  const participants = a.participants === 1 ? "Solo" : `${a.participants} people`;
  const link = a.link
    ? `<a class="activity-link" href="${escapeHtml(a.link)}" target="_blank" rel="noopener noreferrer">Learn more →</a>`
    : "";

  render(`
    <h2 class="activity-title">${escapeHtml(a.activity)}</h2>
    <div class="meta">
      <span class="tag">${escapeHtml(a.type)}</span>
      <span class="tag">${escapeHtml(participants)}</span>
      <span class="tag price">${escapeHtml(priceLabel(a.price))}</span>
    </div>
    ${link}
  `);
}

async function suggest() {
  els.button.disabled = true;
  showLoading();

  try {
    const res = await fetch(buildUrl(), { headers: { Accept: "application/json" } });
    const data = await res.json().catch(() => null);

    // The API returns { error: "..." } when no activity matches the filters.
    if (!res.ok || !data || data.error || !data.activity) {
      const msg = (data && data.error)
        ? "No activity matched those filters. Try loosening them."
        : `Request failed (HTTP ${res.status}). Please try again.`;
      showError(msg);
      return;
    }

    showActivity(data);
  } catch (err) {
    showError("Couldn't reach the Bored API. Check your connection and try again.");
    console.error(err);
  } finally {
    els.button.disabled = false;
  }
}

els.button.addEventListener("click", suggest);
