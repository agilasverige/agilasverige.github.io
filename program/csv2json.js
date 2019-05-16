const fs = require('fs');
const moment = require('moment');
const parse = require('csv-parse/lib/sync');


function toProgramRecord(row) {
  return {
    speaker: row['Namn, inklusive eventuella medtalare'],
    type: row['Typ av tal'],
    title: row['Titel på blixttal/workshop'],
    description: row['Beskrivning av blixttal/workshop'],
    planned: row['I programmet'],
    start:row['Start'],
    stop: row['Stop'],
    room: row['Rum']
  }
}

function toBetterProgramRecord(record) {
  const dayPlanned = record.planned;
  return {
    speaker: record.speaker,
    type: record.type,
    title: record.title,
    description: record.description,
    start: time(dayPlanned, record.start),
    stop: time(dayPlanned, record.stop),
    room: record.room
  }
}

function datePlanned(dayPlanned) {
  return dayPlanned.startsWith('Dag 1') ? moment('2019-05-23') : moment('2019-05-24');
}

function time(dayPlanned, time) {
  const date = datePlanned(dayPlanned);
  const start = moment(time, 'hh:mm');
  return date.hour(start.hour()).minute(start.minute()).format();
}

function toSlotWithActivity(record) {
  return {
    start: record.start,
    stop: record.stop,
    activities: [ {
      room: record.room,
      type: record.type,
      title: record.title,
      speaker: record.speaker,
      description: record.description
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

const input = fs.readFileSync('talanmälningar.csv');

const program = parse(input, { columns: true})
  .map(toProgramRecord)
  .filter((record) => record.planned && record.planned !== 'Tillbakadragen av talaren')
  .map(toBetterProgramRecord)
  .sort((record1, record2) => record1.start.localeCompare(record2.start))
  .map(toSlotWithActivity)
  .reduce(groupByTime, []);

const outputFile = fs.openSync('program.json', 'w');
fs.writeSync(outputFile, JSON.stringify(program));
