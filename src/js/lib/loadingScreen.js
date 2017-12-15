const loadingScreen = bool => {

  if (bool) {
    const loadingContainer = document.createElement(`div`);
    loadingContainer.classList.add(`loadingContainer`);
    document.body.appendChild(loadingContainer);

    const loading = document.createElement(`h1`);
    loading.innerHTML = `loading`;
    loading.classList.add(`loading`);
    loading.classList.add(`unselectable`);
    loadingContainer.appendChild(loading);

    const loadingGif = document.createElement(`img`);
    loadingGif.src = `./assets/img/loader.gif`;
    loadingGif.title = `loadingGif`;
    loadingGif.width = 240;
    loadingGif.height = 240;
    loadingGif.classList.add(`loading`);
    loadingContainer.appendChild(loadingGif);
  } else {
    const elem = document.querySelector(`.loadingContainer`);
    elem.classList.add(`hide`);
  }



};

export default loadingScreen;
