const fs = require('fs');
const moment = require('moment');
const parse = require('csv-parse/lib/sync');


function toProgramRecord(row) {
  return {
    speaker: row['Namn, inklusive eventuella medtalare'],
    type: row['Typ av tal'],
    title: row['Titel på blixttal/workshop'],
    description: row['Beskrivning av blixttal/workshop'],
    planned: row['I programmet']
  }
}

function datePlanned(record) {
  const startDate = record.planned.startsWith('Dag 1') ? moment('2019-05-23') : moment('2019-05-24');
  return startDate.format();
}

function toSlotWithActivity(record) {
  return {
    start: datePlanned(record),
    stop: datePlanned(record),
    activities: [ {
      room: '',
      type: record.type,
      title: record.title,
      speaker: record.speaker,
      description: record.description
    }]
  }
}

const input = fs.readFileSync('talanmälningar.csv');
const program = parse(input, { columns: true})
  .map(toProgramRecord)
  .filter((record) => record.planned && record.planned !== 'Tillbakadragen av talaren')
  .sort((record1, record2) => record1.planned.localeCompare(record2.planned))
  .map(toSlotWithActivity);

const outputFile = fs.openSync('program.json', 'w');
fs.writeSync(outputFile, JSON.stringify(program));