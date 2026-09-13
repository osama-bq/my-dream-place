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


// Main filter function
var cached = null;
var lastFilter = null;
const filterFuncs = [filterByPropertyName, filterByBudget, filterByRating, filterByPopularFilters, filterByActivities, filterByPropertyType];

function filter(func) {
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

    let filtered = func(cached);
    console.log(`Filtering by ${func.name}...`);
    console.log(filtered);
    
    renderData(filtered.slice(0, SHOW_INITIAL));
    showEndOfList(filtered.length);
}


// Filter by property name
const searchInput = document.querySelector('.filter-search input');
searchInput.addEventListener('input', () => {
    filter(filterByPropertyName);
});

// Property type filtering
const propertyTypeBtnGroup = document.querySelector('.sort-and-filter-bar .btn-group');
propertyTypeBtnGroup.dataset['selected'] = 0;
Array.from(propertyTypeBtnGroup.children).forEach((btn, idx) => btn.addEventListener('click', () => {
    if ('selected' in propertyTypeBtnGroup.dataset)
        propertyTypeBtnGroup.children[propertyTypeBtnGroup.dataset['selected']].classList.remove('selected');
    propertyTypeBtnGroup.dataset['selected'] = idx;
    btn.classList.add('selected');

    filter(filterByPropertyType);
}));

// Budget-based filtering
const p0_200 = document.getElementById('price-0-200');
const p200_500 = document.getElementById('price-200-500');
const p500_1000 = document.getElementById('price-500-1000');
const p1000_2000 = document.getElementById('price-1000-2000');
const p2000_5000 = document.getElementById('price-2000-5000');


p0_200.addEventListener('change', () => filter(filterByBudget));
p200_500.addEventListener('change', () => filter(filterByBudget));
p500_1000.addEventListener('change', () => filter(filterByBudget));
p1000_2000.addEventListener('change', () => filter(filterByBudget));
p2000_5000.addEventListener('change', () => filter(filterByBudget));

// Rating-based filtering
const ratingBtnGroup = document.querySelector('.filter-rating .btn-group');
ratingBtnGroup.dataset['selected'] = -1;
Array.from(ratingBtnGroup.children).forEach((btn, idx) => btn.addEventListener('click', () => {
    if (ratingBtnGroup.dataset['selected'] !== '-1')
        ratingBtnGroup.children[ratingBtnGroup.dataset['selected']].classList.remove('selected');
    ratingBtnGroup.dataset['selected'] = idx;
    btn.classList.add('selected');

    filter(filterByRating);
}));

// Popular Filters
const pfFreeCancellation = document.getElementById('free-cancellation');
const pfSpa = document.getElementById('spa');
const pfBeachFront = document.getElementById('beach-front');
const pfHotTubJacuzzi = document.getElementById('hot-tub-jacuzzi');
const pfBookWithoutCreditCard = document.getElementById('book-without-credit-card');
const pfNoPrepayment = document.getElementById('no-prepayment');

pfFreeCancellation.addEventListener('change', () => filter(filterByPopularFilters));
pfSpa.addEventListener('change', () => filter(filterByPopularFilters));
pfBeachFront.addEventListener('change', () => filter(filterByPopularFilters));
pfHotTubJacuzzi.addEventListener('change', () => filter(filterByPopularFilters));
pfBookWithoutCreditCard.addEventListener('change', () => filter(filterByPopularFilters));
pfNoPrepayment.addEventListener('change', () => filter(filterByPopularFilters));


// Activites-based filtering
const aFishing = document.getElementById('fishing');
const aHiking = document.getElementById('hiking');
const aBeach = document.getElementById('beach');
const aCycling = document.getElementById('cycling');
const aSauna = document.getElementById('sauna');
const aNightLights = document.getElementById('night-lights');

aFishing.addEventListener('change', () => filter(filterByActivities));
aHiking.addEventListener('change', () => filter(filterByActivities));
aBeach.addEventListener('change', () => filter(filterByActivities));
aCycling.addEventListener('change', () => filter(filterByActivities));
aSauna.addEventListener('change', () => filter(filterByActivities));
aNightLights.addEventListener('change', () => filter(filterByActivities));