const from_surah = document.getElementById('from-surah');
const from_verse = document.getElementById('from-verse');
const to_surah = document.getElementById('to-surah');
const to_verse = document.getElementById('to-verse');
const verse_span = document.querySelector('.verse-box span');
const generate_button = document.querySelector('.generate-button');
const eye_button = document.querySelector('.eye-icon');

let current_verse_key;

let current_full_verse = '';
let showing_full_verse = false;

let current_surah, current_verse;

const verse_counts = {
    1: 7, 2: 286, 3: 200, 4: 176, 5: 120, 6: 165, 7: 206, 8: 75, 9: 129,
    10: 109, 11: 123, 12: 111, 13: 43, 14: 52, 15: 99, 16: 128, 17: 111,
    18: 110, 19: 98, 20: 135, 21: 112, 22: 78, 23: 118, 24: 64, 25: 77,
    26: 227, 27: 93, 28: 88, 29: 69, 30: 60, 31: 34, 32: 30, 33: 73,
    34: 54, 35: 45, 36: 83, 37: 182, 38: 88, 39: 75, 40: 85, 41: 54,
    42: 53, 43: 89, 44: 59, 45: 37, 46: 35, 47: 38, 48: 29, 49: 18,
    50: 45, 51: 60, 52: 49, 53: 62, 54: 55, 55: 78, 56: 96, 57: 29,
    58: 22, 59: 24, 60: 13, 61: 14, 62: 11, 63: 11, 64: 18, 65: 12,
    66: 12, 67: 30, 68: 52, 69: 52, 70: 44, 71: 28, 72: 28, 73: 20,
    74: 56, 75: 40, 76: 31, 77: 50, 78: 40, 79: 46, 80: 42, 81: 29,
    82: 19, 83: 36, 84: 25, 85: 22, 86: 17, 87: 19, 88: 26, 89: 30,
    90: 20, 91: 15, 92: 21, 93: 11, 94: 8, 95: 8, 96: 19, 97: 5,
    98: 8, 99: 8, 100: 11, 101: 11, 102: 8, 103: 3, 104: 9, 105: 5,
    106: 4, 107: 7, 108: 3, 109: 6, 110: 3, 111: 5, 112: 4, 113: 5, 114: 6
};

function get_random_verse_key(min_key, max_key) {
    const [min_surah, min_verse] = min_key.split(':').map(Number);
    const [max_surah, max_verse] = max_key.split(':').map(Number);

    const valid_keys = [];

    for (let surah = min_surah; surah <= max_surah; surah++) {
        const verse_start = (surah === min_surah) ? min_verse : 1;
        const verse_end = (surah === max_surah) ? max_verse : verse_counts[surah];

        for (let verse = verse_start; verse <= verse_end; verse++) {
            valid_keys.push(`${surah}:${verse}`);
        }
    }

    const random_index = Math.floor(Math.random() * valid_keys.length);
    return valid_keys[random_index];
}

function populate_verse_options(surah_number, target_select, default_value = 1) {
    const total_verses = verse_counts[surah_number];
    target_select.innerHTML = '';
    for (let i = 1; i <= total_verses; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Verse ${i}`;
        if (i === default_value) {
            option.selected = true;
        }
        target_select.appendChild(option);
    }
}

function extract_verse_text(data) {
    return data.verse.text_uthmani.replace(/۞/g, '');
}

function get_first_three_words(text) {
    return ("... " + text.split(' ').slice(0, 3).join(' ')).replace(/۞/g, '');
}

from_surah.addEventListener('change', () => {
    const selected = parseInt(from_surah.value);
    populate_verse_options(selected, from_verse);
    
    if (selected > parseInt(to_surah.value)) {
        to_surah.value = selected;
        populate_verse_options(parseInt(to_surah.value), to_verse, verse_counts[selected]);
    }
});

to_surah.addEventListener('change', () => {
    const selected = parseInt(to_surah.value);
    const last_verse = verse_counts[selected];
    populate_verse_options(selected, to_verse, last_verse);
    
    if (selected < parseInt(from_surah.value)) {
        from_surah.value = selected;
        populate_verse_options(parseInt(from_surah.value), from_verse, 1);
    }
});

from_verse.addEventListener('change', () => {
    const selected_from_verse = parseInt(from_verse.value);
    const selected_to_verse = parseInt(to_verse.value);
    
    if (selected_from_verse > selected_to_verse) {
        to_verse.value = selected_from_verse;
    }
});

to_verse.addEventListener('change', () => {
    const selected_from_verse = parseInt(from_verse.value);
    const selected_to_verse = parseInt(to_verse.value);
    
    if (selected_to_verse < selected_from_verse) {
        from_verse.value = selected_to_verse;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    populate_verse_options(parseInt(from_surah.value), from_verse, 1);
    populate_verse_options(parseInt(to_surah.value), to_verse, verse_counts[114]);

    from_surah.value = 1;
    to_surah.value = 114;
    from_verse.value = 1;
    to_verse.value = 7;
});

generate_button.addEventListener('click', () => {
    const surah_min = from_surah.value;
    const verse_min = from_verse.value;
    const surah_max = to_surah.value;
    const verse_max = to_verse.value;

    current_verse_key = get_random_verse_key(`${surah_min}:${verse_min}`, `${surah_max}:${verse_max}`);
    generate_text(current_verse_key);
});

function generate_text(verse_key) {
    const endpoint = `https://api.quran.com/api/v4/verses/by_key/${verse_key}?fields=text_uthmani`;

    fetch(endpoint)
        .then(res => res.json())
        .then(data => {
            const verse_text = extract_verse_text(data);
            current_full_verse = verse_text;
            showing_full_verse = false;
            verse_span.textContent = get_first_three_words(verse_text);
        });
}

eye_button.addEventListener('click', () => {
    if (!current_full_verse) return;
    showing_full_verse = !showing_full_verse;
    verse_span.textContent = showing_full_verse ? current_full_verse : get_first_three_words(current_full_verse);
});

const up_arrow = document.querySelector('[data-lucide="chevron-up"]');
const down_arrow = document.querySelector('[data-lucide="chevron-down"]');

up_arrow.addEventListener('click', () => {

    [current_surah, current_verse] = current_verse_key.split(":").map(Number);

    if (current_verse > 1) {
        current_verse = current_verse - 1;
    } else if (current_surah > 1) {
        current_surah = current_surah - 1;
        current_verse = verse_counts[current_surah - 1];
    }

    current_verse_key = `${current_surah}:${current_verse}`;
    generate_text(`${current_surah}:${current_verse}`);
});

down_arrow.addEventListener('click', () => {

    [current_surah, current_verse] = current_verse_key.split(":").map(Number);

    const total_verses_current_surah = verse_counts[current_surah];

    if (current_verse < total_verses_current_surah) {
        current_verse = current_verse + 1;
    } else if (current_surah < 114) {
        current_surah = current_surah + 1;
        current_verse = 1;
    }
    current_verse_key = `${current_surah}:${current_verse}`;
    generate_text(`${current_surah}:${current_verse}`);
});
