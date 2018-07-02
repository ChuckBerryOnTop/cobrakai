const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true, switches: {
	'ignore-certificate-errors': true
} })

nightmare
	.goto("http://cobrakai-team.ddns.net/")
	.wait(2000)
	.click("#cam")
	.wait(3000)
	.click("#snap")
	.wait(5000)
	.screenshot("example.png")
	.click(".dbHistory")
	.wait(10000)
	.screenshot("historyex.png")
	.end()
  .then(function(result) {
    console.log(result);
  })
  .catch(function(error) {
    console.error("Search failed:", error);
	});
	
	