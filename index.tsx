/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

const categorySelect = document.getElementById('category-select') as HTMLSelectElement;
const inputFrom = document.getElementById('input-from') as HTMLInputElement;
const selectFrom = document.getElementById('select-from') as HTMLSelectElement;
const labelFrom = document.getElementById('label-from') as HTMLLabelElement;
const inputTo = document.getElementById('input-to') as HTMLInputElement;
const selectTo = document.getElementById('select-to') as HTMLSelectElement;
const labelTo = document.getElementById('label-to') as HTMLLabelElement;
const swapButton = document.getElementById('swap-button') as HTMLButtonElement;

type UnitData = {
    [key: string]: {
        name: string;
        factor: number; // Factor to convert from a base unit
    };
};

const units = {
    length: {
        meters: { name: 'Meters', factor: 1 },
        kilometers: { name: 'Kilometers', factor: 1000 },
        centimeters: { name: 'Centimeters', factor: 0.01 },
        miles: { name: 'Miles', factor: 1609.34 },
        feet: { name: 'Feet', factor: 0.3048 },
        inches: { name: 'Inches', factor: 0.0254 },
    },
    weight: {
        kilograms: { name: 'Kilograms', factor: 1 },
        grams: { name: 'Grams', factor: 0.001 },
        pounds: { name: 'Pounds', factor: 0.453592 },
        ounces: { name: 'Ounces', factor: 0.0283495 },
    },
    temperature: {
        celsius: { name: 'Celsius', factor: 1 },
        fahrenheit: { name: 'Fahrenheit', factor: 1 }, // Special handling
        kelvin: { name: 'Kelvin', factor: 1 }, // Special handling
    },
    volume: {
        liters: { name: 'Liters', factor: 1 },
        milliliters: { name: 'Milliliters', factor: 0.001 },
        gallons: { name: 'Gallons (US)', factor: 3.78541 },
        pints: { name: 'Pints (US)', factor: 0.473176 },
    },
    area: {
        square_meters: { name: 'Square Meters', factor: 1 },
        square_kilometers: { name: 'Square Kilometers', factor: 1e6 },
        hectares: { name: 'Hectares', factor: 10000 },
        square_miles: { name: 'Square Miles', factor: 2.59e+6 },
        acres: { name: 'Acres', factor: 4046.86 },
        square_feet: { name: 'Square Feet', factor: 0.092903 },
        square_inches: { name: 'Square Inches', factor: 0.00064516 },
    },
    speed: {
        mps: { name: 'Meters/sec', factor: 1 },
        kph: { name: 'Kilometers/hr', factor: 1 / 3.6 },
        mph: { name: 'Miles/hr', factor: 0.44704 },
        knots: { name: 'Knots', factor: 0.514444 },
    },
    time: {
        seconds: { name: 'Seconds', factor: 1 },
        minutes: { name: 'Minutes', factor: 60 },
        hours: { name: 'Hours', factor: 3600 },
        days: { name: 'Days', factor: 86400 },
        weeks: { name: 'Weeks', factor: 604800 },
    },
    power: {
        watts: { name: 'Watts', factor: 1 },
        kilowatts: { name: 'Kilowatts', factor: 1000 },
        horsepower: { name: 'Horsepower (HP)', factor: 745.7 },
    },
    energy: {
        joules: { name: 'Joules', factor: 1 },
        kilojoules: { name: 'Kilojoules', factor: 1000 },
        calories: { name: 'Calories', factor: 4.184 },
        kilocalories: { name: 'Kilocalories (kcal)', factor: 4184 },
        kwh: { name: 'Kilowatt-hours', factor: 3.6e+6 },
    },
    pressure: {
        pascals: { name: 'Pascals', factor: 1 },
        kilopascals: { name: 'Kilopascals', factor: 1000 },
        bars: { name: 'Bars', factor: 100000 },
        psi: { name: 'PSI', factor: 6894.76 },
        atm: { name: 'Atmospheres', factor: 101325 },
    },
    data: {
        bits: { name: 'Bits', factor: 1 },
        bytes: { name: 'Bytes', factor: 8 },
        kilobytes: { name: 'Kilobytes (KB)', factor: 8 * 1024 },
        megabytes: { name: 'Megabytes (MB)', factor: 8 * 1024 * 1024 },
        gigabytes: { name: 'Gigabytes (GB)', factor: 8 * 1024 * 1024 * 1024 },
        terabytes: { name: 'Terabytes (TB)', factor: 8 * 1024 * 1024 * 1024 * 1024 },
    }
};

