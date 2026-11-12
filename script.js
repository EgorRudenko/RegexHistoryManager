let re;

browser.storage.sync.get("realtimeHistoryPurgeRegexp").then((item) =>
{
    re = new RegExp(item.realtimeHistoryPurgeRegexp); 
});

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
	if (message.re != "") {
	    browser.storage.sync.set({realtimeHistoryPurgeRegexp: message.re});
	    re = new RegExp(message.re);
	}
    } else if (message.txt == "purge") {
	if (message.re != "") {
	    browser.storage.sync.set({singularHistoryPurgeRegexp: message.re});
	    const p = new RegExp(message.re);
	    purge(p);
	}
    }
}


browser.runtime.onMessage.addListener(
    procMes
)

browser.history.onVisited.addListener(
    processNewHistoryEntry
)
