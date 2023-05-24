function leftPad(minutes) {
  return minutes < 10 ? '0' + minutes : minutes;
}

function programName(search) {
  if (search.includes("?test")) {
    return "./test_program.json"
  }
  return "./program.json";
}

$.get(programName(window.location.search), function (rawProgram) {

  const roomHash = window.location.hash || "#space";
  const room = roomHash.substring(1);
  let muted = true

  function bell() {
    if (!muted) {
      const audio = new Audio('./bell.mp3');
      audio.play();
    }
  }

  function muteOrUnmute() {
    muted = !muted
    document.getElementById("mute-button").innerText = muted ? "Unmute" : "Mute"
  }


  function findActivityForRoom(activities, roomName) {
    const indexFound = activities.findIndex((activity) => activity.room.toLowerCase() === roomName);
    if (indexFound >= 0) {
      return activities[indexFound];
    }
    return activities[0];
  }

  function rawSlotToSlot(rawSlot) {
    const activity = findActivityForRoom(rawSlot.activities, room)
    return { start: new Date(Date.parse(rawSlot.start)), end: new Date(Date.parse(activity.stop)), title: activity.title };
  }

  function findCurrent(now) {

    const currentIndex = program.findIndex((slot) => slot.start <= now && slot.end >= now);
    if (currentIndex >= 0) {
      return program[currentIndex];
    }
    const nextIndex = program.findIndex((slot) => slot.start >= now);
    if (nextIndex >= 0) {
      return { start: new Date(), end: program[nextIndex].start, title: "Paus" };
    }
    return { start: new Date(), end: new Date().setFullYear(new Date().getFullYear() + 1), title: "Slut för i år" };
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
    if (timeDiff <= 1000) {
      bell()
    }
  }

  document.getElementById("mute-button").onclick = muteOrUnmute;
  updateTimeRemaining();
  window.setInterval(updateTimeRemaining, 1000);
});
