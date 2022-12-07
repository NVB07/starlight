const $$ = document.querySelectorAll.bind(document);
const $ = document.querySelector.bind(document);



(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    window.requestAnimationFrame = requestAnimationFrame;
})();

// Terrain stuff.
var background = document.getElementById("bgCanvas"),
    bgCtx = background.getContext("2d"),
    width = window.innerWidth,
    height = document.body.offsetHeight;

(height < 400) ? height = 400 : height;

background.width = width;
background.height = height;

function Terrain(options) {
    options = options || {};
    this.terrain = document.createElement("canvas");
    this.terCtx = this.terrain.getContext("2d");
    this.scrollDelay = options.scrollDelay || 90;
    this.lastScroll = new Date().getTime();

    this.terrain.width = width;
    this.terrain.height = height;
    this.fillStyle = options.fillStyle || "#191D4C";
    this.mHeight = options.mHeight || height;

    // generate
    this.points = [];

    var displacement = options.displacement || 140,
        power = Math.pow(2, Math.ceil(Math.log(width) / (Math.log(2))));

    // set the start height and end height for the terrain
    this.points[0] = this.mHeight;//(this.mHeight - (Math.random() * this.mHeight / 2)) - displacement;
    this.points[power] = this.points[0];

    // create the rest of the points
    for (var i = 1; i < power; i *= 2) {
        for (var j = (power / i) / 2; j < power; j += power / i) {
            this.points[j] = ((this.points[j - (power / i) / 2] + this.points[j + (power / i) / 2]) / 2) + Math.floor(Math.random() * -displacement + displacement);
        }
        displacement *= 0.6;
    }

    document.body.appendChild(this.terrain);
}

Terrain.prototype.update = function () {
    // draw the terrain
    this.terCtx.clearRect(0, 0, width, height);
    this.terCtx.fillStyle = this.fillStyle;
    
    if (new Date().getTime() > this.lastScroll + this.scrollDelay) {
        this.lastScroll = new Date().getTime();
        this.points.push(this.points.shift());
    }

    this.terCtx.beginPath();
    for (var i = 0; i <= width; i++) {
        if (i === 0) {
            this.terCtx.moveTo(0, this.points[0]);
        } else if (this.points[i] !== undefined) {
            this.terCtx.lineTo(i, this.points[i]);
        }
    }

    this.terCtx.lineTo(width, this.terrain.height);
    this.terCtx.lineTo(0, this.terrain.height);
    this.terCtx.lineTo(0, this.points[0]);
    this.terCtx.fill();
}


// Second canvas used for the stars
bgCtx.fillStyle = '#05004c';
bgCtx.fillRect(0, 0, width, height);

// stars
function Star(options) {
    this.size = Math.random() * 2;
    this.speed = Math.random() * .05;
    this.x = options.x;
    this.y = options.y;
}

Star.prototype.reset = function () {
    this.size = Math.random() * 2;
    this.speed = Math.random() * .05;
    this.x = width;
    this.y = Math.random() * height;
}

Star.prototype.update = function () {
    this.x -= this.speed;
    if (this.x < 0) {
        this.reset();
    } else {
        bgCtx.fillRect(this.x, this.y, this.size, this.size);
    }
}

function ShootingStar() {
    this.reset();
}

ShootingStar.prototype.reset = function () {
    this.x = Math.random() * width;
    this.y = 0;
    this.len = (Math.random() * 80) + 10;
    this.speed = (Math.random() * 10) + 6;
    this.size = (Math.random() * 1) + 0.1;
    // this is used so the shooting stars arent constant
    this.waitTime = new Date().getTime() + (Math.random() * 3000) + 500;
    this.active = false;
}

ShootingStar.prototype.update = function () {
    if (this.active) {
        this.x -= this.speed;
        this.y += this.speed;
        if (this.x < 0 || this.y >= height) {
            this.reset();
        } else {
            bgCtx.lineWidth = this.size;
            bgCtx.beginPath();
            bgCtx.moveTo(this.x, this.y);
            bgCtx.lineTo(this.x + this.len, this.y - this.len);
            bgCtx.stroke();
        }
    } else {
        if (this.waitTime < new Date().getTime()) {
            this.active = true;
        }
    }
}

var entities = [];

// init the stars
for (var i = 0; i < height; i++) {
    entities.push(new Star({
        x: Math.random() * width,
        y: Math.random() * height
    }));
}

// Add 2 shooting stars that just cycle.
entities.push(new ShootingStar());
entities.push(new ShootingStar());
entities.push(new Terrain({mHeight : (height/2)-120}));
entities.push(new Terrain({displacement : 120, scrollDelay : 50, fillStyle : "rgb(17,20,40)", mHeight : (height/2)-60}));
entities.push(new Terrain({displacement : 100, scrollDelay : 20, fillStyle : "rgb(10,10,5)", mHeight : height/2}));

