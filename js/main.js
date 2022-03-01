const StartPage = document.getElementById('StartPage'),
      MainPage = document.getElementById('MainPage'),
      ImageList = document.getElementById('ImageList'),
      ImageNumberCounter = document.getElementById('ImageNumber')

let ImageNumber
let CurrentImageNumber = 1
let IntervalId

// Set event
document.getElementById('FullScreen').addEventListener('click', function(){
    SetFullScreen()
})
document.onfullscreenchange = function( event ) {
    if(document.fullscreenElement === null) {
        ReleaseFullScreen()
    } else {
        MainPage.style.backgroundSize = 'cover'
        ChangePicture()
        IntervalId = setInterval(ChangePicture, 1800);
    }
}
ImageNumberCounter.addEventListener('change', (event) => {
    ImageNumber = ImageNumberCounter.value
    SetList(ImageNumber)
});
MainPage.addEventListener('click', (event) => {
    document.exitFullscreen()
});

//Methods
function SetFullScreen() {
    document.body.requestFullscreen()
    StartPage.classList.add('invisible')
    MainPage.classList.remove('invisible')
}
function ReleaseFullScreen() {
    StartPage.classList.remove('invisible')
    MainPage.classList.add('invisible')
    clearInterval(IntervalId)
}
function SetList(n) {
    ImageNumber = ImageNumberCounter.value
    while(ImageList.firstChild){
        ImageList.removeChild(ImageList.firstChild)
    }
    for (let i = 0; i < n; i++) {
        const liElement = document.createElement('li')
        liElement.style.background = `url(./images/img${i+1}.jpg)`
        liElement.style.backgroundSize = 'cover'
        liElement.addEventListener('click', (event) => {
            CurrentImageNumber = i+1
            SetFullScreen()
        })
        ImageList.appendChild(liElement)
    }
}
function ChangePicture() {
    MainPage.style.backgroundImage = `url(./images/img${CurrentImageNumber}.jpg)`
    MainPage.animate([
        {opacity: 0},
        {opacity: 1},
        {opacity: 1},
        {opacity: 1},
        {opacity: 1},
        {opacity: 1},
        {opacity: 1},
        {opacity: 0}
    ],1800)
    console.log(CurrentImageNumber, ImageNumber)
    if (CurrentImageNumber == ImageNumber) {
        CurrentImageNumber = 1
    } else {
        CurrentImageNumber ++
    }
}

//Mounted
MainPage.classList.add('invisible')

SetList(ImageNumberCounter.value = 15)
ImageNumberCounter.focus()