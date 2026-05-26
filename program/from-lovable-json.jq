group_by(.startTime)
| map({
    # Create ISO datetime for the start time
    start: (if .[0].id | contains("1-") then "2026-05-28T\(.[0].startTime):00+02:00" else "2026-05-29T\(.[0].startTime):00+02:00" end),
    activities: map({
        # Create ISO datetime for the stop/end time
        stop: (if .id | contains("1-") then "2026-05-28T\(.endTime):00+02:00" else "2026-05-29T\(.endTime):00+02:00" end),
        # Handle location/room - lowercase the location
        room: (if .location == "SPACE" then "Space" 
              elif .location == "TAB" then "Tab" 
              else "" end),
        # Convert type field to match format
        type: (if .type == "talk" then "Blixttal / lightning talk"
              elif .type == "keynote" then "Keynote"
              else "" end),
        # Keep the title as is
        title: .title
    })
})