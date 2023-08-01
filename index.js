const ul = document.getElementById("products_items"),
  url = "https://voodoo-sandbox.myshopify.com/products.json?limit=12";
var its = document.getElementById("its");

const card = document.getElementById("card");
var back_info_hidden = document.getElementById("back_info_hidden");

var info_hidden = document.getElementById("hiddeninfo");

function info() {
  info_hidden.classList.toggle("hidden");
}

function sidebar() {
  var menu = document.getElementById("box_side");

  var back_footer_hidden = document.getElementById("back_footer_hidden");
  var back_info_hidden = document.getElementById("back_info_hidden");
  var pagination_container = document.getElementById("pagination-container");

  menu.classList.toggle("w-80");

  back_footer_hidden.classList.toggle("hidden");
  back_info_hidden.classList.toggle("hidden");
  pagination_container.classList.toggle("hidden");
}

const createNode = (element) => {
  return document.createElement(element);
};
const append = (parent, el) => {
  return parent.appendChild(el);
};
let subarray = [];
let cartId = [];
let cartPrice = [];

fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    let sales = data.products;

    const returnListWithError = sales.map((sale) =>
      sale.images.map((user) =>
        `${user.src}` == "" ? "NoItem" : `${user.src}`
      )
    );

    returnListWithError.forEach((element) => {
      if (element == "") {
        element[0] =
          "https://raw.githubusercontent.com/borovskayana/photo/gh-pages/no_image.png";
      }
    });
    let resultWith = [];
    returnListWithError.forEach(function (item) {
      let poin = { x: item[0] };

      resultWith.push(`${poin.x}`);
    });

    var newArray = resultWith.flat();

    const newNewArray = newArray.map((newnew) => newnew);

    const another = sales.map((sale) => `${sale.title}`);
    const id = sales.map((sale) => `${sale.id}`);

    let prices = sales.map((sale) =>
      sale.variants.map((elementt) => `${elementt.price}`)
    );

    let resultPrice = [];
    prices.forEach(function (item) {
      let pricePoint = { x: item[0] };

      resultPrice.push(`${pricePoint.x}`);
    });

    let s =
      Math.max(newNewArray.length, another.length, resultPrice.length) * 4;
    let d = [newNewArray, another, resultPrice, id];
    let r = [];

    for (i = 0; i < s; i++) {
      let v = d[i % 4][Math.floor(i / 4)];
      if (v != undefined) r.push(v);
    }

    let size = 4;
    for (let i = 0; i < Math.ceil(r.length / size); i++) {
      subarray[i] = r.slice(i * size, i * size + size);
    }

    renderProdcuts();
  })

  .catch((error) => {
    console.log(error);
  });

async function renderProdcuts() {
  subarray.forEach(function (item) {
    let point = { id: item[3], x: item[0], y: item[1], z: item[2] };

    return (ul.innerHTML += `
    <section>
        <div class="group relative" id="paginated-list">
        <div class="aspect-h-1 aspect-w-1 h-auto max-w-xl rounded bg-gray-200 lg:aspect-none group-hover:opacity-75">
          <img src="${point.x}" alt="Front of men&#039;s Basic Tee in black." class="h-full w-full object-cover object-center rounded lg:h-full lg:w-full">
        </div>
        <div class="mt-4 grid">
        
          <div class="grid grid-cols-2">
          <div class="h-fit lg:h-24 pb-4">
            <h3 class="text-sm lg:text-gray-700">
              <a href="#">
              <span aria-hidden="true" class="absolute inset-0"><p class="bg-gray-900 w-12 text-white m-3 p-1 rounded">USED<p></span>
                ${point.y}
              </a>
            </h3>
            <p class="mt-1 text-sm text-gray-500">${point.z} KR.</p>
</div>
            <div class="mt-1 text-sm text-gray-500 text-right">
            <p>Condition</p>
            <p>Sightly used</p>
              </div>
          </div>
        
          <button class="bg-gray-900 w-full hover:opacity-75 text-white text-sm font-bold py-2 px-4 rounded z-40" onclick="addToBasket(${point.id}, '${point.y}', ${point.z}, '${point.x}', event)">
          Add To Card
        </button>
  
        </div>
       
      </div>
     </section>
     
        `);
  });

  function sss() {}
  sss();

  /* PAGINATION */

  const paginationNumbers = document.getElementById("pagination-numbers");

  const listItems = ul.querySelectorAll("section");

  const nextButton = document.getElementById("next-button");
  const prevButton = document.getElementById("prev-button");

  /* update content */

  let paginationLimit;
  if (window.matchMedia("(min-width: 600px)").matches) {
    paginationLimit = 24;
  } else {
    paginationLimit = 6;
  }

  const pageCount = Math.ceil(listItems.length / paginationLimit);

  let currentPage = 1;

  const disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
  };

  const enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
  };

  const handlePageButtonsStatus = () => {
    if (currentPage === 1) {
      disableButton(prevButton);
    } else {
      enableButton(prevButton);
    }

    if (pageCount === currentPage) {
      disableButton(nextButton);
    } else {
      enableButton(nextButton);
    }
  };

  const handleActivePageNumber = () => {
    document.querySelectorAll(".pagination-number").forEach((button) => {
      button.classList.remove("active");
      const pageIndex = Number(button.getAttribute("page-index"));
      if (pageIndex == currentPage) {
        button.classList.add("active");
      }
    });
  };

  const appendPageNumber = (index) => {
    const pageNumber = document.createElement("button");
    pageNumber.className =
      "pagination-number bg-transparent m-2 h-[2.5rem] w-[2.5rem] cursor-pointer";
    pageNumber.innerHTML = index;
    pageNumber.setAttribute("page-index", index);
    pageNumber.setAttribute("aria-label", "Page " + index);

    paginationNumbers.appendChild(pageNumber);
  };

  const getPaginationNumbers = () => {
    for (let i = 1; i <= pageCount; i++) {
      appendPageNumber(i);
    }
  };

  const setCurrentPage = (pageNum) => {
    currentPage = pageNum;

    handleActivePageNumber();
    handlePageButtonsStatus();

    const prevRange = (pageNum - 1) * paginationLimit;
    const currRange = pageNum * paginationLimit;

    listItems.forEach((item, index) => {
      item.classList.add("hidden");
      if (index >= prevRange && index < currRange) {
        item.classList.remove("hidden");
      }
    });
  };

  getPaginationNumbers();
  setCurrentPage(1);

  prevButton.addEventListener("click", () => {
    setCurrentPage(currentPage - 1);
  });

  nextButton.addEventListener("click", () => {
    setCurrentPage(currentPage + 1);
  });

  document.querySelectorAll(".pagination-number").forEach((button) => {
    const pageIndex = Number(button.getAttribute("page-index"));

    if (pageIndex) {
      button.addEventListener("click", () => {
        setCurrentPage(pageIndex);
      });
    }
  });
}
renderProdcuts();

