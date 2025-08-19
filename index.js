/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI } from "@google/genai";

const categorySelect = document.getElementById('category-select');
const inputFrom = document.getElementById('input-from');
const selectFrom = document.getElementById('select-from');
const labelFrom = document.getElementById('label-from');
const inputTo = document.getElementById('input-to');
const selectTo = document.getElementById('select-to');
const labelTo = document.getElementById('label-to');
const swapButton = document.getElementById('swap-button');
const factoidContainer = document.getElementById('factoid-container');
const factoidContent = document.getElementById('factoid-content');

// Initialize Gemini API
let ai;
try {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (error)
    {
    console.error("Failed to initialize GoogleGenAI:", error);
    factoidContainer.style.display = 'block';
    factoidContent.textContent = 'Could not initialize the AI service. Fun facts are unavailable.';
}

let debounceTimer;

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

async function fetchAndDisplayFactoid() {
    if (!ai) return;

    const category = categorySelect.value;
    const fromUnitName = selectFrom.options[selectFrom.selectedIndex].text;
    const toUnitName = selectTo.options[selectTo.selectedIndex].text;

    if (fromUnitName === toUnitName) {
        factoidContainer.style.display = 'none';
        return;
    }

    factoidContainer.style.display = 'block';
    factoidContent.textContent = 'Generating a fun fact...';

    try {
        const prompt = `Provide a useful, interesting, and surprising factoid comparing ${fromUnitName} and ${toUnitName} for the category "${category}". Relate the comparison to everyday life, objects, or tasks in a short, engaging paragraph.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        factoidContent.textContent = response.text;
    } catch (error) {
        console.error("Factoid generation failed:", error);
        factoidContent.textContent = 'Could not generate a fact at this time. Please try again later.';
    }
}

function populateSelects(category) {
    const unitOptions = units[category];
    selectFrom.innerHTML = '';
    selectTo.innerHTML = '';

    Object.keys(unitOptions).forEach(key => {
        const option = unitOptions[key];
        selectFrom.innerHTML += `<option value="${key}">${option.name}</option>`;
        selectTo.innerHTML += `<option value="${key}">${option.name}</option>`;
    });

    selectFrom.selectedIndex = 0;
    selectTo.selectedIndex = 1;
    if (Object.keys(unitOptions).length <= 1) {
        selectTo.selectedIndex = 0;
    }
    updateLabels();
}

function updateLabels() {
    labelFrom.textContent = selectFrom.options[selectFrom.selectedIndex].text;
    labelTo.textContent = selectTo.options[selectTo.selectedIndex].text;
}

function convert(value, fromUnit, toUnit, category) {
    if (category === 'temperature') {
        return convertTemperature(value, fromUnit, toUnit);
    }

    const categoryUnits = units[category];
    const fromFactor = categoryUnits[fromUnit].factor;
    const toFactor = categoryUnits[toUnit].factor;

    const valueInBaseUnit = value * fromFactor;
    return valueInBaseUnit / toFactor;
}

function convertTemperature(value, from, to) {
    if (from === to) return value;
    let celsius;

    switch (from) {
        case 'fahrenheit':
            celsius = (value - 32) * 5 / 9;
            break;
        case 'kelvin':
            celsius = value - 273.15;
            break;
        default:
            celsius = value;
    }

    switch (to) {
        case 'fahrenheit':
            return (celsius * 9 / 5) + 32;
        case 'kelvin':
            return celsius + 273.15;
        default:
            return celsius;
    }
}

function handleConversion(source) {
    const category = categorySelect.value;
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
    
    targetInput.value = Number(result.toPrecision(15)).toString();
}

function handleInputWithDebounce(source) {
    handleConversion(source);

    clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
        if (inputFrom.value) {
            fetchAndDisplayFactoid();
        }
    }, 600);
}


function swapUnits() {
    swapButton.classList.add('rotating');
    
    const fromIndex = selectFrom.selectedIndex;
    selectFrom.selectedIndex = selectTo.selectedIndex;
    selectTo.selectedIndex = fromIndex;
    
    updateLabels();
    handleConversion('from');
    fetchAndDisplayFactoid();

    swapButton.addEventListener('transitionend', () => {
        swapButton.classList.remove('rotating');
    }, { once: true });
}

function onCategoryChange() {
    const category = categorySelect.value;
    populateSelects(category);
    handleConversion('from');
    fetchAndDisplayFactoid();
}

// Event Listeners
categorySelect.addEventListener('change', onCategoryChange);
inputFrom.addEventListener('input', () => handleInputWithDebounce('from'));
inputTo.addEventListener('input', () => handleInputWithDebounce('to'));
selectFrom.addEventListener('change', () => {
    updateLabels();
    handleConversion('from');
    fetchAndDisplayFactoid();
});
selectTo.addEventListener('change', () => {
    updateLabels();
    handleConversion('from');
    fetchAndDisplayFactoid();
});
swapButton.addEventListener('click', swapUnits);

// Initial setup
function init() {
    onCategoryChange();
}

init();