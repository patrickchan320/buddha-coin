import $ from 'jquery';
function renderRemainingTime(t) {
  t = parseInt(t, 10);
  if (t <= 0) {
    return '00:00:00';
  }
  let h = parseInt((t - (t % 3600)) / 3600, 10);
  t %= 3600;
  let m = parseInt((t - (t % 60)) / 60, 10);
  t %= 60;
  if (h < 10) {
    h = '0' + h;
  }
  if (m < 10) {
    m = '0' + m;
  }
  if (t < 10) {
    t = '0' + t;
  }
  return h + ':' + m + ':' + t;
}

let newString="";
function typeLater(thhis,typingSpeed,i, char) {
  setTimeout(function () {
    newString += char;
    thhis.text(newString);
  }, i * typingSpeed);
}

function autoType(elementClass, typingSpeed) {
  let thhis = $(elementClass);
  thhis.css({
    "position": "relative",
    "display": "inline-block"
  });
  thhis.prepend('<div class="cursor" style="right: initial; left:0;"></div>');
  thhis = thhis.find(".text-js");
  // let text = thhis.text().trim().split('');
  let text='testing for it';
  let amntOfChars = text.length;
  console.log('length of text='+amntOfChars);
  newString = "";
  thhis.text("|");
  setTimeout(function () {
    thhis.css("opacity", 1);
    thhis.prev().removeAttr("style");
    thhis.text("");
    for (let i = 0; i < amntOfChars; i++) {
      typeLater(thhis,typingSpeed,i + 1, text[i]);
    }
  }, 1500);
}


export default {
  renderRemainingTime: renderRemainingTime,
  autoType: autoType
}