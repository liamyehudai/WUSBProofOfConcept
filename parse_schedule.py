import json
from bs4 import BeautifulSoup
import re

with open('schedule.html', 'r') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')
table = soup.find('table', id='station-sch')

days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

schedule_data = {day: [] for day in days}

if table:
    tbody = table.find('tbody')
    tr = tbody.find('tr')
    tds = tr.find_all('td', recursive=False)
    
    # First TD is hours (skip), then 7 TDs for days
    for i, td in enumerate(tds[1:]): # skip the first
        day = days[i]
        
        boxes = td.find_all('div', class_=re.compile(r'station-sch-scheduled|station-sch-unscheduled'))
        for box in boxes:
            items_div = box.find('div', class_='schedule-items')
            if not items_div:
                # Check if there is an a tag directly in box
                a_tag = box.find('a')
                if a_tag and a_tag.find('span', class_='station-sch-time'):
                    time = a_tag.find('span', class_='station-sch-time').text.strip()
                    title_span = a_tag.find('span', class_='station-sch-title')
                    title = title_span.text.strip() if title_span else ""
                    link = a_tag.get('href', '')
                    schedule_data[day].append({
                        "time": time,
                        "title": title,
                        "link": link,
                        "is_alt": False
                    })
                continue
                
            # Multiple items possible (main + alt)
            item_divs = items_div.find_all('div', recursive=False)
            if item_divs:
                for item in item_divs:
                    a_tag = item.find('a')
                    if a_tag:
                        time_span = a_tag.find('span', class_='station-sch-time')
                        time = time_span.text.strip() if time_span else ""
                        title_span = a_tag.find('span', class_='station-sch-title')
                        title = title_span.text.strip() if title_span else ""
                        link = a_tag.get('href', '')
                        is_alt = item.find('div', class_='weektable-alt') is not None
                        schedule_data[day].append({
                            "time": time,
                            "title": title,
                            "link": link,
                            "is_alt": is_alt
                        })
            else:
                # Direct a tags in schedule-items
                a_tags = items_div.find_all('a', recursive=False)
                for a_tag in a_tags:
                    time_span = a_tag.find('span', class_='station-sch-time')
                    time = time_span.text.strip() if time_span else ""
                    title_span = a_tag.find('span', class_='station-sch-title')
                    title = title_span.text.strip() if title_span else ""
                    link = a_tag.get('href', '')
                    schedule_data[day].append({
                        "time": time,
                        "title": title,
                        "link": link,
                        "is_alt": False
                    })

with open('schedule.json', 'w') as f:
    json.dump(schedule_data, f, indent=2)

print("Parsed schedule.html and created schedule.json")