//animate background
function animate() {
    bgCtx.fillStyle = '#110E19';
    bgCtx.fillRect(0, 0, width, height);
    bgCtx.fillStyle = '#ffffff';
    bgCtx.strokeStyle = '#ffffff';

    var entLen = entities.length;

    while (entLen--) {
        entities[entLen].update();
    }
    requestAnimationFrame(animate);
}
animate();



//MUSIC

// khai báo hằng, mảng mp3
const audio = $('#audio')
const back = $("#back-btn")
const play = $('#play-btn')
const pause = $('#pause-btn')
const next = $("#next-btn")
const nameSong = $$(".name-music")
const nameHead = $(".head")
const nameSinger = $(".singer-name")
const photo = $("#img")
const playList = [
    {
        src:"./mp3/CuChillThoi.mp3",
        nameSong: "Cứ Chill Thôi ",
        singer: "Chillies ft Suni Hạ Linh & Rhymastic",
        img: "https://lyrics-hot.com/wp-content/uploads/2021/02/loi-bai-hat-cu-chill-thoi-640.jpg"
    },
    {
        src:"./mp3/XeDap.mp3",
        nameSong:" Xe Đạp ",
        singer: "CM1X",
        img: "https://i.ytimg.com/vi/3v3YYpVrEuA/maxresdefault.jpg"

    },
    {
        src:"./mp3/MuonRuouToTinh.mp3",
        nameSong:" Mượn Rượu Tỏ Tình",
        singer: "BIGDADDY x EMILY",
        img: "https://i.ytimg.com/vi/aGUQsb31TEw/hq720.jpg"

    },

    {
        src:"./mp3/HaiMuoiHai.mp3",
        nameSong: "Hai Mươi Hai",
        singer: "amme x Hứa Kim Tuyền",
        img: "https://i.ytimg.com/vi/n2iFnPaAsnU/maxresdefault.jpg"
    },
    {
        src:"./mp3/AnhMetRoi.mp3",
        nameSong:" Anh Mệt Rồi",
        singer: "Anh Quân Idol x Freak D",
        img: "https://i.ytimg.com/vi/wAQnEYVcOq4/maxresdefault.jpg"

    },
    {
        src:"./mp3/AnhSeQuenEmMa.mp3",
        nameSong:" Anh Sẽ Quên Em Mà",
        singer: "NIT ft Sing",
        img: "https://i.ytimg.com/vi/tYNX2E6v6jU/maxresdefault.jpg"

    },
    {
        src:"./mp3/ChungTaCuaHienTai.mp3",
        nameSong:" Chúng Ta Của Hiện Tại- lofi",
        singer: "MTP x CM1X",
        img: "https://media.vov.vn/sites/default/files/styles/large/public/2021-02/chungtacuahientai.jpg"

    },
    {
        src:"./mp3/BuongDoiTayNhauRa.mp3",
        nameSong:" Buông Đôi Tay Nhau Ra",
        singer: "Sơn Tùng-MTP ",
        img: "https://i.ytimg.com/vi/LCyo565N_5w/maxresdefault.jpg"

    },
    {
        src:"./mp3/HayTraoChoAnh.mp3",
        nameSong:"Hãy Trao Cho Anh",
        singer: "Sơn Tùng-MTP ",
        img: "https://amthanhthudo.com/wp-content/uploads/hay-trao-cho-anh.jpg"

    },
    {
        src:"./mp3/LacTroi.mp3",
        nameSong:"Lạc Trôi",
        singer: "Sơn Tùng-MTP ",
        img: "https://i.ytimg.com/vi/DrY_K0mT-As/maxresdefault.jpg"

    },
    {
        src:"./mp3/EmCuaNgayHomQua.mp3",
        nameSong:"Em Của Ngày Hôm Qua",
        singer: "Sơn Tùng-MTP ",
        img: "https://loretofest.org/cdn/files/loi-bai-hat-em-cua-ngay-hom-qua.jpg"

    },
    {
        src:"./mp3/HoaVoSac.mp3",
        nameSong:"Hoa Vô Sắc",
        singer: "K-ICM , Jack ",
        img: "https://i.ytimg.com/vi/gZKkD3edFaE/maxresdefault.jpg"

    },
    {
        src:"./mp3/ChungTaCuaSauNay.mp3",
        nameSong:" Chúng Ta Của Sau Này",
        singer: "T.R.I",
        img: "https://avatar-ex-swe.nixcdn.com/song/share/2021/01/27/f/1/e/c/1611738359456.jpg"

    },
    {
        src:"./mp3/HetThuongCanNho.mp3",
        nameSong:" Hết Thương Cạn Nhớ",
        singer: "Đức Phúc",
        img: "https://i.ytimg.com/vi/DZDYZ9nRHfU/maxresdefault.jpg"

    },
    {
        src:"./mp3/DungLoAnhDoiMa.mp3",
        nameSong:" Đừng Lo Anh Đợi Mà",
        singer: "Mr.Siro",
        img: "https://i.ytimg.com/vi/BnWiFq0AxQc/maxresdefault.jpg"

    },
    {
        src:"./mp3/HoaNoKhongMau.mp3",
        nameSong:" Hoa Nở Không Màu",
        singer: "Hoài Lâm x Freak D",
        img: "https://i.ytimg.com/vi/y_6aSG2yfe8/mqdefault.jpg"

    },
    {
        src:"./mp3/MuaHaNamAy.mp3",
        nameSong:" Mùa Hạ Năm Ấy",
        singer: "Linh",
        img: "https://i.ytimg.com/vi/bbiXiY_Ec_c/sddefault.jpg"

    },
    {
        src:"./mp3/NhuAnhDaThayEm.mp3",
        nameSong:"Như Anh Đã Thấy Em",
        singer: "Phúc XP x Freak D",
        img: "https://i.ytimg.com/vi/cPbp2iFaZRo/maxresdefault.jpg"

    },
    {
        src:"./mp3/PhaiChangEmDaYeu.mp3",
        nameSong:" Phải Chăng Em Đã Yêu",
        singer: "Juky San ft Redt x Freak D ",
        img: "https://i.ytimg.com/vi/O81_4VAson4/maxresdefault.jpg"

    },
    {
        src:"./mp3/SinhRaDaLaThuDoiLapNhau.mp3",
        nameSong:" Sinh Ra Đã Là Thứ Đối Lập Nhau",
        singer: "Emcee L (Da LAB) ft. Badbies",
        img: "https://i.ytimg.com/vi/redFrGBZoJY/maxresdefault.jpg"

    },
    {
        src:"./mp3/TinhKaNgotNgao.mp3",
        nameSong:"Tình Ka Ngọt Ngào",
        singer: "LẬP NGUYÊN x YẾN NỒI CƠM ĐIỆN",
        img: "https://i.ytimg.com/vi/Yr7FIIshNxo/maxresdefault.jpg"

    },
    {
        src:"./mp3/Yeu1NguoiCoLe.mp3",
        nameSong:"Yêu Một Người Có Lẽ",
        singer: " Lou Hoàng - Miu Lê",
        img: "https://i.ytimg.com/vi/w2DBMrXJDIo/sddefault.jpg"

    },
    {
        src:"./mp3/LegendsNeverDie.mp3",
        nameSong:"Legends Never Die",
        singer: " Against The Curent-World 2017",
        img: "https://i.ytimg.com/vi/r6zIGXun57U/maxresdefault.jpg"

    },
]

