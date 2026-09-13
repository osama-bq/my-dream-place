var property = null;

function render() {
    const params = new URLSearchParams(window.location.search);
    const pId = params.get('id').trim();


    if (!pId) return;

    property = properties.find(p => p.id === pId);

    if (!property) return;

    const images = document.querySelectorAll('.gallery-grid .grid-item img');

    Array.from(images).forEach((img, index) => {
        if (index < property.content.images.length) {
            img.src = property.content.images[index];
        }
    });
}

Promise.all([loadData, domReady]).then(render);