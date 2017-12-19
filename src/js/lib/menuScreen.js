const menuScreen = bool => {

  if (bool) {
    const menuContainer = document.createElement(`div`);
    menuContainer.classList.add(`menuContainer`);
    document.body.appendChild(menuContainer);

    // const logo = document.createElement(`img`);
    // logo.src = `./assets/img/logo.png`;
    // logo.title = `logo`;
    // logo.width = 512;
    // logo.height = 384;
    // logo.classList.add(`loading`);
    // menuContainer.appendChild(logo);

    const menuTitle = document.createElement(`h1`);
    menuTitle.innerHTML = `GnomeFest`;
    menuTitle.classList.add(`menuTitle`);
    menuContainer.appendChild(menuTitle);

    const button = document.createElement(`button`);
    button.innerHTML = `explore`;
    button.id = `button`;
    button.value = `explore`;
    button.classList.add(`button`);
    menuContainer.appendChild(button);
  } else {
    const elem = document.querySelector(`.menuContainer`);
    elem.classList.add(`hide`);
  }



};

export default menuScreen;
