(function () {
    "use strict";

    const FEATURED_VIDEO_IDS = ["vsnklepvkqk", "qxjetxqfhra", "fqw7ctugsau"];

    function formatDate(value) {
        if (!value) return "";
        return new Intl.DateTimeFormat("en-GB", {
            month: "short",
            year: "numeric"
        }).format(new Date(value + "T00:00:00"));
    }

    function isFeaturedVideo(item) {
        const url = (item.url || "").toLowerCase();
        return FEATURED_VIDEO_IDS.some((id) => url.includes(id));
    }

    function renderList(type, items) {
        const section = document.querySelector('[data-catalog="' + type + '"]');
        const list = document.getElementById("catalog-" + type);
        if (!section || !list) return;

        const rows = items
            .filter((item) => item.type === type)
            .filter((item) => type !== "video" || !isFeaturedVideo(item))
            .sort((a, b) => b.date.localeCompare(a.date));

        if (!rows.length) {
            section.style.display = "none";
            return;
        }

        list.innerHTML = rows.map((item) => {
            const meta = [item.source, formatDate(item.date)].filter(Boolean).join(" · ");
            return '<a class="focus-item" href="' + item.url + '" target="_blank" rel="noopener">' +
                item.title + (meta ? " — " + meta : "") +
                "</a>";
        }).join("");
    }

    fetch("catalog.json", { cache: "no-store" })
        .then((response) => response.json())
        .then((catalog) => {
            const items = catalog.items || [];
            ["writing", "press", "podcast", "talk", "video", "post"].forEach((type) => {
                renderList(type, items);
            });
            const target = document.getElementById(location.hash.replace(/^#/, ""));
            if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        })
        .catch(() => {
            document.querySelectorAll("[data-catalog]").forEach((section) => {
                section.style.display = "none";
            });
        });
})();
