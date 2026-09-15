// Reset
function resetFilters() {
    renderData(properties.slice(0, SHOW_INITIAL));
    showEndOfList(properties.length);
}

function filterByPropertyName(arr, reset) {
    if (reset) return arr;
    const suffix = searchInput.value.trim().toLowerCase();
    return arr.filter(({name}) => {
        return name.toLowerCase().split(' ').some(word => word.startsWith(suffix))
        || name.toLowerCase().indexOf(suffix) === 0
        || name.toLowerCase().includes(' ' + suffix);
    });
}

function filterByPropertyType(arr, reset) {
    if (reset) return arr;
    let propertyTypes = ['', 'Hotel and apartments', 'Resort', 'Residence', 'Shared Space'];
    return arr.filter(({propertyType}) => {
        let selectedPropertyType = propertyTypes[propertyTypeBtnGroup.dataset['selected']];
        if (selectedPropertyType === '') return true;
        return selectedPropertyType.includes(propertyType);
    });
}

function filterByBudget(arr, reset) {
    if (reset) return arr;
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

function filterByRating(arr, reset) {
    if (reset) return arr;
    return arr.filter(({rating}) => rating.score >= Number.parseFloat(ratingBtnGroup.dataset['selected']) + 1);
}

function filterByPopularFilters(arr, reset) {
    if (reset) return arr;
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

function filterByActivities(arr, reset) {
    if (reset) return arr;
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
const filterFuncs = {
    filterByPropertyName: {
        func: filterByPropertyName,
        active: false,
    },
    filterByBudget: {
        func: filterByBudget,
        active: false,
        filterHeader: document.querySelector('.filter-budget .filter-card-header')
    },
    filterByRating: {
        func: filterByRating,
        active: false,
        filterHeader: document.querySelector('.filter-rating .filter-card-header')
    },
    filterByPopularFilters: {
        func: filterByPopularFilters,
        active: false,
        filterHeader: document.querySelector('.filter-popular .filter-card-header')
    },
    filterByActivities: {
        func: filterByActivities,
        active: false,
        filterHeader: document.querySelector('.filter-activities .filter-card-header')
    },
    filterByPropertyType: {
        func: filterByPropertyType,
        active: false
    }
};

function makeActive(funcName) {
    if (funcName === 'sortResults') return;
    if (filterFuncs[funcName].active) return;
    if (!filterFuncs[funcName].filterHeader) return;
    let clearButton = document.createElement('span');
    clearButton.style.cursor = 'pointer';
    clearButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
    </svg>`;
    clearButton.addEventListener('click', () => {
        filterFuncs[funcName].active = false;
        
        const checkboxes = filterFuncs[funcName].filterHeader.parentElement.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        const btnGroup = filterFuncs[funcName].filterHeader.parentElement.querySelector('.btn-group');
        if (btnGroup) {
            btnGroup.children[btnGroup.dataset['selected']].classList.remove('selected');
            btnGroup.dataset['selected'] = -1;
        }
        filterAndSort(filterFuncs[funcName].func, true);

        clearButton.remove();
    });
    filterFuncs[funcName].filterHeader.appendChild(clearButton);
    filterFuncs[funcName].active = true;
}

function filterAndSort(func, reset=false) {
    if (func === sortResults) {
        if (!cached) cached = [...properties];
        sortResults(filtered);
        renderData(filtered.slice(0, SHOW_INITIAL));
        showEndOfList(filtered.length);
        return;
    }

    console.log(`Filtering CALLED by ${func.name}...`);
    if (!reset) makeActive(func.name);
    if (lastFilter !== func) {
        cached = [...properties];
        console.log(cached);
        Object.values(filterFuncs).forEach(({func: f, active}) => {
            if (f === func || !active) return;
            cached = f(cached);
            console.log(`Filtering by ${f.name}...`);
            console.log(cached);
        });
        lastFilter = func;
    }

    filtered = func(cached, reset);
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

function budgetFilterListener() {
    if (p0_200.checked || p200_500.checked || p500_1000.checked || p1000_2000.checked || p2000_5000.checked) {
        filterAndSort(filterByBudget);
    } else {
        filterAndSort(filterByBudget, true);
    }
}

p0_200.addEventListener('change', budgetFilterListener);
p200_500.addEventListener('change', budgetFilterListener);
p500_1000.addEventListener('change', budgetFilterListener);
p1000_2000.addEventListener('change', budgetFilterListener);
p2000_5000.addEventListener('change', budgetFilterListener);

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

function popularFiltersListener() {
    if (pfFreeCancellation.checked || pfSpa.checked || pfBeachFront.checked || pfHotTubJacuzzi.checked || pfBookWithoutCreditCard.checked || pfNoPrepayment.checked) {
        filterAndSort(filterByPopularFilters);
    } else {
        filterAndSort(filterByPopularFilters, true);
    }
}

pfFreeCancellation.addEventListener('change', popularFiltersListener);
pfSpa.addEventListener('change', popularFiltersListener);
pfBeachFront.addEventListener('change', popularFiltersListener);
pfHotTubJacuzzi.addEventListener('change', popularFiltersListener);
pfBookWithoutCreditCard.addEventListener('change', popularFiltersListener);
pfNoPrepayment.addEventListener('change', popularFiltersListener);


// Activites-based filtering
const aFishing = document.getElementById('fishing');
const aHiking = document.getElementById('hiking');
const aBeach = document.getElementById('beach');
const aCycling = document.getElementById('cycling');
const aSauna = document.getElementById('sauna');
const aNightLights = document.getElementById('night-lights');

function activitiesFilterListener() {
    if (aFishing.checked || aHiking.checked || aBeach.checked || aCycling.checked || aSauna.checked || aNightLights.checked) {
        filterAndSort(filterByActivities);
    } else {
        filterAndSort(filterByActivities, true);
    }
}

aFishing.addEventListener('change', activitiesFilterListener);
aHiking.addEventListener('change', activitiesFilterListener);
aBeach.addEventListener('change', activitiesFilterListener);
aCycling.addEventListener('change', activitiesFilterListener);
aSauna.addEventListener('change', activitiesFilterListener);
aNightLights.addEventListener('change', activitiesFilterListener);

// Dropdown sorting
const sortDropdown = document.getElementById('sort-by');

sortDropdown.addEventListener('change', () => {
    const selectedValue = sortDropdown.value;
    filterAndSort(sortResults);
});