const addText = () => {
  const title = document.createElement(`h1`);
  title.innerHTML = `GnomeFest`;
  title.classList.add(`title`);
  title.classList.add(`unselectable`);
  document.body.appendChild(title);

  const currentlyDancing = document.createElement(`p`);
  currentlyDancing.innerHTML = `Currently dancing:`;
  currentlyDancing.classList.add(`currentlyDancing`);
  currentlyDancing.classList.add(`unselectable`);
  document.body.appendChild(currentlyDancing);

};

export default addText;
