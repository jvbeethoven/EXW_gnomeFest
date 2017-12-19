const currentlyDancing = (object, bool) => {

  console.log(object);
  console.log(bool);

  const currentGnomes = [];

  if (bool) {
    currentGnomes.push(object);
  } else {
    const remove = currentGnomes.indexOf(object);
    currentGnomes.splice(remove, 1);
  }
  //
  // const title = document.createElement(`h1`);
  // title.innerHTML = `GnomeFest`;
  // title.classList.add(`title`);
  // title.classList.add(`unselectable`);
  // document.body.appendChild(title);
  console.log(currentGnomes);
};

export default currentlyDancing;
