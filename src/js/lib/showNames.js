const showNames = arr => {
  const paragraph = document.querySelector(`.currentlyDancing`);
  paragraph.innerHTML = `Currently dancing:${  arr}`;
};

export default showNames;
