(function () {
    'use strict';

    var vm = new Vue({
        el: '#app',
        data: {
            ImageNumber: 0,
            CurrentImageNumber: 0,
            SlideSeconds: 0,
            ViewSlideSeconds: 0,
            IntervalId: 0,
            StartFlag: false,
            SettingFlag: false,
            Images: []
        },
        mounted: function() {
            this.SetList()
            this.SlideSeconds = localStorage.getItem('SlideSeconds')
            if(this.SlideSeconds == null){
                this.SlideSeconds = 5000
            }
            this.ViewSlideSeconds = this.SlideSeconds
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
                if(document.fullscreenElement !== null) {
                    document.exitFullscreen()
                }
                this.StartFlag = false
                clearInterval(this.IntervalId)
                setTimeout(this.SetList,1)
            },
            ChangePicture: function() {
                const MainPage =  this.$('MainPage')
                const i = this.CurrentImageNumber
                MainPage.style.backgroundImage = `url(./images/${this.Images[i].name})`
                MainPage.style.backgroundSize = 'cover'

                console.log(this.CurrentImageNumber, this.ImageNumber)
                if (this.CurrentImageNumber == this.ImageNumber) {
                    this.CurrentImageNumber = 0
                } else {
                    this.CurrentImageNumber ++
                }

                this.$('SlideBar').animate([
                    {width: '0'},
                    {width: '100%'}
                ], this.SlideSeconds)
                
                frames = [{opacity: 0}]
                for (let i=0;i<this.SlideSeconds/1000-2;i++){
                    frames.push({opacity: 1})
                }
                frames.push({opacity: 0})


                MainPage.animate(frames , parseInt(this.SlideSeconds)+parseInt(10))
            },
            onImageUploaded: function(e) {
                this.Images = e.target.files
                this.ImageNumber = this.Images.length
                let SaveImageList = (JSON.parse(localStorage.getItem('SavedImages')) || [])
                
                for (let i=0; i < this.ImageNumber; i++){
                    SaveImageList.push({"name":this.Images[i].name})
                }
                localStorage.setItem('SavedImages', JSON.stringify(SaveImageList))
                this.SetList()
            },
            StartSlide: function() {
                this.CurrentImageNumber = 0
                this.SetFullScreen()
            },
            FreshImages: function(){
                localStorage.setItem('SavedImages', JSON.stringify([]))
                this.SetList()
            },
            SettingShow: function(){
                this.SettingFlag = true
            },
            SettingClose: function(){
                this.SettingFlag = false
                this.SlideSeconds = this.ViewSlideSeconds
            }
        },
        watch: {
            Images: function() {
                this.ImageNumber = this.Images.length - 1
            },
            SlideSeconds: function() {
                if(this.SlideSeconds < 5000) {
                    this.SlideSeconds = 5000
                    this.ViewSlideSeconds = this.SlideSeconds
                }
                localStorage.setItem('SlideSeconds', this.SlideSeconds)
            }
        }
    });
    document.onfullscreenchange = function() {
        if(document.fullscreenElement === null) {
            vm.ReleaseFullScreen()
        } else {
            vm.ChangePicture()
            vm.IntervalId = setInterval(vm.ChangePicture.bind(vm), vm.SlideSeconds);
        }
    }
})();
