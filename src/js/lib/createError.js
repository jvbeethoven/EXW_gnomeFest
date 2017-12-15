const createError = () => {
  const errorContainer = document.createElement(`div`);
  errorContainer.classList.add(`errorContainer`);
  document.body.appendChild(errorContainer);

  const loading = document.createElement(`h1`);
  loading.innerHTML = `This Experiment is not supported on your device. :(`;
  loading.classList.add(`error`);
  loading.classList.add(`unselectable`);
  errorContainer.appendChild(loading);

};

export default createError;
