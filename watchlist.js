const moviesDiv = document.getElementById("movies")
const placeHolder = document.getElementsByClassName("placeholder-image-container")

const displayMovies = []
let savedMovies = JSON.parse(localStorage.getItem("savedMovies"))

async function getSavedMovies() {
    for (movie of savedMovies) {
        const response = await fetch(`https://www.omdbapi.com/?apikey=9c43412e&i=${movie}&type=movie`)
        const data = await response.json()

        console.log(data)
        renderMovies(data) 

        const removeBtn = document.getElementsByClassName("add-to-watchlist-container")

        for (btn of removeBtn) {
            btn.addEventListener("click", e => {
                const targetIdClass = e.target.parentNode.getAttribute("class")
                console.log(targetIdClass)
                const targetId = targetIdClass.replace("add-to-watchlist-container ", "")
                updatedMovieList = savedMovies.filter(movie => {
                    return movie != targetId
                })

                localStorage.setItem("savedMovies", JSON.stringify(updatedMovieList))
                location.reload()
                alert(`This movie has been removed from your watchlist.`)
            })
        }
    }
}

function renderMovies(data) {
    const { Poster, Title, imdbRating, Runtime, Genre, Plot, imdbID } = data
    const html = `
    <div class="movie-container" id="${imdbID}">
            <img class="movie-image" src="${Poster}" alt="${Title} image">
            <div class="movie-item-info">
                <div class="movie-container-title">
                    <h3 class="movie-title"><a target="_blank" href='https://www.imdb.com/title/${imdbID}'>${Title}</a></h3>
                    <img src="./images/star-image.png">
                    <p class="movie-rating">${imdbRating}</p>
                </div>

                <div class="movie-container-info">
                    <p class="move-duration">${Runtime}</p>
                    <p class="movie-genre">${Genre}</p>
                    <div class="add-to-watchlist-container ${imdbID}" id="remove-from-watchlist-btn">
                        <img class="add-to-watchlist-img" src="./images/minus-btn-image.png">
                        <p>Remove</p>
                    </div>
                </div>

                <div class="description" id="description">
                    <p>${Plot}</p>
                </div>
            </div>
        </div>
    `
    displayMovies.push(html)
    moviesDiv.innerHTML = displayMovies.join("")
}

console.log(savedMovies)
if (savedMovies.length !== 0) {
    placeHolder[0].style.display = "none"
    getSavedMovies()
} else {
    placeHolder[0].style.display = "flex"
}
