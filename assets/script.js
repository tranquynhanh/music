const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const songName = $("header h2")
const thumb = $(".cd-thumb")
const audio = $("#audio")
const playBtn = $(".btn-toggle-play")
const player = $(".player")
const progress = $("#progress")
const prev = $('.btn-prev')
const next = $('.btn-next')
const random = $('.btn-random')
const repeat = $('.btn-repeat')
const songClick = $('.song')

const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    songs : [
        {
            name: 'To love you more',
            singer: "Glee cast",
            path: "./assets/music/To Love You More - Glee Cast.mp3",
            img: "./assets/img/1.jfif"
        },

        {
            name: 'Like my father',
            singer: "Jax",
            path: "./assets/music/Like My Father - Jax.mp3",
            img: "./assets/img/maxresdefault.jpg"
        },

        {
            name: 'Mua Mua ngau nam canh',
            singer: "Vu",
            path: "./assets/music/Mua Mua Ngau Nam Canh - Vu_ Skylines Bey.mp3",
            img: "./assets/img/artworks-000184269138-tti3js-t500x500.jpg"
        },

        {
            name: 'If we hold on together',
            singer: "Diana Ross",
            path: "./assets/music/If We Hold On Together - Diana Ross.mp3",
            img: "./assets/img/If_We_Hold_on_Together.jpg"
        },

        {
            name: 'Ha noi gen troi',
            singer: "Vu, Gung",
            path: "./assets/music/Ha Noi Gen Troi - Vu_ Gung.mp3",
            img: "./assets/img/2.jfif"
        },
    ],

    render : function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.img}')">
                    </div>
                    <div class="body">
                      <h3 class="title">${song.name}</h3>
                      <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                      <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })

        $('.playlist').innerHTML = htmls.join(" ")
    },

    currentSong : function() {
        return this.songs[this.currentIndex]
    },
     
    loadCurrentSong : function() {
        songName.innerHTML = this.currentSong().name
        thumb.style.backgroundImage = `url('${this.currentSong().img}')`
        audio.src = this.currentSong().path
    },

    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    randomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length - 1)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    handleEvent : function(){ 
        const _this = this
        const cd = $(".cd") 
        const cdWidth = cd.offsetWidth

        const thumbAnimation = thumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })

        thumbAnimation.pause()

        document.onscroll = function() {
            const scrollY = window.scrollY || document.documentElement.scrollTop
            const newCDWidth = cdWidth - scrollY
            cd.style.width = newCDWidth > 0 ? newCDWidth + "px" : 0
            cd.style.opacity = newCDWidth / cdWidth
        }

        playBtn.onclick = function() {
            if (!_this.isPlaying) {
                audio.play()
            } else {
                audio.pause()
            }
        }

        audio.onplay = function () {
            player.classList.add("playing")
            _this.isPlaying = true
            thumbAnimation.play()
        }

        audio.onpause = function () {
            player.classList.remove("playing")
            _this.isPlaying = false
            thumbAnimation.pause()
        }

        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        progress.onchange = function(e) {
            audio.currentTime = e.target.value / 100 * audio.duration
        }

        next.onclick = function() {
            if (!_this.isRandom) {
                _this.nextSong()
            } else {
                _this.randomSong()
                
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        } 
        prev.onclick = function() {
            if (!_this.isRandom) {
                _this.prevSong()
            } else {
                _this.randomSong()
            }        
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        } 

        random.onclick = function() {
            _this.isRandom = !_this.isRandom
            random.classList.toggle("active", _this.isRandom)
        }

        repeat.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeat.classList.toggle("active", _this.isRepeat)
        }

        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                next.click()
            }
        } 

        $('.playlist').onclick = function (e) {
            const songPlayed = e.target.closest('.song:not(.active)') 
            if ( songPlayed || e.target.closest(".option")) {
                if (songPlayed) {
                    _this.currentIndex = Number(songPlayed.dataset.index )
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }
            }
        }

    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 300)
    },

    start : function() {
        this.currentSong()
        this.handleEvent()
        this.loadCurrentSong()
        this.render()
    }
}

app.start()