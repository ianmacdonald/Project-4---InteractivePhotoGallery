
// VARIABLES 

var $overlay = $('<div id="overlay"></div>');
var $image = $('<img class="galleryImage">');
var $title = $('<h4></h4>');
var $caption = $('<p></p>');
var $nextButton = $("<img id='nextButton' src='images/arrowNext.png'>");
var $prevButton = $("<img id='prevButton' src='images/arrowPrev.png'>");
var $closeButton = $("<img class='closeButton' src='images/close.png'>");
var search = '';

// Create array of JSON objects for overlay gallery
var imagesJSON = [];

// array of each href attribute of the links inside gallery
var imageSrcArray = $('#galleryContainer a').map(function() {
  return $(this).attr('href');
});


// array of each title attribute of the images inside gallery
var imageTitleArray = $('#galleryContainer a img').map(function() {
  return $(this).attr('title');
});

// array of each alt (caption) attribute of the images inside gallery
var imageCaptionArray = $('#galleryContainer a img').map(function() {
  return $(this).attr('alt');
});

// array of each alt (caption) attribute of the videos inside gallery
var videoCaptions = $('iframe').map(function() {
  return $(this).attr('name');
});


// populate imagesJSON
for (var i = 0; i < imageSrcArray.length; i++) {
  imagesJSON.push({
    src: imageSrcArray[i],
    title: imageTitleArray[i],
    alt: imageCaptionArray[i], 
    location: i
  });
}


// Global Functions //

function setMarginsImages() {
  $('#galleryContainer a img').filter(':visible').each(function(i) {
  $(this).css('margin', '0');
  var modulus = (i + 1) % 4;
    if (modulus === 0) { 
      $(this).css('margin', '0 0 55px 0');
    } else {
      $(this).css('margin', '0 60px 55px 0');
    }
  });
}

function setMarginsVideos() {
$('#galleryContainer li iframe').filter(':visible').each(function(i) {
      var modulus = (i + 1) % 3;
      if (modulus === 0) { 
          $(this).css('margin', '0 0 55px 0');
      } else {
          $(this).css('margin', '0 10px 55px 0');
      }
  });
}

function animateImage() {
  $image.hide();
  $image.fadeIn('slow', 'linear');
}


//---- STICKY HEADER ----//
$(window).scroll(function() {
  if ($(this).scrollTop() > $('header').height()) {  
    $('header').addClass("sticky");
  }
  else {
    $('header').removeClass("sticky");
  }
});



//CREATE OVERLAY//
  //add image / title / caption 
$overlay.append($image);
$overlay.append($title);
$overlay.append($caption);
  //add prev / next / close buttons
$overlay.append($prevButton);
$overlay.append($nextButton);
$overlay.append($closeButton);
  //add overlay
$('body').append($overlay);
  

//Capture click event on gallery image
$('#galleryContainer a').on('click', function(event) {
  event.preventDefault();
  var imageLocation = $(this).attr('href');
  //Update overlay with image that is linked
  $image.attr('src', imageLocation);
  //Get child's alt attribute and set caption
  var captionText = $(this).children('img').attr('alt');
  $caption.text(captionText);
  var titleText = $(this).children('img').attr('title');
  $title.text(titleText);
  //Show the overlay
  $overlay.show();
});


//CLOSE OVERLAY//
//When X or image is clicked close overlay
$closeButton.on('click', function() {
  $overlay.fadeOut();
});


//CLICK GALLERY
// function that returns the current image Object based on the src
function findImage(arrayOfObjects, src) {
  for (var i = 0; i < arrayOfObjects.length; i++) {
    var result = arrayOfObjects[i].src.indexOf(src);
    if (result > -1) {
      return arrayOfObjects[i];
    }
  }
}

//CLICK PREV NEXT ARROWS

$nextButton.on('click', function() {
    var imageCurrentSrc = $(this).siblings("img").attr("src");
    var currentImage = findImage(imagesJSON, imageCurrentSrc);
    if (currentImage.location === imagesJSON.length - 1) {
      $image.attr("src", imagesJSON[0].src);
      $title.text(imagesJSON[0].title);
      $caption.text(imagesJSON[0].alt);
  } else {
      $image.attr("src", imagesJSON[currentImage.location + 1].src);
      $title.text(imagesJSON[currentImage.location + 1].title);
      $caption.text(imagesJSON[currentImage.location + 1].alt);
  }
  animateImage();
});

$prevButton.on('click', function() {
  var imageCurrentSrc = $(this).siblings("img").attr("src");
    var currentImage = findImage(imagesJSON, imageCurrentSrc);
    if (currentImage.location === 0) {
      $image.attr("src", imagesJSON[imagesJSON.length - 1].src);
      $title.text(imagesJSON[imagesJSON.length - 1].title);
      $caption.text(imagesJSON[imagesJSON.length - 1].alt);
    } else {
      $image.attr("src", imagesJSON[currentImage.location -1].src);
      $title.text(imagesJSON[currentImage.location -1].title);
      $caption.text(imagesJSON[currentImage.location -1].alt);
    }
    animateImage();
});

// //overlay arrow key navigation

$(document).keydown(function(e) {
  if (e.which == 37) {
      $('#prevButton').click();
  } else if (e.keyCode == 39) {
      $('#nextButton').click();
  }
});



// //--------SEARCH Images----------//
        

$('input').on('keyup', function() {
  search = $(this).val().toLowerCase();
  for (var i = 1; i <= imageCaptionArray.length; i++) {
    var caption = imageCaptionArray[i-1].toLowerCase();
    var thisImage = $('#galleryContainer a:nth-child('+ i +')');
    
    if( caption.indexOf(search) >=0 ) {
        thisImage.fadeIn(600, 'linear', setMarginsImages);

    } else {

        thisImage.fadeOut(600, 'linear', setMarginsImages); 
    }
  }
});

//---- SEARCH Videos ----//

$('input').on('keyup', function() {
  search = $(this).val().toLowerCase();
  for (var i = 1; i <= videoCaptions.length; i++) {
    var caption = videoCaptions[i-1].toLowerCase();
    var thisVideo = $('#galleryContainer li:nth-child('+ i +')');
    
    if( caption.indexOf(search) >=0 ) {
        thisVideo.fadeIn(600, 'linear', setMarginsVideos);

    } else {

        thisVideo.fadeOut(600, 'linear', setMarginsVideos);  
    }
  }
});

//---- On Page Load ----//

setMarginsImages();
setMarginsVideos();