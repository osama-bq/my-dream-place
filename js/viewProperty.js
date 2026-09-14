var property = null;

function render() {
    const params = new URLSearchParams(window.location.search);
    const pId = params.get('id').trim();


    if (!pId) return;

    property = properties.find(p => p.id === pId);

    if (!property) return;

    const { name, rating, location } = property;

    const images = document.querySelectorAll('.gallery-grid .grid-item img');

    Array.from(images).forEach((img, index) => {
        if (index < property.content.images.length) {
            img.src = property.content.images[index];
        }
    });

    const title = document.querySelector('.property-title');
    const ratingAmount = document.querySelector('.rating .amount');
    const ratingStars = document.querySelector('.rating .stars');
    const reviews = document.querySelector('.rating .reviews');
    
    const address = document.querySelector('.property-location');

    const overview = document.querySelector('.property-overview .description');

    title.innerText = name;
    ratingAmount.innerText = rating.score;
    ratingStars.style.maskImage = `linear-gradient(
        to right,
        black 0%,
        black ${rating.score * 20}%, /* {rating * 20} % */
        #0005 ${rating.score * 20}%, /* {rating * 20} % */
        #0005 100%
    )`;
    reviews.innerText = rating.reviews;

    address.innerHTML += `<span>${location.address}, ${location.city}, ${location.country}</span>`;
    
    overview.innerText = property.content.pageOverview;
}

Promise.all([loadData, domReady]).then(render);