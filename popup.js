document.getElementById("submitPurge").addEventListener("click", purge(
    document.getElementById('regexp').value
));



function purge(reg){
    console.log(reg);
    browser.runtime.sendMessage(
	//"gohaiaaidbdnphbhngnpamkfipkhhdla",
	{txt: "purge",
	    re: reg}
    )
}
