const update_btn 	= document.getElementById('update');
const wb_href 		= document.getElementById('wb-href');
const table_wrapper = document.getElementById('table-wrapper');

let hostname = '';


const check_cookies = ["x-supplier-id", "WBTokenV3", "wbx-validation-key", "wbx-refresh", "wbx-seller-device-id"];


const titles = document.querySelectorAll(".title");
titles.forEach(el => {
    el.addEventListener('click', function(e) {
        const main_part = el.closest(".cookie_block").querySelector(".main_part");

		toggle(main_part);
    });
});


const links = document.querySelectorAll("a.copy");
links.forEach(el => {
    el.addEventListener('click', function(e) {
        const main_part 	= el.closest(".main_part");
        const value_block 	= el.closest(".value_block");
        const textarea 		= value_block.getElementsByTagName('textarea')[0];

		navigator.clipboard.writeText(textarea.value);
		
		main_part.style.background = "#d6fbe1";
		setTimeout(
			function(){
				main_part.style.background = "#ebebeb";
			}, 300
		);
    });
});



(async function initPopupWindow() {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    if (tab?.url) {
	    
		await loadCookies();

        try {
            let url = new URL(tab.url);
            hostname = url.hostname;
            if (hostname === "seller.wildberries.ru") {
                wb_href.classList.add('display-none');
                update_btn.classList.remove('display-none');
                table_wrapper.classList.remove('display-none');
            } else {
                update_btn.classList.add('display-none');
                table_wrapper.classList.add('display-none');
                wb_href.classList.remove('display-none');
            }
        } catch {
            //
        }
    }

})();




update_btn.addEventListener("click", function () {
    chrome.cookies.remove({
        url: "https://seller.wildberries.ru/",
        name: "wbx-validation-key",
    });
    chrome.tabs.reload();
})


chrome.cookies.onChanged.addListener(function (changeInfo)
{
	loadCookies();
})


async function loadCookies()
{
	
	let domain;
	for(const cookie_name of check_cookies)
	{
		switch(cookie_name) {
			case 'wbx-refresh':
				domain = "https://seller-auth.wildberries.ru/";
			break;
			case 'wbx-seller-device-id':
				domain = "https://seller-auth.wildberries.ru/auth/";
			break;
			default:
				domain = "https://seller.wildberries.ru/";
			break;
		}
		
	    chrome.cookies.get({"url": domain, "name": cookie_name}, function(cookie)
	    {
			let val_container 		= document.getElementById(cookie_name);
			let expire_container 	= document.getElementById(cookie_name+'-expire');
			
			if(val_container){
				val_container.innerHTML = cookie.value;
			}

			if(expire_container){
				let tmp_exp = new Date(cookie.expirationDate * 1000);
				expire_container.innerHTML = tmp_exp.toLocaleDateString('ru-RU');
			}
	    });
	}
}


function toggle(el){
    if (el.style.display == 'none') {
        el.style.display = 'block'
    } else {
        el.style.display = 'none'
    }
}

function writeClipboardText(text) {
	navigator.clipboard.writeText(text);
}

