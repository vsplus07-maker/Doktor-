// Define timezones
const timezones = {
    moscow: { id: 'Europe/Moscow', name: 'Moscow' },
    newyork: { id: 'America/New_York', name: 'New York' },
    london: { id: 'Europe/London', name: 'London' },
    tokyo: { id: 'Asia/Tokyo', name: 'Tokyo' },
    sydney: { id: 'Australia/Sydney', name: 'Sydney' },
    dubai: { id: 'Asia/Dubai', name: 'Dubai' }
};

// Format time for digital display
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// Update digital clock
function updateDigitalClock(timezone, elementId) {
    const date = new Date();
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const tzDate = new Date(utc + 3600000 * getTimezoneOffset(timezone));
    const timeString = formatTime(tzDate);
    const element = document.getElementById(elementId);
    if (element) {
        element.querySelector('.time').textContent = timeString;
    }
}

// Get timezone offset (approximation)
function getTimezoneOffset(timezoneId) {
    const offsets = {
        'Europe/Moscow': 3,
        'America/New_York': -5,
        'Europe/London': 0,
        'Asia/Tokyo': 9,
        'Australia/Sydney': 11,
        'Asia/Dubai': 4
    };
    return offsets[timezoneId] || 0;
}

// Update analog clock hands
function updateAnalogClock(timezone, elementId) {
    const clockElement = document.getElementById(elementId);
    if (!clockElement) return;

    const date = new Date();
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const tzDate = new Date(utc + 3600000 * getTimezoneOffset(timezone));

    const hours = tzDate.getHours() % 12;
    const minutes = tzDate.getMinutes();
    const seconds = tzDate.getSeconds();
    const milliseconds = tzDate.getMilliseconds();

    // Calculate smooth rotation
    const secondDeg = (seconds + milliseconds / 1000) * 6; // 360 / 60
    const minuteDeg = (minutes + seconds / 60) * 6; // 360 / 60
    const hourDeg = (hours + minutes / 60) * 30; // 360 / 12

    const hands = clockElement.querySelectorAll('.hand');
    if (hands[0]) hands[0].style.transform = `rotate(${hourDeg}deg)`;
    if (hands[1]) hands[1].style.transform = `rotate(${minuteDeg}deg)`;
    if (hands[2]) hands[2].style.transform = `rotate(${secondDeg}deg)`;
}

// Update all clocks
function updateAllClocks() {
    Object.entries(timezones).forEach(([key, tz]) => {
        updateDigitalClock(tz.id, `clock-${key}`);
        updateAnalogClock(tz.id, `analog-${key}`);
    });
}

// Initialize and update every 100ms for smooth animation
window.addEventListener('DOMContentLoaded', () => {
    updateAllClocks(); // Initial update
    setInterval(updateAllClocks, 100); // Update every 100ms for smooth second hand
});

// Also update on visibility change (when tab becomes active)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateAllClocks();
    }
});
