document.getElementById("showBtn").addEventListener("click", () => {
    document.getElementById("showBtn").style.visibility = "hidden";
    document.getElementById("cont").style.visibility = "visible";
});

document.getElementById("submitPurge").addEventListener("click", () => {purge(
    document.getElementById('regexp').value
)});

document.getElementById("submitUpdate").addEventListener("click", () => {update(
    document.getElementById('regexpRegular').value
)});



browser.storage.local.get("singularHistoryPurgeRegexp").then((item)=>{
    document.getElementById("regexp").value = item.singularHistoryPurgeRegexp!=undefined ?
	item.singularHistoryPurgeRegexp : "";
})



browser.storage.local.get("realtimeHistoryPurgeRegexp").then((item)=>{
    console.log(item.realtimeHistoryPurgeRegexp);
    document.getElementById("regexpRegular").value = item.realtimeHistoryPurgeRegexp!=undefined ?
	item.realtimeHistoryPurgeRegexp : "";
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
