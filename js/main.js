
const select = document.querySelector('select');
const allLang = ['en', 'sv', 'uk'];

let  newL = localStorage.getItem('lang');

if (newL) {
    location.href = window.location.pathname + '#'+ newL;
    select.value=newL;
    changeLanguage();
}

function changeLink(el, hash) {
    let newLink = el.href.slice(0, -7);
    newLink = newLink + `_${hash}.pdf`;
    el.href = newLink;  
}

function changeLanguage() {
    let hash = window.location.hash;
    hash = hash.substring(1);
  
    if (!allLang.includes(hash)) {
        location.href = window.location.pathname + '#sv';
    }
    select.value = hash;
    for (let key in langArr) {
        let elem = document.querySelector('.lng-' + key);
        if (elem) {
            elem.innerHTML = langArr[key][hash];
        }
    }
    let elemLink = document.querySelectorAll('.link-lng');
    elemLink.forEach(el => changeLink(el, hash));    
}

function changeURLLanguage() {
     let lang = select.value;
    location.href = window.location.pathname + '#' + lang;
    localStorage.setItem('lang',lang);
    changeLanguage();   
}
select.addEventListener('change', changeURLLanguage);


const menuBtn = document.querySelector('.menu__btn');
const menuList = document.querySelector('.menu__list');
menuBtn.addEventListener('click', function () {
    menuBtn.classList.toggle('btn-active');
    menuList.classList.toggle('list-active');
});

$(function () {
    $('.slider').slick({
        dots: true,
       
        arrows: false,
        infinite: true,
        autoplay: true,
        speed: 80,
        slidesToShow: 4,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3 ,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });


});


