// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  const canvasObject = document.getElementById('user-image');
  const context = canvasObject.getContext('2d');
  context.fillStyle = 'black';
  context.clearRect(0, 0, 400, 400);
  context.fillRect(0, 0, 400, 400);

  var button1 = document.querySelector("button[type='submit']")
  var button2 = document.querySelector("button[type='reset']")
  var button3 = document.querySelector("button[type='button']")

  button1.disabled = false;
  button2.disabled = true;
  button3.disabled = true;

  var imgObject = getDimmensions(400, 400, img.width, img.height);
  
  context.drawImage(img, imgObject.startX, imgObject.startY, imgObject.width, imgObject.height);

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}


speechSynthesis.addEventListener('voiceschanged', function() {

  var voiceList = [];
  const selectBox = document.getElementById('voice-selection');
  selectBox.disabled = false;

  voiceList = speechSynthesis.getVoices();

  for(let i = 0; i < voiceList.length; i++) {

    var newOption = document.createElement('option');
    newOption.textContent = voiceList[i].name + ' (' + voiceList[i].lang + ')';

    if(voiceList[i].default) {
      newOption.textContent += ' -- DEFAULT';
    }

    newOption.setAttribute('data-lang', voiceList[i].lang);
    newOption.setAttribute('data-name', voiceList[i].name);

    selectBox.appendChild(newOption);
  }
  selectBox.options.remove(0);
});

const fileElem = document.getElementById('image-input');
fileElem.addEventListener('change', function() {
  var imgSource = fileElem.files[0];
  var imgURL = URL.createObjectURL(imgSource);
  var filename = imgURL.substring(imgURL.lastIndexOf('/')+1);
  img.src = imgURL;
  img.alt = filename;
})

const form = document.getElementById('generate-meme');
form.addEventListener('submit', e => {

  const topText = document.getElementById('text-top');
  const bottomText = document.getElementById('text-bottom');
  const canvasObject = document.getElementById('user-image');
  const context = canvasObject.getContext('2d');

  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.fillStyle = 'white';
  context.font = 'bold 30px Impact';
  context.strokeStyle = 'black';

  context.fillText(topText.value, canvasObject.width/2, 50);
  context.strokeText(topText.value, canvasObject.width/2, 50);
  context.fillText(bottomText.value, canvasObject.width/2, 350);
  context.strokeText(bottomText.value, canvasObject.width/2, 350);

  var button1 = document.querySelector("button[type='submit']")
  var button2 = document.querySelector("button[type='reset']")
  var button3 = document.querySelector("button[type='button']")

  button1.disabled = true;
  button2.disabled = false;
  button3.disabled = false;

  e.preventDefault();
})

const clearButton = document.querySelector("button[type='reset']");
clearButton.addEventListener('click', function(){
  const canvasObject = document.getElementById('user-image');
  const context = canvasObject.getContext('2d');
  context.clearRect(0, 0, 400, 400);

  var button1 = document.querySelector("button[type='submit']")
  var button2 = document.querySelector("button[type='reset']")
  var button3 = document.querySelector("button[type='button']")

  button1.disabled = false;
  button2.disabled = true;
  button3.disabled = true;
})

var volume = 1;

const readButton = document.querySelector("button[type='button']");
readButton.addEventListener('click', function(){

  const synth = window.speechSynthesis;
  const topText = document.getElementById('text-top');
  const bottomText = document.getElementById('text-bottom');
  const selectBox = document.getElementById('voice-selection');
  
  var utterTop = new SpeechSynthesisUtterance(topText.value);
  var utterBottom = new SpeechSynthesisUtterance(bottomText.value);
  var voiceList = [];
  var selectedOption = selectBox.selectedOptions[0].getAttribute('data-name');

  voiceList = speechSynthesis.getVoices();
  for(let i = 0; i < voiceList.length; i++){
    if(voiceList[i].name === selectedOption){
      utterTop.voice = voiceList[i];
      utterBottom.voice = voiceList[i];
    }
  }

  utterTop.volume = volume;
  utterBottom.volume = volume;

  synth.speak(utterTop);
  synth.speak(utterBottom);
})

var volumeGroup = document.getElementById('volume-group');
volumeGroup.addEventListener('input', function(){
  var volumeSlider = document.querySelector("input[type='range']");

  volume = (volumeSlider.value)/100;

  var volImg = document.querySelector('img');

  if(volume >= 0.67){
    volImg.src = "icons/volume-level-3.svg";
  }
  else if(volume < 0.67 && volume >= 0.34){
    volImg.src = "icons/volume-level-2.svg";
  }
  else if(volume < 0.34 && volume >= 0.01){
    volImg.src = "icons/volume-level-1.svg";
  }
  else{
    volImg.src = "icons/volume-level-0.svg";
  }
})