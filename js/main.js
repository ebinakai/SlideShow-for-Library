const StartPage = document.getElementById('StartPage'),
      MainPage = document.getElementById('MainPage')

MainPage.classList.add('invisible')


document.getElementById('FullScreen').addEventListener('click', function(){
    document.body.requestFullscreen()
    StartPage.classList.add('invisible')
    MainPage.classList.remove('invisible')
});
document.getElementById('FullScreenRelease').addEventListener('click', function(){
    document.exitFullscreen()
    StartPage.classList.remove('invisible')
    MainPage.classList.add('invisible')
});