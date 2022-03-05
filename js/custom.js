(function () {
    'use strict';

    var vm = new Vue({
        el: '#app',
        data: {
            Images: [],
            ImageNumber: 0,
            CurrentImageNumber: 0,
            ViewSlideSeconds: 0,
            SlideSeconds: 0,
            IntervalId: 0,
            StartFlag: false,
            SettingFlag: false,
            Frames: [{opacity: 0},{opacity: 0}]
        },
        mounted: function() {
            this.SetList()
            this.SlideSeconds = localStorage.getItem('SlideSeconds')
            if(this.SlideSeconds == null){
                this.SlideSeconds = 5
            }
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
                    // GALLERYのliタグを作成
                    const liElement = document.createElement('li')
                    const id = i
                    liElement.draggable = true
                    liElement.id = this.Images[i].name
                    liElement.style.background = `url(./images/${this.Images[i].name})`
                    liElement.style.backgroundSize = 'cover'
                    liElement.style.backgroundPosition = "center center"
                    liElement.addEventListener('click', () => {
                        this.CurrentImageNumber = id
                        this.SetFullScreen()
                    })

                    //ドラッグアンドドロップ制御
                    liElement.ondragstart = function(e){
                        e.dataTransfer.setData('text/plain',e.target.id)
                    }
                    liElement.ondragover = function (e){
                        e.preventDefault()

                        let rect = this.getBoundingClientRect();
		                if (e.clientX-rect.left < (this.clientWidth / 2)) {
                            this.style.borderLeft = '45px solid #D9BAC2'
                            this.style.borderRight = ''
                        } else {
                            this.style.borderLeft = ''
                            this.style.borderRight = '45px solid #D9BAC2'
                        }
                    }
                    liElement.ondragleave = function (){
                        this.style.borderLeft = ''
                        this.style.borderRight = ''
                    }
                    liElement.ondrop = function (e){
                        e.preventDefault();
                        let rect = this.getBoundingClientRect();
                        let elm_id = e.dataTransfer.getData('text/plain');
                        
                        let elm_drag = document.getElementById(elm_id);
		                if (e.clientX-rect.left < (this.clientWidth / 2)) {
                            this.parentNode.insertBefore(elm_drag, this);
                            this.style.borderLeft = ''
                        } else {
                            this.parentNode.insertBefore(elm_drag, this.nextSibling)
                            this.style.borderRight = ''
                        }
                        let SaveImageList = []
                        for (let ele of document.querySelectorAll('#ImageList li')){
                            SaveImageList.push({"name":ele.id})
                        }
                        localStorage.setItem('SavedImages', JSON.stringify(SaveImageList))
                    }

                    // タグの追加
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
                ], this.SlideSeconds*1000)

                MainPage.animate(
                    this.Frames, 
                    parseInt(this.SlideSeconds)*1000 + parseInt(10))
            },
            onImageUploaded: function(e) {
                this.Images = e.target.files
                this.ImageNumber = this.Images.length
                let SaveImageList = (JSON.parse(localStorage.getItem('SavedImages')) || [])
                
                for (let Image of this.Images){
                    SaveImageList.push({"name":Image.name})
                }
                localStorage.setItem('SavedImages', JSON.stringify(SaveImageList))
                this.SetList()
            },
            StartSlide: function() {
                this.CurrentImageNumber = 0
                this.SetFullScreen()
            },
            SetFrames: function() {
                for (let i=0;i<this.SlideSeconds-2;i++){
                    this.Frames.splice(1,0,{opacity: 1})
                }
            },
            FreshImages: function(){
                localStorage.setItem('SavedImages', JSON.stringify([]))
                this.SetList()
            },
            SettingShow: function(){
            this.ViewSlideSeconds = this.SlideSeconds
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
                if(this.SlideSeconds < 5) {
                    this.SlideSeconds = 5
                    this.ViewSlideSeconds = this.SlideSeconds
                }
                localStorage.setItem('SlideSeconds', this.SlideSeconds)
            }
        }
    });
    // フルスクリーンの切り替わりを監視
    document.onfullscreenchange = function() {
        if(document.fullscreenElement === null) {
            vm.ReleaseFullScreen()
        } else {
            vm.SetFrames()
            vm.ChangePicture()
            vm.IntervalId = setInterval(vm.ChangePicture.bind(vm), vm.SlideSeconds*1000);
        }
    }
})();
