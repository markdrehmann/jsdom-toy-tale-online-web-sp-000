let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  getToys();
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      toyFormContainer.addEventListener("submit", event => {
        event.preventDefault()
        addNewToy(event.target)
        event.target.reset()
        toyFormContainer.style.display = "none";
      })
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

function fillCardData(toyData) {
  const toyCollection = document.getElementById("toy-collection");
  let newDiv = document.createElement("div")
  newDiv.classList.add("card");

  let h2 = document.createElement("h2");
  h2.innerText = toyData.name;

  let img = document.createElement("img");
  img.classList.add("toy-avatar");
  img.src = toyData.image;

  let p = document.createElement("p");
  p.innerHTML = `${toyData.likes} Likes`;

  let btn = document.createElement("button");
  btn.classList.add("like-btn");
  btn.setAttribute('id', toyData.id)
  btn.innerText = "Like <3";
  btn.addEventListener("click", (event) => {
    addLike(event);
  })

  newDiv.append(h2, img, p, btn);
  toyCollection.appendChild(newDiv);
}

function addLike(event) {
  event.preventDefault();
  let oneMore = parseInt(event.target.previousElementSibling.innerText) + 1

  fetch(`http://localhost:3000/toys/${event.target.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      likes: oneMore
    })
  })
  .then(res => res.json())
  .then((like_obj => {
    event.target.previousElementSibling.innerText = `${oneMore} Likes`;
  }))
}

function getToys() {
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(toys => toys.forEach(toy => fillCardData(toy)))
}

function addNewToy(toy) {
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "name": toy.name.value,
      "image": toy.image.value,
      "likes": 0
    })
  })
    .then(res => res.json())
    .then(toy => fillCardData(toy))
}