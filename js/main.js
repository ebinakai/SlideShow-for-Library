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
            MinSeconds: 5,
            StartFlag: false,
            SettingFlag: false,
            Frames: [{opacity: 0},{opacity: 1},{opacity: 0}]
        },
        mounted: function() {
            this.SlideSeconds = localStorage.getItem('SlideSeconds')
            this.SetList()
            if(this.SlideSeconds == null){
                this.SlideSeconds = 5
            }
            this.ViewSlideSeconds = this.SlideSeconds

            // GALLERYの変更を保存
            const observer = new MutationObserver(function() {
                let SaveImageList = []
                for (let ele of document.querySelectorAll('#ImageList li')){
                    SaveImageList.push({"name":ele.id})
                }
                localStorage.setItem('SavedImages', JSON.stringify(SaveImageList))
            })
            observer.observe(this.$('ImageList'), {childList: true})
        },
        methods: {
            $: function (tagId){
                return document.getElementById(tagId);
            },
            SetList: function() {
                // 情報を取得
                this.Images = JSON.parse(localStorage.getItem('SavedImages'))
                this.ImageNumber = this.Images.length
                const ImageList = this.$('ImageList')

                // GALLERYをリセット
                while(ImageList.firstChild){
                    ImageList.removeChild(ImageList.firstChild)
                }
                this.Images.forEach((Image, index) => {
                    // GALLERYのliタグを作成
                    const liElement = document.createElement('li')
                    const id = index
                    liElement.draggable = true
                    liElement.id = Image.name
                    liElement.style.background = `url(./images/${Image.name})`
                    liElement.style.backgroundSize = 'cover'
                    liElement.style.backgroundPosition = "center center"
                    liElement.addEventListener('click', () => {
                        this.CurrentImageNumber = id
                        this.SetFullScreen()
                    })
                    
                    // 右クリックイベント追加
                    liElement.addEventListener('contextmenu',function(e){
                        if(window.confirm("delete?")){
                            this.remove()
                        }
                    })
                    
                    //ドラッグアンドドロップ制御
                    liElement.ondragstart = function(e){
                        e.dataTransfer.setData('text/plain',e.target.id)
                    }
                    liElement.ondragover = function (e){
                        e.preventDefault()

                        let rect = this.getBoundingClientRect();
		                if (e.clientX-rect.left < (this.clientWidth / 2)) {
                            this.style.borderLeft = '100px solid #D9BAC2'
                            this.style.borderRight = ''
                        } else {
                            this.style.borderLeft = ''
                            this.style.borderRight = '100px solid #D9BAC2'
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
                    }

                    // タグの追加
                    ImageList.appendChild(liElement)
                })
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

                let map = new Map(SaveImageList.map(o => [o.name, o]))
                SaveImageList = Array.from(map.values())

                localStorage.setItem('SavedImages', JSON.stringify(SaveImageList))
                this.SetList()
            },
            StartSlide: function() {
                this.CurrentImageNumber = 0
                this.SetFullScreen()
            },
            SetFrames: function() {
                for (let i=0; i<this.SlideSeconds-3; i++){
                    this.Frames.splice(1,0,{opacity: 1})
                }
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
                if(this.SlideSeconds < this.MinSeconds) {
                    this.SlideSeconds = this.MinSeconds
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
