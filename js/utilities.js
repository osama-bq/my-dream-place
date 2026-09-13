// constants and global variables
const SHOW_INITIAL = 5;
const CURRENCY_SIGN = {'USD': '$'};

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

var properties = [];
var filtered = [...properties];

const resultList = document.querySelector('.result-list');
var rowTemplate = document.querySelector('.card-row');

// functions
function calcDiscount(original, discounted) {
    original = Number.parseFloat(original);
    discounted = Number.parseFloat(discounted);
    return Math.round(
        100 * (original - discounted) / original
    );
}

function renderData(filteredData) {
    resultList.innerHTML = ''; // clear everything inside

    filteredData.forEach(result => {
        const {
            id,
            name,
            rating,
            pricing,
            content
        } = result;

        const thumbnail = rowTemplate.querySelector('.card-img img');
        const title = rowTemplate.querySelector('.title');
        const ratingAmount = rowTemplate.querySelector('.rating .amount');
        const ratingStars = rowTemplate.querySelector('.rating .stars');
        const reviews = rowTemplate.querySelector('.rating .reviews');
        const subtitle = rowTemplate.querySelector('.subtitle');
        const desc = rowTemplate.querySelector('.desc');

        const price = rowTemplate.querySelector('.amount .current-amount');
        const prevPrice = rowTemplate.querySelector('.amount .prev-amount');
        const offer = rowTemplate.querySelector('.badges .offer');
        const discount = rowTemplate.querySelector('.badges .discount');
        const details = rowTemplate.querySelector('.right-side .details');
        const taxes = rowTemplate.querySelector('.tax-msg');
        const inputId = rowTemplate.querySelector('#property-id');


        inputId.value = id;
        thumbnail.src = `${content.images[0]}`;
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
        subtitle.innerText = content.shortDescription;
        desc.innerText = content.fullOverview;

        price.innerText = CURRENCY_SIGN[pricing.currency] + pricing.totalDiscountedPrice;
        prevPrice.innerText = CURRENCY_SIGN[pricing.currency] + pricing.totalOriginalPrice;
        discount.innerText = `${calcDiscount(pricing.totalOriginalPrice, pricing.totalDiscountedPrice)}% off`
        if (pricing.tags.length) {
            offer.style.visibility = 'show';
            offer.innerText = pricing.tags[0];
        } else {
            offer.style.visibility = 'hidden';
        }

        details.innerText = pricing.bookingDuration;
        if (!pricing.includeTaxesAndFees)
            taxes.classList.add('hidden');
        else
            taxes.classList.remove('hidden');

        resultList.appendChild(rowTemplate);
        if (resultList.childElementCount < filteredData.length)
            rowTemplate = rowTemplate.cloneNode(true);
    });

    Array.from(resultList.children).forEach(element => element.classList.remove('hidden'));
}

function showEndOfList(len) {
    const divider = document.querySelector('.load-more .divider');
    const loadMoreBtn = document.querySelector('.load-more .btn');
    if (len <= SHOW_INITIAL) {
        divider.innerHTML = `<span>${len? 'End of results' : 'No results to show'}</span>`;
        divider.classList.remove('hidden');
        loadMoreBtn.classList.add('hidden')
    } else {
        loadMoreBtn.classList.remove('hidden');
        divider.classList.add('hidden');
    }
}