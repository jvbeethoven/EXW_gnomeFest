const menuScreen = bool => {

  if (bool) {
    const menuContainer = document.createElement(`div`);
    menuContainer.classList.add(`menuContainer`);
    document.body.appendChild(menuContainer);

    const menuTitle = document.createElement(`h1`);
    menuTitle.innerHTML = `GnomeFest`;
    menuTitle.classList.add(`menuTitle`);
    menuContainer.appendChild(menuTitle);

    const menuImg = document.createElement(`img`);
    menuImg.src = `assets/img/startscreenimg.png`;
    menuImg.classList.add(`menuImg`);
    menuContainer.appendChild(menuImg);

    const explanationContainer = document.createElement(`div`);
    explanationContainer.classList.add(`explanationContainer`);
    menuContainer.appendChild(explanationContainer);

    const explanation = document.createElement(`h1`);
    explanation.innerHTML = `Collide the gnomes with objects by dragging them so you can experience beautiful sounds. Preferably used on Google Chrome v63.0`;
    explanation.classList.add(`explanation`);
    explanationContainer.appendChild(explanation);

    const button = document.createElement(`button`);
    button.innerHTML = `explore`;
    button.id = `button`;
    button.value = `explore`;
    button.classList.add(`button`);
    explanationContainer.appendChild(button);
  } else {
    const elem = document.querySelector(`.menuContainer`);
    elem.classList.add(`hide`);
  }



};

export default menuScreen;
