const baseUrl = "https://v6.bvg.transport.rest";

// Product badge config: key matches API products field, label + BVG colour
const PRODUCTS = [
    { key: "suburban",  label: "S", color: "#008d4f", textColor: "#fff" },
    { key: "subway",    label: "U", color: "#0a3887", textColor: "#fff" },
    { key: "tram",      label: "T", color: "#be1414", textColor: "#fff" },
    { key: "bus",       label: "B", color: "#7d007d", textColor: "#fff" },
    { key: "ferry",     label: "F", color: "#0083c0", textColor: "#fff" },
    { key: "regional",  label: "R", color: "#5e5e5e", textColor: "#fff" },
    { key: "express",   label: "E", color: "#c0272d", textColor: "#fff" },
];

const input  = document.getElementById("search-input");
const list   = document.getElementById("results");
const hint   = document.getElementById("hint");
const tmpl   = document.querySelector("#result-item");

let debounceTimer = null;

input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const query = input.value.trim();
    if (!query) {
        showHint("Gib einen Haltestellennamen ein.");
        list.innerHTML = "";
        return;
    }
    debounceTimer = setTimeout(() => search(query), 300);
});

async function search(query) {
    showHint("Suche …");
    list.innerHTML = "";

    const params = new URLSearchParams({
        query,
        stops: "true",
        addresses: "false",
        poi: "false",
        results: "10",
        language: "de",
    });

    try {
        const response = await fetch(`${baseUrl}/locations?${params}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const locations = await response.json();
        const stops = locations.filter(l => l.type === "stop");

        if (stops.length === 0) {
            showHint("Keine Haltestellen gefunden.");
            return;
        }

        hint.hidden = true;
        stops.forEach(stop => list.append(createResultNode(stop)));
    } catch (err) {
        showHint("Fehler beim Laden der Ergebnisse.");
        console.error(err);
    }
}

function createResultNode(stop) {
    const node = tmpl.content.cloneNode(true);
    const url = `index.html?stop=${encodeURIComponent(stop.id)}`;

    node.querySelector(".result-link").href = url;
    node.querySelector(".result-name").textContent = stop.name;

    const badgesEl = node.querySelector(".result-badges");
    if (stop.products) {
        PRODUCTS.forEach(({ key, label, color, textColor }) => {
            if (stop.products[key]) {
                const badge = document.createElement("span");
                badge.className = "badge";
                badge.textContent = label;
                badge.style.setProperty("--badge-color", color);
                badge.style.setProperty("--badge-text", textColor);
                badgesEl.append(badge);
            }
        });
    }

    return node;
}

function showHint(text) {
    hint.hidden = false;
    hint.textContent = text;
}
