(function () {
  $(() => {
    console.log("document ready");
    $("#testBtn").click(function () {
      console.log("clicked button");
      loadProducts(true, "priceLow");
    });
  });

  // Helper function to protect XSS attack via User Input
  const escapeTxt = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const createProductListing = ({ id, img_url, title, price, description }) => {
    const htmlMarkup = `<article class="listing">
    <a href="products/${id}">
    <img class="listing-img" src=${img_url}>
    </a>
    <div class="listing-details">
      <a href="products/${id}">${title}</a>
      <div class="price">$${price}</div>
      <p> ${description} </p>
    </div>
    </article>
    `;
    return htmlMarkup;
  };

  // loops through products
  // calls createProductElement for each
  // takes return value and prepends it to the products container
  const renderProducts = function (data) {
    $products = $("#regular-listings");
    $products.empty();
    data.forEach((product) => {
      const $product = createProductListing(product);
      $products.prepend($product);
    });
  };

  // Fetches and renders tweets from the server
  const loadProducts = (favouritesOnly, sortBy) => {
    $.get("/api/listings", { favouritesOnly, sortBy }).then((data) => {
      console.log("jquery ajax fetch", data);
      renderProducts(data.products);
    });
  };
})();
