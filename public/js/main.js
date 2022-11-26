// Store coordinates location. We'll need this for the travel advisor fetch call

let activities = document.getElementById("displayMovies");

document.querySelector("#button-addon2").addEventListener("click", async () => {
  // Get the zip code value from the input
  let zipCode = document.querySelector("input").value;

  // First fetch is to get the longitude and latitude cordinates so we can use them for the travel-adviser api
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
    const data = await response.json();
    console.log(data);

    var longitudeNum = data.places[0].longitude;
    var latitudeNum = data.places[0].latitude;
  } catch (error) {}

  try {
    const response = await fetch(`bookmarkAttraction/${zipCode}`);
    const data = await response.json();

    //This is to place attractions created by the user into the DOM
    activities.innerHTML += `${data
      .map(
        (item) =>
          `<div class="card" style="width: 35rem;">
                          <img src="${item.image}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title" >${item.Attraction}</h5>
                            <p class="card-text" data-latitude="${item.Latitude}" data-longitude="${item.Longitude}">${item.Address}</p>
                            <p class="card-text">${item.Description}</p>
                            <p class="card-text">Added By User</p>
                            <button type="button" class="btn btn-primary">Save Attraction</button>
                        </div>
                    </div>`
      )
      .join("")}`;
  } catch (error) {
    console.error(error)
  }

  // Travel-adviser api
  try {
    const response = await fetch(
      `https://travel-advisor.p.rapidapi.com/attractions/list-by-latlng?longitude=${longitudeNum}&latitude=${latitudeNum}&lunit=mi&currency=USD&lang=en_US`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "8c65eecf0fmsh69d4bfdbf3a8bd3p1478f0jsnd22316cdad37",
          "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
        },
      }
    );
    const data = await response.json();
    console.log(data)

    // Save 

    // Filter the array that came back from the fetch request. Take out any elements that have undefined or "" values
    let arr = data.data.filter((element, index) => {
      return (
        element.name != undefined &&
        element.address != undefined &&
        element.description != undefined &&
        element.description != "" &&
        element.photo != undefined
      );
    });

    // This is to place attractions received from travel-advisor into the DOM
    activities.innerHTML += `${arr
      .map(
        (item) =>
          `<div class="card" style="width: 35rem;">
                              <img src="${item.photo.images.original.url}" class="card-img-top">
                            <div class="card-body">
                                <h5 class="card-title" >${item.name}</h5>
                                <p class="card-text" data-latitude="${item.latitude}" data-longitude="${item.longitude}">${item.address}</p>
                                <p class="card-text">${item.description}</p>

                                <button type="button" class="btn btn-primary">Save Attraction</button>
                            </div>
                        </div>`
      )
      .join("")}`;
  } catch (error) {
    console.error(error)
  }

  // Select the button that saves the attraction
  let btn = document.getElementsByClassName("btn");

  // Add EventListener to all btns
  Array.from(btn).forEach((element) => {
    element.addEventListener("click", async () => {
      // Grab the movie title, year and image so we can send it with the POST request
      let title =
        element.parentNode.parentNode.childNodes[3].childNodes[1].innerText;
      let address =
        element.parentNode.parentNode.childNodes[3].childNodes[3].innerText;
      let description =
        element.parentNode.parentNode.childNodes[3].childNodes[5].innerText;
      let img = element.parentNode.parentNode.childNodes[1].src;

      // get the latitude and longitude from the dataset. We will need the coordinates because we want to show a map of the attraction location
      let latitude = element.parentNode.parentNode.childNodes[3].childNodes[3].dataset.latitude
      let longitude = element.parentNode.parentNode.childNodes[3].childNodes[3].dataset.longitude

      console.log(latitude, longitude)

      // Send a POST request to the server and save the attraction
      try {
        const response = await fetch(`addAttraction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Attraction: title,
            Address: address,
            Image: img,
            Description: description,
            Longitude: longitude,
            Latitude: latitude
          }),
        });

        const data = await response.json();

        element.innerText = "Saved";
        element.classList.add("btnSuccess"); // Add class to turn button background green
      } catch (error) {
        console.error(error)
      }
    });
  });
});

// When the back to top button is clicked
// Get the button
let mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 20
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", backToTop);

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// class Attraction {
//   constructor(zipCode, longitudeNum, latitudeNum){
//     this.zipCode = zipCode,
//     this.longitudeNum = longitudeNum,
//     this.latitudeNum = latitudeNum
//   }

//   // // Getter method
//   // get zipCode() {
//   //   return this._zipCode
//   // }

//   // get longitudeNum() {
//   //   return this._longitudeNum
//   // }

//   // get latitudeNum() {
//   //   return this._latitudeNum
//   // }

//   // // Setter mthod
//   // set zipCode(value) {
//   //   this._zipCode = value
//   // }

//   // set longitudeNum(value) {
//   //   this.longitudeNum = value
//   // }

//   // set latitudeNum(value) {
//   //   this._latitudeNum = value
//   // }


//   // Method gets value from the DOM
//   valueFromDom(id) {
//     return document.querySelector(id).value
//   }

//   // Method uses fetch to make a request to the zippopotam api to get the latitude and longitude coordinates which we'll need to find attractions near you
//   async getCoordinatesPair() {

//     try {

//       const response = await fetch(`https://api.zippopotam.us/us/${this.zipCode}`) // Pass in the zipCode
//       const data = await response.json()

//       // Save the coordinates
//       this.longitudeNum = 50
//       this.latitudeNum = 50

//     } catch (error) {

//       console.log(error)

//     }

//   }

//   // Method uses fetch to make a request to the travel-advisor api to get attractions near you

//   async getLocalAttractions() {

//     try {

//       const response = await fetch(`https://travel-advisor.p.rapidapi.com/attractions/list-by-latlng?longitude=${this.longitude}&latitude=${this.latitude}&lunit=mi&currency=USD&lang=en_US`, {
//         "method": "GET",
//         "headers": {
//             'X-RapidAPI-Key': '8c65eecf0fmsh69d4bfdbf3a8bd3p1478f0jsnd22316cdad37',
//         'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
//         }
//     })

//     const data = await response.json()
//     console.log(data)

//     } catch (error) {

//     }

//   }
// }

// document.querySelector('#button-addon2').addEventListener('click', _ => {

//   // Create an instance of the attraction class
//   const attraction = new Attraction()

//   // Get the zipCode the user entered from the input box
//   let userZipCode = attraction.valueFromDom("input")

//   // Set the zipcode the user gave us in the class
//   attraction.zipCode = userZipCode

//   // Call the getCoordinatesPair, this will call the zippopotam api which will find the cordinate pair for the current zip code.
//   attraction.getCoordinatesPair()


//   // Call the getLocalAttractions()
//   // attraction.getLocalAttractions()

//   // attraction.longitudeNum = 100
//   // attraction._latitudeNum = 200

//   console.log(attraction)



// })
