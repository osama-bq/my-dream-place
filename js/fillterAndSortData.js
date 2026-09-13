// Reset
function resetFilters() {
    renderData(properties.slice(0, SHOW_INITIAL));
    showEndOfList(properties.length);
}

function filterByPropertyName(arr) {
    const suffix = searchInput.value.trim().toLowerCase();
    return arr.filter(({name}) => {
        return name.toLowerCase().split(' ').some(word => word.startsWith(suffix))
            || name.toLowerCase().indexOf(suffix) === 0
            || name.toLowerCase().includes(' ' + suffix);
    });
}

function filterByPropertyType(arr) {
    let propertyTypes = ['', 'Hotel and apartments', 'Resort', 'Residence', 'Shared Space'];
    return arr.filter(({propertyType}) => {
        let selectedPropertyType = propertyTypes[propertyTypeBtnGroup.dataset['selected']];
        if (selectedPropertyType === '') return true;
        return selectedPropertyType.includes(propertyType);
    });
}

function filterByBudget(arr) {
    return arr.filter(({filterableAttributes}) => {
        let {budgetTier} = filterableAttributes;
        return (
            (budgetTier === 200 && p0_200.checked)
            ||  (budgetTier === 500 && p200_500.checked)
            ||  (budgetTier === 1000 && p500_1000.checked)
            ||  (budgetTier === 2000 && p1000_2000.checked)
            ||  (budgetTier === 5000 && p2000_5000.checked)
        );
    });
}

function filterByRating(arr) {
    return arr.filter(({rating}) => rating.score >= Number.parseFloat(ratingBtnGroup.dataset['selected']) + 1);
}

function filterByPopularFilters(arr) {
    return arr.filter(({filterableAttributes}) => {
        let {freeCancellation, spa, beachFront, hotTubJacuzzi, bookWithoutCreditCard, noPrepayment} = filterableAttributes.popularFilters;
        return (
            (freeCancellation && pfFreeCancellation.checked)
            ||  (spa && pfSpa.checked)
            ||  (beachFront && pfBeachFront.checked)
            ||  (hotTubJacuzzi && pfHotTubJacuzzi.checked)
            ||  (bookWithoutCreditCard && pfBookWithoutCreditCard.checked)
            ||  (noPrepayment && pfNoPrepayment.checked)
        );
    });
}

function filterByActivities(arr) {
    return arr.filter(({filterableAttributes}) => {
        let {activities} = filterableAttributes;
        return (
            (activities.includes("Fishing") && aFishing.checked)
            ||  (activities.includes("Hiking") && aHiking.checked)
            ||  (activities.includes("Beach") && aBeach.checked)
            ||  (activities.includes("Cycling") && aCycling.checked)
            ||  (activities.includes("Sauna") && aSauna.checked)
            ||  (activities.includes("Night Lights") && aNightLights.checked)
        );
    });
}

// Sort function
function sortResults(arr) {
    const calcBayesianAverage = ({rating}) => {
        const {score, reviews} = rating;
        const k = 100;
        const m = arr.reduce((acc, {rating}) => acc + rating.score, 0) / arr.length;
        return (score * reviews + k * m) / (reviews + k);
    };

    const selectedValue = sortDropdown.value;
    switch (selectedValue) {
        case 'recommended':
            return arr.sort((a, b) => calcBayesianAverage(b) - calcBayesianAverage(a));
        case 'price-low-to-high':
            return arr.sort((a, b) => a.pricing.totalDiscountedPrice - b.pricing.totalDiscountedPrice);
        case 'price-high-to-low':
            return arr.sort((a, b) => b.pricing.totalDiscountedPrice - a.pricing.totalDiscountedPrice);
        case 'rating-high-to-low':
            return arr.sort((a, b) => b.rating.score - a.rating.score);
        case 'discount-high-to-low':
            return arr.sort((a, b) => {
                let aDiscount = calcDiscount(a.pricing.totalOriginalPrice, a.pricing.totalDiscountedPrice);
                let bDiscount = calcDiscount(b.pricing.totalOriginalPrice, b.pricing.totalDiscountedPrice);
                return bDiscount - aDiscount;
            });
        default:
            return arr;
    }
}


// Main filter function
var cached = null;
var lastFilter = null;
const filterFuncs = [filterByPropertyName, filterByBudget, filterByRating, filterByPopularFilters, filterByActivities, filterByPropertyType];

