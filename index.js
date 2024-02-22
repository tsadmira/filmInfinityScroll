const elements = {
    container: document.querySelector('.js-movie'),
    guard: document.querySelector('.js-guard')
}
let page = 498;
const options = {
    root: null,
    rootMargin: '300px',
}
const observer = new IntersectionObserver(handlerLoadMore, options);
function createMarkup(arr) { 
    console.log(arr);
    const markup = arr.map(item => {
        return `<div class="movie-item">
                    <img class="img-movie" src="${item.poster_path
                        ? 'https://image.tmdb.org/t/p/w500/' + item.poster_path
                        : 'https://www.reelviews.net/resources/img/default_poster.jpg'}/> 
                    alt="${item.title || 'Title not found'}">
                    <h3>${item.title || 'Title not found'}</h3>
                    <p>Release Date: ${item.release_date || 'XXXX.XX.XX'}</p>
                    <p>Vote Average: ${item.vote_average || 'XX.XX'}</p>
                </div>`
    }).join('');
    return markup;
}
function serviceFilm(currentPage = '1') {
    const params = new URLSearchParams({
        page: currentPage,
        api_key: 'a60d3b1782ef083c04070e65848b0cda',
    })
    return fetch(`https://api.themoviedb.org/3/trending/movie/week?${params}`)
        .then(resp => {
            if (!resp.ok) { 
                throw new Error("error");
            }
            return resp.json();
        })
}
serviceFilm()
    .then(data => {
        console.log(data);
        elements.container.insertAdjacentHTML('beforeend', createMarkup(data.results));
        if (data.page < data.total_pages) {
            observer.observe(elements.guard);
        }
    })
    .catch(err => {})

function handlerLoadMore(entries) { 
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            page += 1;
            serviceFilm(page)
                .then(data => {
                    elements.container.insertAdjacentHTML('beforeend', createMarkup(data.results));
                    if (data.page >= 500) {
                        observer.unobserve(elements.guard);
                    }
                })
                .catch(err => {})
        }
    });
}
