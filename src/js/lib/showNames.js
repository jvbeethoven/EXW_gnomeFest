const showNames = arr => {

  console.log(arr);
  const paragraph = document.querySelector(`.currentlyDancing`);
  paragraph.innerHTML = `Currently dancing:${  arr}`;
};

export default showNames;