function populateSelects(category: keyof typeof units) {
    const unitOptions = units[category] as UnitData;
    selectFrom.innerHTML = '';
    selectTo.innerHTML = '';

    Object.keys(unitOptions).forEach(key => {
        const option = unitOptions[key];
        selectFrom.innerHTML += `<option value="${key}">${option.name}</option>`;
        selectTo.innerHTML += `<option value="${key}">${option.name}</option>`;
    });

    selectFrom.selectedIndex = 0;
    selectTo.selectedIndex = 1;
    updateLabels();
}

function updateLabels() {
    labelFrom.textContent = selectFrom.options[selectFrom.selectedIndex].text;
    labelTo.textContent = selectTo.options[selectTo.selectedIndex].text;
}

function convert(value: number, fromUnit: string, toUnit: string, category: keyof typeof units): number {
    if (category === 'temperature') {
        return convertTemperature(value, fromUnit, toUnit);
    }

    const categoryUnits = units[category] as UnitData;
    const fromFactor = categoryUnits[fromUnit].factor;
    const toFactor = categoryUnits[toUnit].factor;

    const valueInBaseUnit = value * fromFactor;
    return valueInBaseUnit / toFactor;
}

function convertTemperature(value: number, from: string, to: string): number {
    if (from === to) return value;
    let celsius: number;

    // Convert to Celsius first
    switch (from) {
        case 'fahrenheit':
            celsius = (value - 32) * 5 / 9;
            break;
        case 'kelvin':
            celsius = value - 273.15;
            break;
        default: // 'celsius'
            celsius = value;
    }

    // Convert from Celsius to target unit
    switch (to) {
        case 'fahrenheit':
            return (celsius * 9 / 5) + 32;
        case 'kelvin':
            return celsius + 273.15;
        default: // 'celsius'
            return celsius;
    }
}

function handleConversion(source: 'from' | 'to') {
    const category = categorySelect.value as keyof typeof units;
    const [sourceInput, targetInput] = source === 'from' ? [inputFrom, inputTo] : [inputTo, inputFrom];
    const [sourceSelect, targetSelect] = source === 'from' ? [selectFrom, selectTo] : [selectTo, selectFrom];

    const value = parseFloat(sourceInput.value);
    if (isNaN(value)) {
        targetInput.value = '';
        return;
    }
    
    const fromUnit = sourceSelect.value;
    const toUnit = targetSelect.value;
    
    const result = convert(value, fromUnit, toUnit, category);
    
    // Format to a reasonable number of decimal places
    targetInput.value = Number(result.toFixed(4)).toString();
}

function swapUnits() {
    swapButton.classList.add('rotating');
    
    const fromIndex = selectFrom.selectedIndex;
    selectFrom.selectedIndex = selectTo.selectedIndex;
    selectTo.selectedIndex = fromIndex;
    
    updateLabels();
    handleConversion('from');

    swapButton.addEventListener('transitionend', () => {
        swapButton.classList.remove('rotating');
    }, { once: true });
}

function onCategoryChange() {
    const category = categorySelect.value as keyof typeof units;
    populateSelects(category);
    inputFrom.value = '1'; // Reset with a default value
    handleConversion('from');
}

// Event Listeners
categorySelect.addEventListener('change', onCategoryChange);
inputFrom.addEventListener('input', () => handleConversion('from'));
inputTo.addEventListener('input', () => handleConversion('to'));
selectFrom.addEventListener('change', () => {
    updateLabels();
    handleConversion('from');
});
selectTo.addEventListener('change', () => {
    updateLabels();
    handleConversion('from');
});
swapButton.addEventListener('click', swapUnits);

// Initial setup
function init() {
    onCategoryChange();
}

init();