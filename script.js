// Initial tasks
const tasks = [
    { name: 'Concept Development', timePerReel: 15, enabled: true },
    { name: 'Script Writing', timePerReel: 20, enabled: true },
    { name: 'Recording Video', timePerReel: 30, enabled: true },
    { name: 'Editing', timePerReel: 25, enabled: true },
    { name: 'Adding Title/Hooks', timePerReel: 10, enabled: true },
    { name: 'Publishing & Distribution', timePerReel: 10, enabled: true }
];

// DOM elements
const hourlyRateInput = document.getElementById('hourlyRate');
const reelsPerWeekInput = document.getElementById('reelsPerWeek');
const reelPriceInput = document.getElementById('reelPrice');
const tasksListDiv = document.getElementById('tasksList');

// Result elements
const minutesPerReelElement = document.getElementById('minutesPerReel');
const hoursPerWeekElement = document.getElementById('hoursPerWeek');
const hoursPerMonthElement = document.getElementById('hoursPerMonth');
const moneyPerWeekElement = document.getElementById('moneyPerWeek');
const moneyPerMonthElement = document.getElementById('moneyPerMonth');
const moneyPerYearElement = document.getElementById('moneyPerYear');
const diyCostElement = document.getElementById('diyCost');
const beastModeCostElement = document.getElementById('beastModeCost');
const annualSavingsElement = document.getElementById('annualSavings');

// Render tasks
function renderTasks() {
    tasksListDiv.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <input
                type="checkbox"
                id="task-${index}"
                ${task.enabled ? 'checked' : ''}
            />
            <label for="task-${index}">${task.name}</label>
            <input
                type="number"
                id="task-time-${index}"
                value="${task.timePerReel}"
                ${!task.enabled ? 'disabled' : ''}
            />
        `;
        tasksListDiv.appendChild(taskElement);

        // Add event listeners
        document.getElementById(`task-${index}`).addEventListener('change', (e) => {
            tasks[index].enabled = e.target.checked;
            document.getElementById(`task-time-${index}`).disabled = !e.target.checked;
            calculateResults();
        });

        document.getElementById(`task-time-${index}`).addEventListener('change', (e) => {
            tasks[index].timePerReel = parseInt(e.target.value) || 0;
            calculateResults();
        });
    });
}

// Calculate results
function calculateResults() {
    const hourlyRate = parseFloat(hourlyRateInput.value) || 0;
    const reelsPerWeek = parseFloat(reelsPerWeekInput.value) || 0;
    const yourReelPrice = parseFloat(reelPriceInput.value) || 0;

    // Time calculations
    const enabledTasks = tasks.filter(task => task.enabled);
    const minutes = enabledTasks.reduce((sum, task) => sum + task.timePerReel, 0);
    const hoursPerWeek = (minutes * reelsPerWeek) / 60;
    const hoursPerMonth = hoursPerWeek * 4.33; // Average weeks per month
    
    // Money calculations
    const lostPerWeek = hoursPerWeek * hourlyRate;
    const lostPerMonth = hoursPerMonth * hourlyRate;
    const lostPerYear = lostPerMonth * 12;
    
    // Savings
    const yourCostPerYear = yourReelPrice * reelsPerWeek * 52;
    const savings = lostPerYear - yourCostPerYear;

    // Update UI
    minutesPerReelElement.textContent = minutes;
    hoursPerWeekElement.textContent = hoursPerWeek.toFixed(1);
    hoursPerMonthElement.textContent = hoursPerMonth.toFixed(1);
    moneyPerWeekElement.textContent = '$' + lostPerWeek.toFixed(0);
    moneyPerMonthElement.textContent = '$' + lostPerMonth.toFixed(0);
    moneyPerYearElement.textContent = '$' + lostPerYear.toFixed(0);
    diyCostElement.textContent = '$' + lostPerYear.toFixed(0);
    beastModeCostElement.textContent = '$' + yourCostPerYear.toFixed(0);
    annualSavingsElement.textContent = '$' + savings.toFixed(0);
}

// Add event listeners to inputs
hourlyRateInput.addEventListener('change', calculateResults);
reelsPerWeekInput.addEventListener('change', calculateResults);
reelPriceInput.addEventListener('change', calculateResults);

// Initialize
renderTasks();
calculateResults();

// Make sure calculator works in iframe context
window.addEventListener('DOMContentLoaded', () => {
    // Send message to parent window to adjust iframe height if needed
    if (window.parent !== window) {
        const height = document.body.scrollHeight;
        window.parent.postMessage({ type: 'resize', height: height }, '*');
    }
});