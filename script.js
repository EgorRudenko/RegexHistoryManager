let re;

browser.action.setIcon({path: "clk.png"});

browser.storage.local.get("realtimeHistoryPurgeRegexp").then((item) =>
    {
	if (item.realtimeHistoryPurgeRegexp != ""){
	    re = new RegExp(item.realtimeHistoryPurgeRegexp);
	} else {
	    // matches nothing
	    re = new RegExp("a^");
	}
});


async function iconSwap(tabId, changeInfo, tab) {
    const tabn = await chrome.tabs.get(tabId);
    if (re && re.test(tabn.url)) {
	if (!tabn.title.startsWith("[F] ")) {
	    browser.scripting.executeScript(
		{
		    target: {tabId:tabId},
		    func: () => !document.title.startsWith("[F] ") ?
			document.title="[F] "+document.title :
			console.log("Title already changed")
		}
	    );
	}
	browser.action.setIcon({path: "clkr.png"});
    } else {
	browser.action.setIcon({path: "clk.png"});
    }
}

async function iconSwapAct(activeInfo) {
    console.log(activeInfo);
    if (activeInfo == undefined) return;
    const tabId = activeInfo.tabId;
    if (tabId == undefined) return;

    const tab = await chrome.tabs.get(tabId);
    const url = tab.url;

    if (re && re.test(url)) {
	if (!tab.title.startsWith("[F] ")) {
	    browser.scripting.executeScript(
		{
		    target: {tabId:tabId},
		    func: () => !document.title.startsWith("[F] ") ?
			document.title="[F] "+document.title :
			console.log("Title already changed")
		}
	    );
	}
	browser.action.setIcon({
	    path: "clkr.png",
	    tabId: tabId
	});
    } else {
	browser.action.setIcon({
	    path: "clk.png",
	    tabId:tabId
	});
    }
}

function processNewHistoryEntry(HI) {
    if (re && re.test(HI.url)) {
	browser.action.setIcon({path: "clkr.png"});
	browser.history.deleteUrl({ url: HI.url});
    } else {
	browser.action.setIcon({path: "clk.png"});
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
	browser.storage.local.set({realtimeHistoryPurgeRegexp: message.re});
	if (message.re != "") {
	    re = new RegExp(message.re);
	} else {
	    // match nothing
	    re = new RegExp("a^");
	}
    } else if (message.txt == "purge") {
	browser.storage.local.set({singularHistoryPurgeRegexp: message.re});
	if (message.re != "") {
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


browser.tabs.onActivated.addListener(
    iconSwapAct
)
browser.tabs.onUpdated.addListener(
    iconSwap
)
