console.log("__lets write js code___")
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = " "
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
        <li>
                                <div id="onetwo_three">
                                    <div id="onetwo">
                                        <img class="logo" src="music.svg" alt="music">
                                        <div class="info">
                                            <div>${song.replaceAll("%20", " ")}</div>
                                            <div>Kunal</div>
                                        </div>
                                    </div>
                                    <img class="logo lib_logo" src="play-pause.svg" alt="">
                                </div>
                            </li>
        
        `
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs;

}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    // if (!pause) {
    //     currentSong.play();

    // }
    currentSong.play();
    play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();

            cardContainer.innerHTML = cardContainer.innerHTML + `
                    <div data-folder="${folder}" class="card">
                        <img class="cardbtn" src="playlogo.svg" alt="playlogo">
                        <img class="card_image" src="/songs/${folder}/cover.jpg"
                            alt="img">
                        <h4>${response.title}</h4>
                        <p>${response.description}</p>
                    </div>
                
            `
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
}

async function main() {
    await getSongs("songs/ncs")

    playMusic(songs[0], true)

    displayAlbums();


    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"; // Change icon to play
        }
        else {
            currentSong.pause();
            play.src = "play.svg"; // Change icon to pause
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = '0';
    })
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-140%";
    })



    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
        else {
            playMusic(songs[songs.length - 1])
        }
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0])
        if ((index + 1) < (songs.length)) {
            playMusic(songs[index + 1])
        }
        else {
            playMusic(songs[0]);
        }
    })

    const divElement = document.querySelector("#bt1")

    divElement.addEventListener('click', function () {
        window.location.href = 'https://www.spotify.com/in-en/signup?forward_url=https%3A%2F%2Fopen.spotify.com%2F'
    });
    const divElement2 = document.querySelector("#bt2")

    divElement2.addEventListener('click', function () {
        window.location.href = 'https://accounts.spotify.com/en-GB/login?continue=https%3A%2F%2Fopen.spotify.com%2F'
    });
    

    




}
main()


