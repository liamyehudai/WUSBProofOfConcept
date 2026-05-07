const fs = require('fs');

const html = fs.readFileSync('schedule.html', 'utf-8');

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const scheduleData = {
    Sunday: [], Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: []
};

// Split table into columns
const tbodyMatch = html.match(/<tbody>([\s\S]*?)<\/tbody>/);
if (tbodyMatch) {
    const tbody = tbodyMatch[1];
    // This splits by </td><td> roughly, but let's be more precise
    const tds = tbody.split(/<td[^>]*>/);
    
    // tds[0] is everything before first <td...>, tds[1] is hours column, tds[2..8] are days
    for (let i = 2; i <= 8; i++) {
        const dayIndex = i - 2;
        const dayName = days[dayIndex];
        const tdHtml = tds[i];
        
        // Find all boxes
        const regexBox = /<div class="station-sch-box[^>]*>([\s\S]*?)<\/div>(?=\s*<div class="station-sch-box|\s*<\/td>)/g;
        // Wait, nested divs make regex hard.
        // Let's just find all items directly
        
        const itemRegex = /<span class="station-sch-time">([^<]*)<\/span><span class="station-sch-title">([^<]*)<\/span><\/a>(\s*<div class="weektable-alt">)?/g;
        
        let match;
        while ((match = itemRegex.exec(tdHtml)) !== null) {
            scheduleData[dayName].push({
                time: match[1].trim(),
                title: match[2].trim(),
                is_alt: match[3] ? true : false
            });
        }
    }
}

fs.writeFileSync('schedule.json', JSON.stringify(scheduleData, null, 2));
console.log("Parsed schedule.html and created schedule.json");
