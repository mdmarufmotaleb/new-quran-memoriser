const from_surah = document.getElementById('from-surah');
const from_verse = document.getElementById('from-verse');
const to_surah = document.getElementById('to-surah');
const to_verse = document.getElementById('to-verse');
const verse_span = document.querySelector('.verse-box span');
const generate_button = document.querySelector('.generate-button');
const eye_button = document.querySelector('.eye-icon');
const current_verse_information = document.getElementById('verse-text');

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
    const words = text.split(' ');
    if (words.length <= 3) {
        return words.join(' ').replace(/۞/g, ''); 
    }
    return ("... " + words.slice(0, 3).join(' ')).replace(/۞/g, '');
}

function get_last_three_words(text) {
    const words = text.split(' ');
    if (words.length <= 3) {
        return words.join(' ').replace(/۞/g, '');
    }
    return (words.slice(-3).join(' ') + " ...").replace(/۞/g, '');
}

function get_middle_three_words(text) {
    const words = text.split(' ');
    const total = words.length;

    if (total <= 3) {
        return words.join(' ').replace(/۞/g, '');
    }

    const mid = Math.floor(total / 2);
    const start = Math.max(0, mid - 1);
    return ("... " + words.slice(start, start + 3).join(' ') + " ...").replace(/۞/g, '');
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
    to_verse.value = 6;
});

generate_button.addEventListener('click', () => {
    const surah_min = from_surah.value;
    const verse_min = from_verse.value;
    const surah_max = to_surah.value;
    const verse_max = to_verse.value;

    current_verse_key = get_random_verse_key(`${surah_min}:${verse_min}`, `${surah_max}:${verse_max}`);
    generate_text(current_verse_key);
    update_verse_information();
});

function generate_text(verse_key) {
    const endpoint = `https://api.quran.com/api/v4/verses/by_key/${verse_key}?fields=text_uthmani`;

    fetch(endpoint)
        .then(res => res.json())
        .then(data => {
            const verse_text = extract_verse_text(data);
            current_full_verse = verse_text;
            showing_full_verse = false;
            verse_span.textContent = get_display_text(verse_text);
        });
}

function get_display_text(text) {
    const position = document.getElementById('display-position').value;

    if (position === 'first') {
        return get_first_three_words(text);
    } else if (position === 'middle') {
        return get_middle_three_words(text);
    } else if (position === 'last') {
        return get_last_three_words(text);
    }
}


eye_button.addEventListener('click', () => {
    if (!current_full_verse) return;
    showing_full_verse = !showing_full_verse;
    verse_span.textContent = showing_full_verse ? current_full_verse : get_display_text(current_full_verse);
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
    update_verse_information();
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
    update_verse_information();
});

function update_verse_information(){
    [current_surah, current_verse] = current_verse_key.split(":").map(Number);
    current_verse_information.innerText = "Surah: " + getSurahTransliteration(current_surah) + " (" + current_surah + ")" + ", Verse: " + current_verse;
}

const surah_transliterations = {
    1: "Al-Fatiha",
    2: "Al-Baqarah",
    3: "Ali-Imran",
    4: "An-Nisa",
    5: "Al-Ma'idah",
    6: "Al-An'am",
    7: "Al-A'raf",
    8: "Al-Anfal",
    9: "At-Tawbah",
    10: "Yunus",
    11: "Hud",
    12: "Yusuf",
    13: "Ar-Ra'd",
    14: "Ibrahim",
    15: "Al-Hijr",
    16: "An-Nahl",
    17: "Al-Isra",
    18: "Al-Kahf",
    19: "Maryam",
    20: "Ta-Ha",
    21: "Al-Anbiya",
    22: "Al-Hajj",
    23: "Al-Mu'minun",
    24: "An-Nur",
    25: "Al-Furqan",
    26: "Ash-Shu'ara",
    27: "An-Naml",
    28: "Al-Qasas",
    29: "Al-Ankabut",
    30: "Ar-Rum",
    31: "Luqman",
    32: "As-Sajda",
    33: "Al-Ahzab",
    34: "Saba",
    35: "Fatir",
    36: "Ya-Sin",
    37: "As-Saffat",
    38: "Sad",
    39: "Az-Zumar",
    40: "Ghafir",
    41: "Fussilat",
    42: "Ash-Shura",
    43: "Az-Zukhruf",
    44: "Ad-Dukhan",
    45: "Al-Jathiyah",
    46: "Al-Ahqaf",
    47: "Muhammad",
    48: "Al-Fath",
    49: "Al-Hujurat",
    50: "Qaf",
    51: "Adh-Dhariyat",
    52: "At-Tur",
    53: "An-Najm",
    54: "Al-Qamar",
    55: "Ar-Rahman",
    56: "Al-Waqi'ah",
    57: "Al-Hadid",
    58: "Al-Mujadila",
    59: "Al-Hashr",
    60: "Al-Mumtahina",
    61: "As-Saff",
    62: "Al-Jumu'ah",
    63: "Al-Munafiqun",
    64: "At-Taghabun",
    65: "At-Talaq",
    66: "At-Tahrim",
    67: "Al-Mulk",
    68: "Al-Qalam",
    69: "Al-Haqqah",
    70: "Al-Ma'arij",
    71: "Nuh",
    72: "Al-Jinn",
    73: "Al-Muzzammil",
    74: "Al-Muddathir",
    75: "Al-Qiyamah",
    76: "Al-Insan",
    77: "Al-Mursalat",
    78: "An-Naba",
    79: "An-Nazi'at",
    80: "Abasa",
    81: "At-Takwir",
    82: "Al-Infitar",
    83: "Al-Mutaffifin",
    84: "Al-Inshiqaq",
    85: "Al-Buruj",
    86: "At-Tariq",
    87: "Al-A'la",
    88: "Al-Ghashiyah",
    89: "Al-Fajr",
    90: "Al-Balad",
    91: "Ash-Shams",
    92: "Al-Layl",
    93: "Ad-Duhaa",
    94: "Ash-Sharh",
    95: "At-Tin",
    96: "Al-Alaq",
    97: "Al-Qadr",
    98: "Al-Bayyinah",
    99: "Az-Zalzalah",
    100: "Al-Adiyat",
    101: "Al-Qari'ah",
    102: "At-Takathur",
    103: "Al-Asr",
    104: "Al-Humazah",
    105: "Al-Fil",
    106: "Quraysh",
    107: "Al-Ma'un",
    108: "Al-Kawthar",
    109: "Al-Kafirun",
    110: "An-Nasr",
    111: "Al-Masad",
    112: "Al-Ikhlas",
    113: "Al-Falaq",
    114: "An-Nas"
  };
  
  function getSurahTransliteration(number) {
    return surah_transliterations[number];
  }
  
const reset_button = document.getElementById('reset-button');

reset_button.addEventListener('click', () => {
    // Reset dropdowns
    from_surah.value = 1;
    to_surah.value = 114;
    populate_verse_options(1, from_verse, 1);
    populate_verse_options(114, to_verse, 6);
    from_verse.value = 1;
    to_verse.value = 6;
    document.getElementById('display-position').value = 'first';

    // Reset verse box text and label
    verse_span.textContent = 'أعوذ بالله من الشيطان الرجيم';
    current_verse_information.textContent = 'Click Generate';

    // Reset verse state
    current_verse_key = null;
    current_full_verse = '';
    showing_full_verse = false;
});
