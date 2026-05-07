const fs = require('fs');
const scheduleData = JSON.parse(fs.readFileSync('schedule.json', 'utf-8'));

function parseTime(timeStr) {
    timeStr = timeStr.toLowerCase().replace(/\s/g, '');
    let parts = timeStr.split('-');
    
    let endAmPm = parts[1].includes('am') ? 'am' : (parts[1].includes('pm') ? 'pm' : 'am');
    let startAmPm = parts[0].includes('am') ? 'am' : (parts[0].includes('pm') ? 'pm' : null);
    
    if (!startAmPm) {
        if (endAmPm === 'pm') {
            let startH = parseInt(parts[0].split(':')[0]);
            let endH = parseInt(parts[1].split(':')[0]);
            if (startH === 12) startAmPm = 'pm';
            else if (startH > endH && endH !== 12) startAmPm = 'am';
            else startAmPm = 'pm';
        } else {
            let startH = parseInt(parts[0].split(':')[0]);
            if (startH === 12) startAmPm = 'am'; // 12-2am -> 12am
            else startAmPm = 'am';
        }
    }
    
    function parsePart(p, defaultAmPm) {
        let ampm = p.includes('am') ? 'am' : (p.includes('pm') ? 'pm' : defaultAmPm);
        p = p.replace('am', '').replace('pm', '');
        let [hours, mins] = p.split(':');
        hours = parseInt(hours);
        mins = mins ? parseInt(mins) : 0;
        
        if (ampm === 'pm' && hours !== 12) hours += 12;
        if (ampm === 'am' && hours === 12) hours = 0;
        
        return hours * 2 + (mins === 30 ? 1 : 0);
    }
    
    let startSlot = parsePart(parts[0], startAmPm);
    let endSlot = parsePart(parts[1], endAmPm);
    
    if (endSlot === 0 && startSlot > 0) {
        endSlot = 48;
    }
    
    return { start: startSlot, end: endSlot };
}

let allGood = true;
for (let day in scheduleData) {
    scheduleData[day].forEach(show => {
        try {
            let res = parseTime(show.time);
            if (isNaN(res.start) || isNaN(res.end)) {
                console.log("NaN", show.time);
            }
            // console.log(`${show.time} -> ${res.start} to ${res.end}`);
        } catch (e) {
            console.log("Error", show.time, e);
            allGood = false;
        }
    });
}
if (allGood) console.log("All parsed successfully.");
