const TYPE_LABELS = {
  writing: "Writing",
  press: "Press",
  podcast: "Podcast",
  video: "Video",
  talk: "Talk",
  post: "Post"
};

const WORK_TOPICS = [
  ["spec-driven", "Spec-Driven Development"],
  ["ai", "AI-assisted engineering workflows"],
  ["venture-building", "Startup studio infrastructure"],
  ["platforms", "Internal developer platforms"],
  ["venture-building", "Venture building systems"],
  ["product-strategy", "Technical product strategy"],
  ["startup-intelligence", "Startup intelligence"],
  ["delivery", "Delivery quality and operational tooling"]
];

const state = {
  catalog: null,
  type: "all",
  topic: "all",
  query: ""
};

const $ = (id) => document.getElementById(id);

function parseHash() {
  const hash = new URLSearchParams(location.hash.replace(/^#/, ""));
  state.type = hash.get("type") || "all";
  state.topic = hash.get("topic") || "all";
  state.query = hash.get("q") || "";
}

function writeHash() {
  const hash = new URLSearchParams();
  if (state.type !== "all") hash.set("type", state.type);
  if (state.topic !== "all") hash.set("topic", state.topic);
  if (state.query) hash.set("q", state.query);
  const next = hash.toString();
  history.replaceState(null, "", next ? `#${next}` : location.pathname);
}

function topicLabel(id) {
  return state.catalog.topics.find((topic) => topic.id === id)?.label || id;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function filteredItems() {
  const query = state.query.trim().toLowerCase();
  return state.catalog.items
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((item) => state.type === "all" || item.type === state.type)
    .filter((item) => state.topic === "all" || item.topics.includes(state.topic))
    .filter((item) => {
      if (!query) return true;
      return [item.title, item.summary, item.source, ...(item.topics || [])]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
}

function card(item, catalog) {
  const related = (item.related || [])
    .map((id) => catalog.items.find((entry) => entry.id === id))
    .filter(Boolean);

  return `
    <article class="card">
      <div class="card-meta">
        <span class="type">${TYPE_LABELS[item.type] || item.type}</span>
        <span>${formatDate(item.date)}</span>
      </div>
      <h3><a href="${item.url}" target="_blank" rel="noreferrer">${item.title}</a></h3>
      <p>${item.summary}</p>
      <div class="tags">${item.topics.map((topic) => `<button class="tag" data-topic="${topic}">${topicLabel(topic)}</button>`).join("")}</div>
      ${related.length ? `<div class="related">Also: ${related.map((entry) => `<a href="${entry.url}" target="_blank" rel="noreferrer">${TYPE_LABELS[entry.type]}</a>`).join(" · ")}</div>` : ""}
    </article>
  `;
}

function render() {
  const catalog = state.catalog;
  $("scanned").textContent = `Scanned ${catalog.scannedAt}`;
  $("count").textContent = `${catalog.items.length} records in the ledger`;
  $("search").value = state.query;

  $("work-list").innerHTML = WORK_TOPICS.map(([id, label]) => (
    `<li><button data-topic="${id}" class="${state.topic === id ? "active" : ""}">${label}</button></li>`
  )).join("");

  $("type-filters").innerHTML = ["all", ...Object.keys(TYPE_LABELS)]
    .map((type) => `<button class="chip ${state.type === type ? "active" : ""}" data-type="${type}">${type === "all" ? "All" : TYPE_LABELS[type]}</button>`)
    .join("");

  $("topic-filters").innerHTML = [
    `<button class="chip ${state.topic === "all" ? "active" : ""}" data-topic="all">All topics</button>`,
    ...catalog.topics.map((topic) => (
      `<button class="chip ${state.topic === topic.id ? "active" : ""}" data-topic="${topic.id}">${topic.label}</button>`
    ))
  ].join("");

  const items = filteredItems();
  $("archive").innerHTML = items.length
    ? items.map((item) => card(item, catalog)).join("")
    : `<div class="empty">Nothing in this thread yet. Add a record to <code>data/catalog.json</code> or wait for the next scan.</div>`;

  $("latest").innerHTML = catalog.items
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)
    .map((item) => card(item, catalog))
    .join("");

  $("portfolio").innerHTML = catalog.portfolio.map((company) => `
    <a class="company" href="${company.url}" target="_blank" rel="noreferrer">
      <strong>${company.name}</strong>
      <span>${company.year} · ${company.place} · ${company.sector}</span>
      <p>${company.blurb}</p>
    </a>
  `).join("");

  writeHash();
}

function setTopic(topic) {
  state.topic = topic || "all";
  $("archive-section").scrollIntoView({ behavior: "smooth", block: "start" });
  render();
}

function bind() {
  $("search").addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });

  document.body.addEventListener("click", (event) => {
    const type = event.target.closest("[data-type]");
    const topic = event.target.closest("[data-topic]");
    if (type) {
      state.type = type.dataset.type;
      render();
    }
    if (topic) {
      setTopic(topic.dataset.topic);
    }
  });

  window.addEventListener("hashchange", () => {
    parseHash();
    render();
  });
}

async function boot() {
  parseHash();
  const response = await fetch("./catalog.json", { cache: "no-store" });
  state.catalog = await response.json();
  bind();
  render();
}

boot();
