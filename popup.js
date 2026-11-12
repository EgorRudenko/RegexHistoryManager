document.getElementById("submitPurge").addEventListener("click", () => {purge(
    document.getElementById('regexp').value
)});

document.getElementById("submitUpdate").addEventListener("click", () => {update(
    document.getElementById('regexpRegular').value
)});



browser.storage.sync.get("singularHistoryPurgeRegexp").then((item)=>{
    document.getElementById("regexp").value = item.singularHistoryPurgeRegexp;
})



browser.storage.sync.get("realtimeHistoryPurgeRegexp").then((item)=>{
    document.getElementById("regexpRegular").value = item.realtimeHistoryPurgeRegexp;
})


function purge(reg){
    if (reg != ""){
	browser.runtime.sendMessage(
	    {txt: "purge",
		re: reg}
	)
    }
}

function update(reg) {
    if (reg != ""){
	browser.runtime.sendMessage(
	    {txt: "setRe",
		re: reg}
	)
    }
}
