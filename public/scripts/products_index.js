(function () {
  $(() => {
    $(".sorting-buttons").on("input", onSort);
  });

  // Helper function to protect from XSS attack via User Input
  const escapeTxt = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // Create html markup for a product listing
  const createProductListing = ({ id, img_url, title, price, description }) => {
    const htmlMarkup = `
    <article class="listing">
      <div class="listing-contents">
      <a href="products/${id}">
      <img class="listing-img" src=${escapeTxt(img_url)}>
    </a>
      <div class="listing-details">
        <a class="title" href="products/${id}">${escapeTxt(title)}</a>
        <div class="price">$${escapeTxt(price)}</div>
        <p> ${escapeTxt(description)} </p>
      </div>
      </div>
    </article>
    `;
    return htmlMarkup;
  };

  // loop through products
  // call createProductElement for each
  // take return value and prepends it to the products container
  const renderProducts = function (data) {
    $products = $("#regular-listings");
    $products.empty();
    data.forEach((product) => {
      const $product = createProductListing(product);
      if (!product.sold) {
        $products.append($product);
      }
    });
  };

  // Fetch and render products from the server
  const loadProducts = (favouritesOnly, sortBy) => {
    $.get("/api/listings", { favouritesOnly, sortBy })
      .then((data) => {
        renderProducts(data.products);
      })
      .catch((err) => {
        // add jquery DOM insertion to show a message to the user that there was an error
      });
  };

  // Callback function for handling the sorting buttons
  const onSort = function () {
    const $input = $(this);
    const $favouritesOnly = $input.find("input");
    const $sortBy = $input.find("select");
    // checked is an attribute of a native dom element, not a method of a jquery object, thus [0].checked
    const favouritesParam = $favouritesOnly[0].checked;
    const sortByParam = $sortBy.val();
    loadProducts(favouritesParam, sortByParam);
  };
})();
