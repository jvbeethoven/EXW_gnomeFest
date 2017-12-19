const addText = () => {
  const title = document.createElement(`h1`);
  title.innerHTML = `GnomeFest`;
  title.classList.add(`title`);
  title.classList.add(`unselectable`);
  document.body.appendChild(title);

};

export default addText;
