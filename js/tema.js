//CUSTOMIZAÇÃO DO TEMA
const theme = document.getElementById('theme');

const themeModal = document.querySelector('.customize-theme');
const fontSizes = document.querySelectorAll('.choose-size span');
const root = document.querySelector(':root');
const colorPalette = document.querySelectorAll('.choose-color span');

const Bg1 = document.querySelector('.bg-1');
const Bg2 = document.querySelector('.bg-2');
const Bg3 = document.querySelector('.bg-3');

//Abrir modal
const openThemeModal = () => {
    themeModal.style.display = 'grid';
}

//Close Modal
const closeThemeModal = (e) => {
    if (e.target.classList.contains('customize-theme')) {
        themeModal.style.display = 'none';
    }
}

//Fechar Modal
themeModal.addEventListener('click', closeThemeModal);

theme.addEventListener('click', openThemeModal);

//Remove active do seletor de fontes
const removeSizeSelector = () => {
    fontSizes.forEach(size => {
        size.classList.remove('active');
    });
}

//Fontes
fontSizes.forEach(size => {
    size.addEventListener('click', () => {
        removeSizeSelector();
        let fontSize;
        size.classList.toggle('active');
        //alert('Muda tamanho');
        if (size.classList.contains('font-size-1')) {
            fontSize = '10px';
            root.style.setProperty('--sticky-top-left', '5.4rem');
            root.style.setProperty('--sticky-top-right', '5.4rem');
        } else if (size.classList.contains('font-size-2')) {
            fontSize = '13px';
            root.style.setProperty('--sticky-top-left', '5.4rem');
            root.style.setProperty('--sticky-top-right', '-7rem');
        } else if (size.classList.contains('font-size-3')) {
            fontSize = '16px';
            root.style.setProperty('--sticky-top-left', '-2rem');
            root.style.setProperty('--sticky-top-right', '-17rem');
        } else if (size.classList.contains('font-size-4')) {
            fontSize = '19px';
            root.style.setProperty('--sticky-top-left', '-5rem');
            root.style.setProperty('--sticky-top-right', '-25rem');
        } else if (size.classList.contains('font-size-5')) {
            fontSize = '22px';
            root.style.setProperty('--sticky-top-left', '-10rem');
            root.style.setProperty('--sticky-top-right', '-35rem');
        }
        //Modifiar elemento root
        document.querySelector('html').style.fontSize = fontSize;
    })
})

//remove cor ativa
const changeActiveColorClass = () => {
    colorPalette.forEach(colorPicker => {
        colorPicker.classList.remove('active');
    })
}

//Muda cores
colorPalette.forEach(color => {
    color.addEventListener('click', () => {
        changeActiveColorClass();
        let primaryHue;
        if (color.classList.contains('color-1')) {
            primaryHue = 252;
        } else if (color.classList.contains('color-2')) {
            primaryHue = 52;
        } else if (color.classList.contains('color-3')) {
            primaryHue = 352;
        } else if (color.classList.contains('color-4')) {
            primaryHue = 152;
        } else if (color.classList.contains('color-5')) {
            primaryHue = 202;
        }
        color.classList.add('active');
        root.style.setProperty('--primary-color-hue', primaryHue);
    });
})

//Muda Background
let lightColorLightness;
let whiteColorLightness;
let darkColorLightness;
let textColor;

const changeBG = () => {
    root.style.setProperty('--light-color-lightness', lightColorLightness);
    root.style.setProperty('--white-color-lightness', whiteColorLightness);
    root.style.setProperty('--dark-color-lightness', darkColorLightness);
    root.style.setProperty('--text-color', textColor);
}

Bg1.addEventListener('click', () => {
    darkColorLightness = '17%';
    whiteColorLightness = '100%';
    lightColorLightness = '95%';
    textColor = '#333';
    Bg1.classList.add('active');
    Bg2.classList.remove('active');
    Bg3.classList.remove('active');
    changeBG();
})

Bg2.addEventListener('click', () => {
    darkColorLightness = '95%';
    whiteColorLightness = '20%';
    lightColorLightness = '15%';
    textColor = '#dadada';
    Bg2.classList.add('active');
    Bg1.classList.remove('active');
    Bg3.classList.remove('active');
    changeBG();
})

Bg3.addEventListener('click', () => {
    darkColorLightness = '95%';
    whiteColorLightness = '10%';
    lightColorLightness = '0%';
    textColor = '#dadada';
    Bg3.classList.add('active');
    Bg1.classList.remove('active');
    Bg2.classList.remove('active');
    changeBG();
})