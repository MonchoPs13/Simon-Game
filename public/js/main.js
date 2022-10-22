(()=>{var t={198:()=>{const t=document.querySelectorAll("[data-form-toggle]");function e(){document.querySelector(`#form-${this.dataset.formToggle}`).closest(".form-modal").classList.remove("hidden")}function s(t){(t.target.classList.contains("form-modal")||t.target.classList.contains("form__close"))&&t.target.closest(".form-modal").classList.add("hidden")}[...document.querySelectorAll(".form-modal"),...document.querySelectorAll(".form__close")].forEach((t=>t.addEventListener("click",s))),t.forEach((t=>t.addEventListener("click",e)))},683:()=>{const t=document.querySelector(".theme"),e=document.querySelector(".theme__button"),s=document.querySelectorAll(".theme__label"),n=document.querySelectorAll(".simon-game__tile");t.addEventListener("input",(function(t){const e=t.target.closest("label"),s=n[Number(e.dataset.tile)];e.style.setProperty("--current-clr",t.target.value);const i=function(t,e,s){t/=255,e/=255,s/=255;let n=Math.min(t,e,s),i=Math.max(t,e,s),r=i-n,a=0,o=0,c=0;return a=0==r?0:i==t?(e-s)/r%6:i==e?(s-t)/r+2:(t-e)/r+4,a=Math.round(60*a),a<0&&(a+=360),c=(i+n)/2,o=0==r?0:r/(1-Math.abs(2*c-1)),o=+(100*o).toFixed(1),c=+(100*c).toFixed(1),[a,o,c]}(...function(t){let e=0,s=0,n=0;return 4==t.length?(e="0x"+t[1]+t[1],s="0x"+t[2]+t[2],n="0x"+t[3]+t[3]):7==t.length&&(e="0x"+t[1]+t[2],s="0x"+t[3]+t[4],n="0x"+t[5]+t[6]),[Number.parseInt(e,16),Number.parseInt(s,16),Number.parseInt(n,16)]}(t.target.value)),r=`hsl(${i[0]}, ${i[1]}%, ${i[2]}%)`,a=`hsl(${i[0]}, ${i[1]}%, ${i[2]}%, 0.4)`;s.style.setProperty("--tile-color",r),s.style.setProperty("--tile-color-opaque",a)})),e.addEventListener("click",(function(t){n.forEach((t=>{t.style.setProperty("--tile-color",null),t.style.setProperty("--tile-color-opaque",null)})),s.forEach((t=>t.style.setProperty("--current-clr",null)))}))}},e={};function s(n){var i=e[n];if(void 0!==i)return i.exports;var r=e[n]={exports:{}};return t[n](r,r.exports,s),r.exports}(()=>{"use strict";const t=2e3;document.querySelector(".play-buttons").addEventListener("click",(function(t){if(t.target.classList.contains("play-buttons__btn")&&t.target.dataset.volume){t.target.dataset.volume="on"===t.target.dataset.volume?"off":"on";const e=t.target.querySelector("use"),s=e.getAttribute("xlink:href");e.setAttribute("xlink:href",s.includes("up")?s.replace("up","off"):s.replace("off","up"))}}));const e=document.querySelector("#form-play");function n(e,s){const n=`<span class="alert alert--${s}">${e}</span>`;document.body.insertAdjacentHTML("afterbegin",n),setTimeout((()=>{document.querySelector(".alert").remove()}),t)}e.addEventListener("submit",(function(t){t.preventDefault(),"Log In"===t.submitter.textContent?window.location="/login":this.closest(".form-modal").classList.toggle("hidden")})),e.addEventListener("click",(function(t){t.target.classList.contains("link")&&(t.preventDefault(),this.closest(".form-modal").classList.toggle("hidden"),document.querySelector('.navigation__link[href="#leaderboards-section"]').click())})),s(683),s(198);class i{constructor(t,e,s){this.form=t,this.action=t.getAttribute("action"),this.method=t.getAttribute("method"),this.form.addEventListener("submit",this.submit.bind(this))}async submit(e){try{e.preventDefault();const s={};new FormData(this.form).forEach(((t,e)=>{s[e]=t})),"resetPassword"===this.form.id&&(s.token=e.submitter.dataset.token);const i=await fetch(this.action,{headers:{"Content-Type":"application/json"},method:this.method,body:JSON.stringify(s)}),r=await i.json();if("fail"===r.status||"error"===r.status)throw new Error(r.message);n(r.message,"success"),"login"!==this.form.id&&"signup"!==this.form.id&&"resetPassword"!==this.form.id||setTimeout((()=>window.location="/"),t),this.form.dataset.reload&&setTimeout((()=>window.location.reload()),t)}catch(t){n(t.message,"error")}}}["#login","#signup","#resetPassword","#forgotPassword","#form-account"].forEach((t=>{const e=document.querySelector(t);e&&new i(e)}));const r=document.querySelector("#pending-column"),a=document.querySelector("#form-friends"),o=document.querySelector(".form__search input"),c=document.querySelector(".form__user-container"),l=document.querySelector("#form-friends .form__loading"),u=function(t,e=1e3){let s;return function(...n){clearTimeout(s),s=setTimeout((()=>{t(...n)}),e)}}((async t=>{try{if(c.innerHTML="",!t)return;l.classList.remove("hidden");const e=await fetch(`/api/v1/users/searchFriend/${t}`),s=await e.json();let n="";s.data.users.forEach((t=>{n+=`<div class="label label--add-friend" style="margin-top: 1rem">\n\t\t<svg class="label__icon">\n\t\t\t<use xlink:href="./img/sprite.svg#user"></use>\n\t\t</svg>\n\t\t<span class="label__text">${t.username}</span>\n\t\t<svg class="label__icon" style="--clickable: all">\n\t\t\t<use xlink:href="./img/sprite.svg#add"></use>\n\t\t</svg>\n\t</div>`})),l.classList.add("hidden"),c.insertAdjacentHTML("afterbegin",n)}catch(t){n(t.message,"error")}}),750);r?.addEventListener("click",(async t=>{if(!t.target.dataset.addFriend)return;const e=t.target.dataset.addFriend,s=t.target.parentElement.querySelector(".label__text").textContent;await async function(t,e){try{const s=await fetch(`/api/v1/users/addFriend/${e}/${t}`,{method:"POST"}),i=await s.json();if("success"!==i.status)throw new Error(i.message);if(n(i.message,"success"),"deny"===e)return;const r=`\n\t\t\t<div class='label'>\n\t\t\t\t<svg class='label__icon'>\n\t\t\t\t\t<use xlink:href='/img/sprite.svg#user'></use>\n\t\t\t\t</svg>\n\t\t\t\t<span class='label__text'>${t}</span>\n\t\t\t</div>\n\t\t`;document.querySelector("#friends-column .label").insertAdjacentHTML("beforebegin",r)}catch(t){n(t.message,"error")}}(s,e),t.target.parentElement.remove()})),o?.addEventListener("input",(t=>{const e=t.target.value;u(e)})),a?.addEventListener("submit",(t=>{t.preventDefault(),u(o.value)})),c?.addEventListener("click",(t=>{t.target.classList.contains("label__icon")&&async function(t){try{const e=await fetch(`/api/v1/users/sendFriendRequest/${t}`,{method:"POST"}),s=await e.json();if("success"!==s.status)throw new Error(s.message);n(s.message,"success")}catch(t){n(t.message,"error")}}(t.target.parentElement.querySelector(".label__text").textContent)}));class d{constructor(t,e,s){this.toggle=t,this.container=e,this.pageSize=s,this.currentPage=1,this.toggle&&this.container&&(this.toggle.addEventListener("click",this._pageChange.bind(this)),this._init())}_init(){this.list=JSON.parse(this.container.dataset.list),this.pageCount=Math.ceil(this.list.length/this.pageSize),this._updateLabelStyles()}_pageChange(t){if(!t.target.dataset.to)return;const e=t.target.dataset.to;this.currentPage+="left"===e?-1:1,this._updateLabelStyles(),this._updateMarkup()}_updateMarkup(){const t=(this.currentPage-1)*this.pageSize,e=this._generateMarkup(t);this.container.innerHTML="",this.container.insertAdjacentHTML("afterbegin",e)}_updateLabelStyles(){const t=this.toggle.querySelector('.label__icon[data-to="left"]'),e=this.toggle.querySelector('.label__icon[data-to="right"]');1===this.currentPage&&t.classList.add("inactive"),2===this.currentPage&&t.classList.remove("inactive"),this.list&&this.list[this.currentPage*this.pageSize]?e.classList.remove("inactive"):e.classList.add("inactive"),this.toggle.querySelector(".label__text").textContent=`${this.currentPage} / ${this.pageCount||1}`}}new class extends d{constructor(t,e,s){super(t,e,s)}_generateMarkup(t){let e="";for(let s=t;s<this.pageSize+t&&this.list[s];s++)e+=`\n\t\t\t\t<div class='label'>\n\t\t\t\t\t<svg class='label__icon'>\n\t\t\t\t\t\t<use xlink:href='/img/sprite.svg#user'></use>\n\t\t\t\t\t</svg>\n\t\t\t\t\t<span class='label__text'>${this.list[s]}</span>\n\t\t\t\t</div>\n\t\t\t`;return e}}(document.querySelector("#friends-paginator"),document.querySelector("#friends-container"),5),new class extends d{constructor(t,e,s){super(t,e,s)}_generateMarkup(t){let e="";for(let s=t;s<this.pageSize+t&&this.list[s];s++)e+=`\n\t\t\t\t<div class='label'>\n\t\t\t\t\t<svg class='label__icon'>\n\t\t\t\t\t\t<use xlink:href='/img/sprite.svg#user'></use>\n\t\t\t\t\t</svg>\n\t\t\t\t\t<span class='label__text'>${this.list[s]}</span>\n\t\t\t\t</div>\n\t\t\t\t<svg class='label__icon' style='--clickable: all' data-add-friend='accept'>\n\t\t\t\t\t<use xlink:href='/img/sprite.svg#checkmark-outline'></use>\n\t\t\t\t</svg>\n\t\t\t\t<svg class='label__icon' style='--clickable: all' data-add-friend='deny'>\n\t\t\t\t\t<use xlink:href='/img/sprite.svg#close-outline'></use>\n\t\t\t\t</svg>\n\t\t\t`;return e}}(document.querySelector("#pending-paginator"),document.querySelector("#pending-container"),5),new class extends d{constructor(t,e,s,n){super(t,e,s),this.modeSwitch=n,this.modeSwitch.addEventListener("click",this._switchMode.bind(this))}async _init(){this.mode=this.mode||"global",this.currentPage=1,await this._getList(),this.pageCount=Math.ceil(this.list?.length/this.pageSize),this._updateLabelStyles(),this.list&&this._updateMarkup()}async _getList(){try{const t=await fetch(`/api/v1/users/leaderboards/${this.mode}`),e=await t.json();if("fail"===e.status||"error"===e.status)throw new Error(e.message);this.list=e.data.users}catch(t){this.list=this.container.innerHTML="";const e=`\n\t\t\t\t<div style='color: var(--clr-red); text-align: center; margin-bottom: 1rem'>${t.message}</div>\n\t\t\t`;this.container.insertAdjacentHTML("afterbegin",e)}}_generateMarkup(t){let e="";for(let s=t;s<t+this.pageSize&&this.list[s];s++){let t;t=[0,1,2].includes(s)?`\n\t\t\t\t\t<svg class='label__icon' style='fill: var(--clr-${["yellow","silver","bronze"][s]})'>\n\t\t\t\t\t\t<use xlink:href='/img/sprite.svg#trophy'></use>\n\t\t\t\t\t</svg>\n\t\t\t\t`:`\n\t\t\t\t\t<span class='label__text'>${s+1}°</span>\n\t\t\t\t`,e+=`\n\t\t\t\t<div class='label'>\n\t\t\t\t\t${t}\n\t\t\t\t\t<span class='label__text'>${this.list[s].username}</span>\n\t\t\t\t\t<span class='label__text'>${this.list[s].highscore}</span>\n\t\t\t\t</div>\n\t\t\t`}return e}_switchMode(t){if(!t.target.classList.contains("leaderboard-type__option"))return;const[e,s]=[...this.modeSwitch.querySelectorAll(".leaderboard-type__option")];e.classList.toggle("leaderboard-type__option--inactive"),s.classList.toggle("leaderboard-type__option--inactive"),this.mode=t.target.textContent.toLowerCase(),this._init()}}(document.querySelector("#leaderboards-paginator"),document.querySelector(".leaderboard"),9,document.querySelector(".leaderboard-type")),new class{#t=document.querySelector(".navigation__list");#e=document.querySelectorAll(".section");constructor(){this.#t.addEventListener("click",this._pageChange.bind(this)),this.currentLink=document.querySelector(".navigation__link--active"),this.currentSection=document.querySelector(this.currentLink.getAttribute("href")),document.addEventListener("touchstart",this._touchStart.bind(this)),document.addEventListener("touchmove",this._touchMove.bind(this)),["touchend","touchcancel"].forEach((t=>document.addEventListener(t,this._touchEnd.bind(this))))}_pageChange(t){if(t.target===this.#t)return;t.preventDefault();const e=t.target.closest("a");this.currentLink.classList.remove("navigation__link--active"),e.classList.add("navigation__link--active"),this.currentLink=e;const s=document.querySelector(e.getAttribute("href"));this.currentSection=s;const n=Number(s.dataset.translate);this.#e.forEach((t=>{const e=Number(t.dataset.translate);t.dataset.translate=e-n,t.style.translate=e-n+"%"}))}_touchStart(t){this.startX=t.touches[0].clientX,this.#e.forEach((t=>t.style.transition="none"))}_touchMove(t){const e=Math.round(t.touches[0].clientX-this.startX),s=Number.parseInt(getComputedStyle(document.body).width),n=Math.round(100*e/s);"theme-section"===this.currentSection.id&&n>0||"friends-section"===this.currentSection.id&&n<0||this.#e.forEach((t=>{t.style.translate=`${Number(t.dataset.translate)+n}%`}))}_touchEnd(){this.#e.forEach((t=>{t.style.transition="translate 0.5s";const e=Number.parseInt(t.style.translate)||t.dataset.translate,s=100*Math.round(e/100);t.style.translate=`${s}%`,t.dataset.translate=s})),this.currentSection=document.querySelector('[data-translate="0"]'),this.currentLink.classList.remove("navigation__link--active"),this.currentLink=document.querySelector(`a[href="#${this.currentSection.id}"]`),this.currentLink.classList.add("navigation__link--active"),this.startX=0}},new class{#s=document.querySelector(".simon-game__inner-circle");#n=document.querySelector(".simon-game__outer-circle");#i=document.querySelector(".simon-game__cross");#r=document.querySelector(".game-score__score");#a=document.querySelector("#form-play");#o=document.querySelector("#highscoreLabel");constructor(){this.#s.addEventListener("click",this.startGame.bind(this)),this.#n.addEventListener("click",this._tileHandler.bind(this)),this.tiles=[...document.querySelectorAll(".simon-game__tile")],this.audios=this.tiles.map((t=>new Audio(`../audios/${t.dataset.audio}`))),this.errorAudio=new Audio("../audios/error.wav"),this.volumeBtn=document.querySelector("[data-volume]"),this.#o&&window.localStorage.setItem("highscore",this.#o.textContent),this._initVariables()}_initVariables(){this.active=!1,this.running=!1,this.step=0,this.pattern=[],this.score=0}startGame(){this.#s.classList.add("simon-game__inner-circle--inactive"),this.active=!0,this._startRound()}_startRound(){this.running=!0,this.step=0;const t=this._generateRandomNumber();this.pattern.push(t),new Promise((t=>{setTimeout(t,800*(this.pattern.length+1)),this.pattern.forEach(((t,e)=>{setTimeout(this._applyStyles.bind(this,t),800*(e+1))}))})).then((()=>{this.running=!1}))}_tileHandler(t){if(!t.target.classList.contains("simon-game__tile")||this.running||!this.active)return;const e=Number(t.target.dataset.tile);this._checkCurrentStep(e)}_checkCurrentStep(t){t===this.pattern[this.step]?(this.step++,this._applyStyles(t,!0,!0),this.step===this.pattern.length&&(this.score++,this.#r.textContent=String(this.score).padStart(2,"0"),this.running=!0,setTimeout(this._startRound.bind(this),800))):this._endGame()}_endGame(){this.#i.style.display="block",this.#r.textContent="00","on"===this.volumeBtn.dataset.volume&&this.errorAudio.play(),setTimeout((()=>{this.#i.style.display="none",this.#s.classList.remove("simon-game__inner-circle--inactive")}),500),0!==this.score&&this._checkHighscore(),this._initVariables()}_checkHighscore(){const t=window.localStorage.getItem("highscore");t&&t>=this.score||(window.localStorage.setItem("highscore",this.score),this.#o&&(highscoreLabel.textContent=`Highscore: ${this.score}`),this.#a.querySelector(".form__header span").textContent=String(this.score).padStart(2,"0"),"undefined"!==document.querySelector("main").dataset.user&&fetch("/api/v1/users/updateUser",{headers:{"Content-Type":"application/json"},method:"PATCH",body:JSON.stringify({highscore:this.score})}).then((t=>t.json())).then((t=>console.log(t))),this.#a.closest(".form-modal").classList.toggle("hidden"))}_applyStyles(t,e=!0,s=!1){e&&(this.tiles.forEach((e=>{e.classList.add("simon-game__tile--"+(Number(e.dataset.tile)===t?"active":"inactive")),Number(e.dataset.tile)===t&&"on"===this.volumeBtn.dataset.volume&&this.audios.find((t=>t.currentSrc.split("/").at(-1)===e.dataset.audio)).play()})),setTimeout(this._removeStyles.bind(this),s?200:700))}_removeStyles(){this.tiles.forEach((t=>{t.classList.remove([...t.classList].find((t=>"simon-game__tile--active"===t||"simon-game__tile--inactive"===t)))}))}_generateRandomNumber(){return Math.floor(4*Math.random())+1}}})()})();