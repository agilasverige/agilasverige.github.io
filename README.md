# Det här är alltså Agila Sverige-sajten

Japp, det är typ bara en statisk html-sida där texten och sponsorloggorna ligger direkt i dokumentet.

## Hur man genererar programmet

1. Ladda ner första fliken i talanmälansarket (Form Responses 1) som csv.
2. Kopiera in csv-filen som `program/talanmälningar.csv`.
3. `cd program`
4. `node csv2json.js`
5. `program/program.json` bör nu vara uppdaterat och fräscht.
6. Förbind och knuffa: `git commit -am "Updated program" && git push`
7. Profit!
