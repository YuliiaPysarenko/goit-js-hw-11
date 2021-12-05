'use strict'
import './sass/main.scss';
import {fetchImages} from './js/fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
// Дополнительный импорт стилей
import "simplelightbox/dist/simple-lightbox.min.css";

const formRef = document.querySelector('form');
const inputRef = document.querySelector('input');
const galleryRef = document.querySelector('.gallery');
const lightbox = new SimpleLightbox('.gallery a', {});
const infiniteScrollElem = document.querySelector('infinite-scroll');

let q = "";
let page = 0;

function loadImagesList() {
    fetchImages(q, page)
    .then((result) => {
    renderImagesList(result);
    })
    .catch((error) => Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again."));
}

function renderImagesList(result) {
    const {totalHits, hits} = result;
    const totalPages = totalHits / 40;
    if (totalHits === 0) { 
        return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    } else if (page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    } else if (page > totalPages) {
        return Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.")
    }

    createImagesList(hits);

    if (page !== 1) {
        scrolling();
    }

    page += 1;
}

function createImagesList(hits) {

    const markup = hits
        .map((image) => {
            const {webformatURL, largeImageURL, tags, likes, views, comments, downloads} = image;

            return `<a class="photo-card__link" href="${largeImageURL}">
                        <div class="photo-card">
                            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                            <div class="info">
                                <p class="info-item">
                                    <b>Likes</b> ${likes}
                                </p>
                                <p class="info-item">
                                    <b>Views</b> ${views}
                                </p>
                                <p class="info-item">
                                    <b>Comments</b> ${comments}
                                </p>
                                <p class="info-item">
                                    <b>Downloads</b> ${downloads}
                                </p>
                            </div>
                        </div>
                    </a>`;
        })
        .join("");
        galleryRef.insertAdjacentHTML("beforeend", markup);
        lightbox.refresh();
}

function scrolling () {
    const { height: cardHeight } = galleryRef.firstElementChild.getBoundingClientRect();
    
    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}


inputRef.addEventListener('input', (event) => q = event.target.value);

formRef.addEventListener('submit', (event) => {
    event.preventDefault();
    page = 1;    
    galleryRef.innerHTML = "";
    if (q.length === 0) {
        return;
    }
    loadImagesList();
});

// infinite-scroll

function handleInfiniteScrollFetchRequest() {
    loadImagesList();
}

infiniteScrollElem.addEventListener('infinite-scroll-fetch', handleInfiniteScrollFetchRequest);