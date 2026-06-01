import debounce from 'debounce';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';
const listRef = document.querySelector(".list");
const inputRef = document.querySelector('.input')
const elemRef = document.querySelector('.element')

let search = "";
let page = 1;
const API_KEY = "55914722-15bc7f8b19294807aa7335c95";
let instance = null

async function getImages(page, search) {
  const res = await fetch(
    `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${search}&page=${page}}&per_page=12&key=${API_KEY}`,
  );
  return res.json();
}

function createItem(arr) {
  const item = arr.map(({webformatURL, largeImageURL, likes, views, comments, downloads, tags}) => {
    return `<li class="photo-card" data-action="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" />
  <div class="stats">
    <p class="stats-item">
      <i class="material-icons">thumb_up</i>
      ${likes}
    </p>
    <p class="stats-item">
      <i class="material-icons">visibility</i>
      ${views}
    </p>
    <p class="stats-item">
      <i class="material-icons">comment</i>
      ${comments}
    </p>
    <p class="stats-item">
      <i class="material-icons">cloud_download</i>
      ${downloads}
    </p>
  </div>
</li>`;
  }).join('');

  listRef.insertAdjacentHTML('beforeend', item)
}



inputRef.addEventListener('input',  debounce(async(e) => {
    page = 1
    listRef.innerHTML = ''
    search = e.target.value
    if(search.length > 2){
        const res = await getImages(page, search)
        await createItem(res.hits)
    }

}, 200))

const observer = new IntersectionObserver( (ent) => {
    ent.forEach(async(e) => {

        if(e.isIntersecting && search !== ''){
        page++
        const res = await getImages(page, search)
        await createItem(res.hits)
        }
    })
}, {
    rootMargin: '200px'
})

observer.observe(elemRef)

listRef.addEventListener('click', (e) => {
    const srcImage = e.target.closest('li').dataset.action

    instance = basicLightbox.create(`
    <div class="modal">
        <img src="${srcImage}" alt=""/>
    </div>
`)

instance.show()

})

window.addEventListener('keydown', (e) => {
    if(e.code === 'Escape'){
        instance.close()
    }
})

