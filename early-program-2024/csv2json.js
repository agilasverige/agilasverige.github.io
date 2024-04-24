const fs = require('fs');
const moment = require('moment');
const parse = require('csv-parse/lib/sync');


const firstConferenceDay = moment('2024-05-30')

function toProgramRecord(row) {
  const record =  {
    speaker: row['Namn, inklusive eventuella medtalare/ Name, including co speaker'],
    type: row['Typ av tal/ Type of talk'],
    title: row['Titel på blixttal/workshop/ Title'],
    description: row['Beskrivning av blixttal/workshop/ Description of talk/workshop'],
    planned: row['I programmet'],
    start: row['Start'],
    stop: row['Stop'],
    room: row['Rum'],
    prefix: row['Prefix'],
    link: row['Länk'],
    linkText: row['Länktext'],
    material: row['Material']
  }
  return record
}

function toBetterProgramRecord(record) {
  const dayPlanned = record.planned;
  return {
    speaker: record.speaker,
    type: record.type,
    prefix: record.prefix,
    title: record.title,
    descriptionParagraphs: splitIntoParagraphs(record.description),
    start: time(dayPlanned, record.start),
    stop: time(dayPlanned, record.stop),
    room: record.room,
    link: record.link,
    linkText: record.linkText,
    material: record.material
  }
}

function splitIntoParagraphs(text) {
  if (typeof text != 'string') {
    return []
  }
  return text.split('\n')
}

function datePlanned(dayPlanned) {
  return dayPlanned.startsWith('Dag 1') ? firstConferenceDay : firstConferenceDay.clone().add(1, 'days');
}

function time(dayPlanned, time) {
  const date = datePlanned(dayPlanned);
  const start = moment(time, 'hh:mm');
  return date.hour(start.hour()).minute(start.minute()).format();
}

function toSlotWithActivity(record) {
  return {
    start: record.start,
    activities: [{
      stop: record.stop,
      room: record.room,
      type: record.type,
      prefix: record.prefix,
      title: record.title,
      speaker: record.speaker,
      descriptionParagraphs: record.descriptionParagraphs,
      link: record.link,
      linkText: record.linkText,
      material: record.material
    }]
  }
}

function compareRooms(session1, session2) {
  return session1.room.localeCompare(session2.room);
}

function groupByTime(slots, current) {
  const found = slots.find((slot) => slot.start === current.start);
  if (found) {
    found.activities = found.activities.concat(current.activities).sort(compareRooms);
  } else {
    slots.push(current);
  }
  return slots;
}

const sessions = parse(fs.readFileSync('talanmälningar.csv'), { columns: true });
const otherEvents = parse(fs.readFileSync('ovrigt.csv'), { columns: true })

const program = sessions.concat(otherEvents)
  .map(toProgramRecord)
  .filter((record) => record.planned && record.planned.startsWith('Dag'))
  .map(toBetterProgramRecord)
  .sort((record1, record2) => record1.start.localeCompare(record2.start))
  .map(toSlotWithActivity)
  .reduce(groupByTime, []);

const outputFile = fs.openSync('program.json', 'w');
fs.writeSync(outputFile, JSON.stringify(program));
