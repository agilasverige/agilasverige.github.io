

function leftPad(minutes) {
  return minutes < 10 ? '0' + minutes : minutes;
}

$.get("./test_program.json", function (rawProgram) {

  room = "space";

  function rawSlotToSlot(rawSlot) {
    activity = rawSlot.activities[0]
    return { start: Date.parse(rawSlot.start), end: Date.parse(activity.stop), title: activity.title };
  }

  function findCurrent(now) {

    const currentIndex = program.findIndex((slot) => slot.start <= now && slot.end >= now);
    if (currentIndex >= 0) {
      return program[currentIndex];
    }
    const nextIndex = program.findIndex((slot) => slot.start >= now);
    if (nextIndex >= 0) {
      return { start: new Date(), end: program[nextIndex].end, title: "Paus" };
    }
    return { start: new Date(), end: new Date().setFullYear(new Date().getFullYear() + 1), title: "Paus" };
  }

  const program = rawProgram.map((slot) => rawSlotToSlot(slot));


  function updateTimeRemaining() {
    const now = new Date();
    const currentSlot = findCurrent(now);

    const timeDiff = currentSlot.end - now;
    const minutes = Math.floor(timeDiff / 60000);
    const seconds = Math.floor((timeDiff % 60000) / 1000);

    document.getElementById("time-remaining").innerText = `${leftPad(minutes)}:${leftPad(seconds)}`;
    document.getElementById("current-title").innerText = `${currentSlot.title}`;
  }

  updateTimeRemaining();
  window.setInterval(updateTimeRemaining, 1000);
});
