let re; 

function processNewHistoryEntry(HI) {
    if (re && re.test(HI.url)) {
	browser.history.deleteUrl({ url: HI.url});
    }
}

function purge(re) {
    let itemsProm = browser.history.search({
	text: "",
    	maxResults: 1000000000,
	startTime: 0
    });
    itemsProm.then((items) => {
	let out = items.filter((e) => {
	    return re.test(e.url)
	})
	out.forEach((e) => {
	    browser.history.deleteUrl({ url: e.url })
	})
	console.log("done");
    });
}

function procMes(message) {
    if (message.txt == "setRe") {
	re = new RegExp(message.re);
    } else if (message.txt == "purge") {
	const p = new RegExp(message.re);
	console.log(p);
	purge(p);
    }
}


browser.runtime.onMessage.addListener(
    procMes
)

browser.history.onVisited.addListener(
    processNewHistoryEntry
)
