(function () {
  $(() => {
    $("#markSold").on("click", onSold);
    $("#addFavourite").on("click", onFavourite);
  });

  const displayMsg = ($msg, text) => {
    $msg.html(text);
    $msg.slideDown("fast");
    setTimeout(() => $msg.slideUp("fast"), 2000);
  };

  // Callback function for handling the sorting buttons
  const onSold = async function () {
    const productId = $(this).val();
    const $msg = $(".user-msg");
    try {
      const response = await editProduct("sold", productId);
      if (response === "success") {
        $(this).remove();
        $msg.addClass("green");
        displayMsg($msg, "Sold!");
      }
    } catch (err) {
      $msg.addClass("red");
      displayMsg($msg, "Sorry, there was a server error");
    }
  };
  const onFavourite = function () {
    console.log("to be implemented");
  };

  // edit product post request to the server
  const editProduct = async function (sold, productId) {
    try {
      return await $.post(`/api/listings/${productId}`, { sold });
    } catch (err) {
      return err;
    }
  };
})();
