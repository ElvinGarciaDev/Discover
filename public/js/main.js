// Store coordinates location. We'll need this for the travel advisor fetch call

let activities = document.getElementById("displayAttraction");

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

  // Make a call to our api to see if any users have created an attraction within this zipcode
  try {
    const response = await fetch(`/bookmarkAttraction/${zipCode}`);
    const data = await response.json();

    //This is to place attractions created by the user into the DOM
    activities.innerHTML = `${data
      .map(
        (item) =>
          `<div class="card" style="width: 35rem;">
                          <img src="${item.image}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title" >${item.Attraction}</h5>
                            <p class="card-text" data-latitude="${item.Latitude}" data-longitude="${item.Longitude}">${item.Address}</p>
                            <p class="card-text">${item.Description}</p>
                            <p class="card-text">Added By user: ${item.userName}</p>
                            <button type="button" class="btn btn-primary">Save Attraction</button>
                        </div>
                    </div>`
      )
      .join("")}`;
  } catch (error) {
    console.error(error);
  }

  // Travel-adviser api
  try {
    const response = await fetch(
      `https://travel-advisor.p.rapidapi.com/attractions/list-by-latlng?longitude=${longitudeNum}&latitude=${latitudeNum}&lunit=mi&currency=USD&lang=en_US`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "94482353a0msh26e052d5c89346dp1ca802jsnc1a21e5bf169",
          "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
        },
      }
    );
    const data = await response.json();

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
    console.error(error);
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
      let latitude =
        element.parentNode.parentNode.childNodes[3].childNodes[3].dataset
          .latitude;
      let longitude =
        element.parentNode.parentNode.childNodes[3].childNodes[3].dataset
          .longitude;

      // Send a POST request to the server and save the attraction
      try {
        const response = await fetch(`/bookmarkAttraction/addAttraction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Attraction: title,
            Address: address,
            Image: img,
            Description: description,
            Longitude: longitude,
            Latitude: latitude,
          }),
        });

        const data = await response.json();

        element.innerText = "Saved";
        element.classList.add("btnSuccess"); // Add class to turn button background green
      } catch (error) {
        console.error(error);
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
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
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