function filterAndSort(func) {
    if (func === sortResults) {
        if (!cached) cached = [...properties];
        sortResults(filtered);
        renderData(filtered.slice(0, SHOW_INITIAL));
        showEndOfList(filtered.length);
        return;
    }

    console.log(`Filtering CALLED by ${func.name}...`);
    if (lastFilter !== func) {
        cached = [...properties];
        console.log(cached);
        filterFuncs.forEach(f => {
            if (f === func) return;
            cached = f(cached);
            console.log(`Filtering by ${f.name}...`);
            console.log(cached);
        });
        lastFilter = func;
    }

    filtered = func(cached);
    console.log(`Filtering by ${func.name}...`);
    console.log(filtered);

    sortResults(filtered);
    
    renderData(filtered.slice(0, SHOW_INITIAL));
    showEndOfList(filtered.length);
}


// Filter by property name
const searchInput = document.querySelector('.filter-search input');
searchInput.addEventListener('input', () => {
    filterAndSort(filterByPropertyName);
});

// Property type filtering
const propertyTypeBtnGroup = document.querySelector('.sort-and-filter-bar .btn-group');
propertyTypeBtnGroup.dataset['selected'] = 0;
Array.from(propertyTypeBtnGroup.children).forEach((btn, idx) => btn.addEventListener('click', () => {
    if ('selected' in propertyTypeBtnGroup.dataset)
        propertyTypeBtnGroup.children[propertyTypeBtnGroup.dataset['selected']].classList.remove('selected');
    propertyTypeBtnGroup.dataset['selected'] = idx;
    btn.classList.add('selected');

    filterAndSort(filterByPropertyType);
}));

// Budget-based filtering
const p0_200 = document.getElementById('price-0-200');
const p200_500 = document.getElementById('price-200-500');
const p500_1000 = document.getElementById('price-500-1000');
const p1000_2000 = document.getElementById('price-1000-2000');
const p2000_5000 = document.getElementById('price-2000-5000');



p0_200.addEventListener('change', () => filterAndSort(filterByBudget));
p200_500.addEventListener('change', () => filterAndSort(filterByBudget));
p500_1000.addEventListener('change', () => filterAndSort(filterByBudget));
p1000_2000.addEventListener('change', () => filterAndSort(filterByBudget));
p2000_5000.addEventListener('change', () => filterAndSort(filterByBudget));

// Rating-based filtering
const ratingBtnGroup = document.querySelector('.filter-rating .btn-group');
ratingBtnGroup.dataset['selected'] = -1;
Array.from(ratingBtnGroup.children).forEach((btn, idx) => btn.addEventListener('click', () => {
    if (ratingBtnGroup.dataset['selected'] !== '-1')
        ratingBtnGroup.children[ratingBtnGroup.dataset['selected']].classList.remove('selected');
    ratingBtnGroup.dataset['selected'] = idx;
    btn.classList.add('selected');

    filterAndSort(filterByRating);
}));

// Popular Filters
const pfFreeCancellation = document.getElementById('free-cancellation');
const pfSpa = document.getElementById('spa');
const pfBeachFront = document.getElementById('beach-front');
const pfHotTubJacuzzi = document.getElementById('hot-tub-jacuzzi');
const pfBookWithoutCreditCard = document.getElementById('book-without-credit-card');
const pfNoPrepayment = document.getElementById('no-prepayment');

pfFreeCancellation.addEventListener('change', () => filterAndSort(filterByPopularFilters));
pfSpa.addEventListener('change', () => filterAndSort(filterByPopularFilters));
pfBeachFront.addEventListener('change', () => filterAndSort(filterByPopularFilters));
pfHotTubJacuzzi.addEventListener('change', () => filterAndSort(filterByPopularFilters));
pfBookWithoutCreditCard.addEventListener('change', () => filterAndSort(filterByPopularFilters));
pfNoPrepayment.addEventListener('change', () => filterAndSort(filterByPopularFilters));


// Activites-based filtering
const aFishing = document.getElementById('fishing');
const aHiking = document.getElementById('hiking');
const aBeach = document.getElementById('beach');
const aCycling = document.getElementById('cycling');
const aSauna = document.getElementById('sauna');
const aNightLights = document.getElementById('night-lights');

aFishing.addEventListener('change', () => filterAndSort(filterByActivities));
aHiking.addEventListener('change', () => filterAndSort(filterByActivities));
aBeach.addEventListener('change', () => filterAndSort(filterByActivities));
aCycling.addEventListener('change', () => filterAndSort(filterByActivities));
aSauna.addEventListener('change', () => filterAndSort(filterByActivities));
aNightLights.addEventListener('change', () => filterAndSort(filterByActivities));

// Dropdown sorting
const sortDropdown = document.getElementById('sort-by');

sortDropdown.addEventListener('change', () => {
    const selectedValue = sortDropdown.value;
    filterAndSort(sortResults);
});