/* SIDEBAR */

let cart = [];
let totalPrice;
let totalPrices;
function addToBasket(id, titleid, priceid, imageid, event) {
  event.preventDefault();
  cart.push({ id, titleid, priceid, imageid });

  cartId.push(id);
  cartPrice.push(priceid);

  let sides = [];
  cart.forEach((carts) => {
    for (let value in carts) {
      sides.push(`${carts[value]}`);
    }
  });

  subarraybox = [];

  let size = 4;
  for (let i = 0; i < Math.ceil(sides.length / size); i++) {
    subarraybox[i] = sides.slice(i * size, i * size + size);
  }

  let pointbox;
  subarraybox.forEach(function (item) {
    pointbox = { id: item[0], title: item[1], price: item[2], image: item[3] };
  });

  function hasDuplicates(cartId) {
    return cartId.some((x) => cartId.indexOf(x) !== cartId.lastIndexOf(x));
  }
  function hasDuplicates(cartPrice) {
    return cartPrice.some(
      (x) => cartPrice.indexOf(x) !== cartPrice.lastIndexOf(x)
    );
  }
  function b() {
    let m = Number(
      cartPrice
        .splice(
          cartPrice.some((x) => cartPrice.indexOf(x)),
          1
        )
        .join()
    );
    return m;
  }

  if (hasDuplicates(cartId) == true) {
    cartId = [...new Set(cartId)];
    cartPrice = [...new Set(cartPrice)];

    alert("Product already in the basket!");
  } else if (hasDuplicates(cartId) == false) {
    its.innerHTML += `

    <div id="${pointbox.id}"  class="flex inline-block gap-x-6">
    <div class=" flex inline-block w-full justify-between mt-6">
    <div class=" flex inline-block w-full gap-x-6">
    <div><img src="${pointbox.image}" width="74"></div>
    <div>
    <h3 id="title" class="text-sm">${pointbox.title}<h3/>
    <p id="${pointbox.price}"  class="text-sm">${pointbox.price} KR.<p/>
    </div>
    </div>
    

 
    <button onclick="b(${pointbox.id})"><img src="./img/delete-bin-6-line.svg"></button>
    </div>
  </div>`;
  }

  var total = document.getElementById("total");

  totalPrice = cartPrice.map((i) => (x += i), (x = 0)).reverse()[0];

  total.innerHTML = Number(totalPrice.toFixed(2));
}

function b(t) {
  let m = Number(
    cartPrice
      .splice(
        cartPrice.some((x) => cartPrice.indexOf(x)),
        1
      )
      .join()
  );
  totalPrice = totalPrice - m;
  total.innerHTML = Number(totalPrice.toFixed(2));
  document.getElementById(t).remove();
  cartId.splice(
    cartId.some((x) => cartId.indexOf(x)),
    1
  );
}
