const searchBtn = document.getElementById('search-btn')
const searchInput = document.getElementById('search-input')
const moviesDiv = document.getElementById('movies')
const placeHolder = document.getElementsByClassName("placeholder-image-container")

let savedMovies = JSON.parse(localStorage.getItem("savedMovies"))
let movieDataHtmlArray = []

searchBtn.addEventListener('click', searchAPI)
searchInput.addEventListener('keypress', e => {
    if (e.key === "Enter") {
        searchAPI()
    }
})

function searchAPI() {
    placeHolder[0].style.display = "none"
    const searchTerm = searchInput.value
    movieDataHtmlArray = []

    fetch(`https://www.omdbapi.com/?apikey=9c43412e&s=${searchTerm}&type=movie`)
        .then(res => {
            if (!res.ok) {
                throw Error("Network error. Please try again later.")
            } else {
                return res.json()
            }
        })
        .then(async data => {
            try {
                moviesDiv.innerHTML = ``
                placeHolder[0].style.display = "flex"
                placeHolder[0].innerHTML = `
                        <div class="loader"></div>
                        <p>Fetching movies, please wait...</p>
                    `
                await fetchMovieData(data)
                placeHolder[0].style.display = "none"
                moviesDiv.innerHTML = movieDataHtmlArray.join("")
            } catch (err) {
                placeHolder[0].style.display = "flex"
                placeHolder[0].innerHTML = `<p>${data.Error} Please search again.</p>`
            }

            const addToWatchlistBtn = document.getElementsByClassName("add-to-watchlist-container")

            for (btn of addToWatchlistBtn) {
                btn.addEventListener("click", e => {
                    const targetIdClass = e.target.parentNode.getAttribute("class")
                    const targetId = targetIdClass.replace("add-to-watchlist-container ", "")

                    console.log(targetId)
                    if (savedMovies !== null && savedMovies.includes(targetId)) {
                        alert(`You have already added this movie to your watchlist.`);
                    } else if (savedMovies === null) {
                        savedMovies = []
                        savedMovies.unshift(targetId)
                        localStorage.setItem("savedMovies", JSON.stringify(savedMovies))
                        alert(`This movie has been added to your watchlist!`);
                    } else {
                        savedMovies.unshift(targetId)
                        localStorage.setItem("savedMovies", JSON.stringify(savedMovies))
                        alert(`This movie has been added to your watchlist!`);
                    }
                    console.log(savedMovies)
                    // console.log(localStorage)
                })
            }
        })
        .catch(err => console.log(err))
}

async function fetchMovieData(data) {
    for (movie of data.Search) {
        const response = await fetch(`https://www.omdbapi.com/?apikey=9c43412e&i=${movie.imdbID}&type=movie`)
        const data = await response.json()

        console.log(data)
        const { Poster, Title, imdbRating, Runtime, Genre, Plot, imdbID } = data

        const html = `
        <div class="movie-container" id="${imdbID}">
                <img class="movie-image" src="${Poster === "N/A" ? "./images/film-logo.png" : Poster}" alt="${Title} poster">
                <div class="movie-item-info">
                    <div class="movie-container-title">
                        <h3 class="movie-title"><a target="_blank" href='https://www.imdb.com/title/${imdbID}'>${Title}</a></h3>
                        <img src="./images/star-image.png">
                        <p class="movie-rating">${imdbRating}</p>
                    </div>
    
                    <div class="movie-container-info">
                        <p class="move-duration">${Runtime}</p>
                        <p class="movie-genre">${Genre}</p>
                        <div class="add-to-watchlist-container ${imdbID}" id="add-to-watchlist-btn">
                            <img class="add-to-watchlist-img" src="./images/plus-btn-image.png">
                            <p>Watchlist</p>
                        </div>
                    </div>
    
                    <div class="description" id="description">
                        <p>${Plot}</p>
                    </div>
                </div>
            </div>
        `

        movieDataHtmlArray.push(html)
    }
}
