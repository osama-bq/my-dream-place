const loadData = fetch('../data/properties.json')
    .then(res => res.json())
    .then(json => {
        properties = [...json['properties']];
        return json['properties'];
    });

const domReady = new Promise((resolve) => {
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', resolve);
    else
        resolve();
});

function render([data,]) {
    const params = new URLSearchParams(window.location.search);
    const location = params.get('location').trim();

    let filtered;
    
    if (location) {
        filtered = data.filter(p => location.toLowerCase() === p.location.city.toLowerCase());

        const searchLocation = document.querySelector('.search-location');
        const resultCount = document.querySelector('.result-count');
        searchLocation.innerText = location;
        resultCount.innerText = filtered.length;
    } else {
        filtered = data;
        document.querySelector('.result-list-title').innerHTML = 'Showing all results';
    }

    renderData(filtered.slice(0, SHOW_INITIAL)); // utilities.js
    showEndOfList(filtered.length); // utilities.js

    // Load more button
    const loadMore = document.querySelector('.load-more .btn');

    loadMore.addEventListener('click', () => {
        renderData(filtered);
        loadMore.classList.add('hidden');
    });
}

Promise.all([loadData, domReady]).then(render);