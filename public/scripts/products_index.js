(function () {
  $(() => {
    $("#sortBy").on("input", function () {
      const sortByParam = $(this).val();
      //checked is an attribute of a native dom element, not a method of a jquery object, thus [0]
      const favouritesParam = $("#favouritesOnly")[0].checked;
      loadProducts(favouritesParam, sortByParam);
    });
    $("#favouritesOnly").on("change", function () {
      const favouritesParam = this.checked;
      const sortByParam = $("#sortBy").val();
      loadProducts(favouritesParam, sortByParam);
    });
  });

  // Helper function to protect from XSS attack via User Input
  const escapeTxt = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const createProductListing = ({ id, img_url, title, price, description }) => {
    const htmlMarkup = `<article class="listing">
    <a href="products/${id}">
    <img class="listing-img" src=${escapeTxt(img_url)}>
    </a>
    <div class="listing-details">
      <a href="products/${id}">${escapeTxt(title)}</a>
      <div class="price">$${escapeTxt(price)}</div>
      <p> ${escapeTxt(description)} </p>
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
      renderProducts(data.products);
    });
  };
})();
