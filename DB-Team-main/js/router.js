let pageCache = {};
let mapInstance = null;

async function loadPage(url) {

    let html;

    if (pageCache[url]) {
        html = pageCache[url];
    } else {
        const response = await fetch(url);
        html = await response.text();
        pageCache[url] = html;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    document.title = doc.title;

    document.querySelector("main").innerHTML =
        doc.querySelector("main").innerHTML;

    requestAnimationFrame(() => {
        initPageScripts(url);
    });
}

function initPageScripts(url) {

    if (url.includes("contacts")) {

        const el = document.getElementById("map");
        if (!el) return;

        if (mapInstance) {
            mapInstance.remove();
            mapInstance = null;
        }

        el.offsetHeight;

        mapInstance = L.map("map").setView([48.920810, 24.721399], 16);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(mapInstance);

        L.marker([48.920810, 24.721399])
            .addTo(mapInstance)
            .bindPopup("You Better Call Bogdan");

        setTimeout(() => {
            mapInstance.invalidateSize();
        }, 100);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    initPageScripts(location.pathname);

    document.body.addEventListener("click", async (e) => {

        const link = e.target.closest("[data-link]");
        if (!link) return;

        e.preventDefault();

        const url = link.getAttribute("href");

        history.pushState({}, "", url);

        await loadPage(url);

        window.scrollTo(0, 0);
    });

    window.addEventListener("popstate", async () => {
        await loadPage(location.pathname);
    });
});