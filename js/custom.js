(function () {
    'use strict';

    var vm = new Vue({
        el: '#app',
        data: {
            ImageNumber: 0,
            CurrentImageNumber: 1,
            IntervalId: 0,
            StartFlag: false,
            Images: []
        },
        mounted: function() {
            this.Images = JSON.parse(localStorage.getItem('SavedImages'))
            console.log(this.Images[0].name)
            this.SetList(this.ImageNumber)
        },
        methods: {
            $: function (tagId){
                return document.getElementById(tagId);
            },
            SetList: function(n) {
                const ImageList = this.$('ImageList')
                while(ImageList.firstChild){
                    ImageList.removeChild(ImageList.firstChild)
                }
                for (let i=0; i < this.Images.length; i++){
                    const liElement = document.createElement('li')
                    const id = i+1
                    liElement.style.background = `url(./images/${this.Images[i].name})`
                    liElement.style.backgroundSize = 'cover'
                    liElement.addEventListener('click', (event) => {
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
                clearInterval(this.IntervalId);
                this.StartFlag = false
                this.SetList(this.ImageNumber)
            },
            ChangePicture: function() {
                const MainPage =  this.$('MainPage')
                MainPage.style.backgroundImage = `url(./images/img${this.CurrentImageNumber}.jpg)`
                
                MainPage.style.opacity = 1
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
            }
        },
        watch: {
            ImageNumber: function() {
                this.SetList(this.ImageNumber)
            }
        }
    });
    document.onfullscreenchange = function ( event ) {
        if(document.fullscreenElement === null) {
            vm.ReleaseFullScreen()
        } else {
            vm.IntervalId = setInterval(vm.ChangePicture.bind(vm), 800);
        }
    }
})();
