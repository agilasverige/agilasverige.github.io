const weekdays = [ 'söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag' ]

$.get("./program.json", function (program) {

    Handlebars.registerHelper('timestamp', function (dateString) {
      return Date.parse(dateString);
    });

    Handlebars.registerHelper('localDate', function (dateString) {

      const dayOfWeek = new Date(Date.parse(dateString)).getDay();
      return weekdays[dayOfWeek];
    });

    Handlebars.registerHelper('localTime', function (dateString) {
      const date = new Date(Date.parse(dateString));
      return date ? date.toLocaleTimeString().split(':').slice(0, 2).join(':') : '';
    });

    const source = document.getElementById("program-template").innerHTML;
    const template = Handlebars.compile(source);

    const programDay1 = program.filter((slot) => Date.parse(slot.start) < Date.parse('2019-05-24T00:00:00+02:00'));
    const programDay2 = program.filter((slot) => Date.parse(slot.start) >= Date.parse('2019-05-24T00:00:00+02:00'));

    const day1Html = template({slots: programDay1});
    const day2Html = template({slots: programDay2});

    document.getElementById("program-day-1").innerHTML = day1Html;
    document.getElementById("program-day-2").innerHTML = day2Html;

    const startTimes = program.map(slot => Date.parse(slot.start));

    function findCurrentAndNext(now) {

      const nextIndex = startTimes.findIndex((timestamp) => timestamp >= now);
      if (nextIndex > 0) {
        return { current: startTimes[nextIndex - 1], next: startTimes[nextIndex] };
      }
      return { current: 0, next: 0 };
    }

    function markCurrentSlot() {
      const now = new Date();
      const currentAndNext = findCurrentAndNext(now);

      $('.current').removeClass('current');
      $('.next').removeClass('next');
      const current = $('[data-start-time=' + currentAndNext.current + ']').addClass('current').get(0);
      $('[data-start-time=' + currentAndNext.next + ']').addClass('next');
      console.log(window.location.hash);
      if (current && (window.location.hash === "#next")) {
        console.log("scrolling to " + current);
        current.scrollIntoView();
      }
    }

    markCurrentSlot();
    window.setInterval(markCurrentSlot, 60000);
});


