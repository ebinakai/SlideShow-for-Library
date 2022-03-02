(function () {
    'use strict';

    var vm = new Vue({
        el: '#app',
        data: {
            ImageNumber: 0,
            CurrentImageNumber: 0,
            IntervalId: 0,
            StartFlag: false,
            Images: [],
            Speed: 10000
        },
        mounted: function() {
            this.SetList()
        },
        methods: {
            $: function (tagId){
                return document.getElementById(tagId);
            },
            SetList: function() {
                this.Images = JSON.parse(localStorage.getItem('SavedImages'))
                this.ImageNumber = this.Images.length
                const ImageList = this.$('ImageList')
                while(ImageList.firstChild){
                    ImageList.removeChild(ImageList.firstChild)
                }
                for (let i=0; i < this.Images.length; i++){
                    const liElement = document.createElement('li')
                    const id = i
                    liElement.style.background = `url(./images/${this.Images[i].name})`
                    liElement.style.backgroundSize = 'cover'
                    liElement.addEventListener('click', () => {
                        this.CurrentImageNumber = id
                        this.SetFullScreen()
                    })
                    ImageList.appendChild(liElement)
                }
            },
            SetFullScreen: function() {
                this.StartFlag = true
                document.body.requestFullscreen()
            },
            ReleaseFullScreen: function() {
                this.$('MainPage').style.background = "#F2F2F2"
                this.StartFlag = false
                clearInterval(this.IntervalId);
                setTimeout(this.SetList,1)
            },
            ChangePicture: function() {
                const MainPage =  this.$('MainPage')
                const i = this.CurrentImageNumber
                MainPage.style.backgroundImage = `url(./images/${this.Images[i].name})`
                MainPage.style.backgroundSize = 'cover'

                MainPage.animate([
                    {opacity: 0},
                    {opacity: 1},
                    {opacity: 1},
                    {opacity: 1},
                    {opacity: 1},
                    {opacity: 1},
                    {opacity: 0}
                ],this.Speed+10)
                
                console.log(this.CurrentImageNumber, this.ImageNumber)
                if (this.CurrentImageNumber == this.ImageNumber) {
                    this.CurrentImageNumber = 1
                } else {
                    this.CurrentImageNumber ++
                }
            },
            onImageUploaded: function(e) {
                this.Images = e.target.files
                this.ImageNumber = this.Images.length
                let SaveImageList = []
                for (let i=0; i < this.ImageNumber; i++){
                    SaveImageList.push({"name":this.Images[i].name})
                }
                localStorage.setItem('SavedImages', JSON.stringify(SaveImageList))
                this.SetList()
            },
            FreshImages: function(){
                localStorage.setItem('SavedImages', JSON.stringify([]))
                this.SetList()
            }
        },
        watch: {
            Images: function() {
                this.ImageNumber = this.Images.length
            }
        }
    });
    document.onfullscreenchange = function() {
        if(document.fullscreenElement === null) {
            vm.ReleaseFullScreen()
        } else {
            vm.ChangePicture()
            vm.IntervalId = setInterval(vm.ChangePicture.bind(vm), vm.Speed);
        }
    }
})();