const textclip = $(".text-box")

function audioPlay(){
    audio.play();
    play.style.display = 'none'
    pause.style.display = 'block'
    textclip.classList.add("move")
    nameHead.textContent = playList[i].nameSong
}


function audioPause(){
    audio.pause();
    pause.style.display = 'none'
    play.style.display = 'block'
    textclip.classList.remove("move")
}

function audioNext(){
    i++;
    if( i >= playList.length ){
        i = 0;
    } 
    audio.src = playList[i].src
    nameSinger.textContent = playList[i].singer
    for( let j = 0 ; j < nameSong.length; j++){
        nameSong[j].textContent = playList[i].nameSong
    }
    photo.src = playList[i].img
    nameHead.textContent = playList[i].nameSong
    textclip.classList.add("move")
    audioPlay();
}

function audioBack(){
    i--;
    if( i < 0 ){
        i = playList.length -1 ;
    }
    audio.src = playList[i].src
    nameSinger.textContent = playList[i].singer
    for( let j = 0 ; j < nameSong.length; j++){
        nameSong[j].textContent = playList[i].nameSong
    }
    photo.src = playList[i].img
    nameHead.textContent = playList[i].nameSong
    textclip.classList.add("move")
    audioPlay();
}



play.addEventListener("click", audioPlay);// click play
pause.addEventListener("click", audioPause); //click pause

// xử lí next / back mp3
var i = 0;
    audio.src = playList[i].src
    nameSinger.textContent = playList[i].singer
    for( let j = 0 ; j < nameSong.length; j++){
        nameSong[j].textContent = playList[i].nameSong
    }
    photo.src = playList[i].img


    // xử lí ấn phím Space, Left, Right ( Play/Pause, Back, Next)
    function keydownHandler(evt) {
        if( audio.paused && evt.keyCode == 32){
            audioPlay();
        }
        else if(audio.play && evt.keyCode == 32){
            audioPause();
        };
        if (evt.keyCode == 39){
            audioNext();
        }
        else if (evt.keyCode == 37){
            audioBack();
        }
    }


    next.addEventListener("click", audioNext);// click next
    back.addEventListener("click", audioBack); // click back

    // next khi kết thúc  mp3
    audio.onended = function(){
        next.click();
    }


 
    // random link mp3
//    function random() {
    
//     var ran = Math.floor(Math.random() * 3);
//     var src = playList[ran]
//     console.log(src)
//     audio.src= src;
//    }
