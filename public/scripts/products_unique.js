(function () {
  $(() => {
    $("#markSold").on("click", onBtnClick);
    $("#addFavourite").on("click", onBtnClick);
  });

  const displayMsg = ($msg, text) => {
    $msg.html(text);
    $msg.slideDown("fast");
    setTimeout(() => $msg.slideUp("fast"), 2000);
  };

  const onBtnClick = async function () {
    const elemId = $(this).attr("id");
    let action, newBtnTxt, userMsg;
    if (elemId === "markSold") {
      [action, newBtnTxt, userMsg] = ["sold", "Sold", "Sold!"];
    }
    if (elemId === "addFavourite") {
      [action, newBtnTxt, userMsg] = [
        "favourite",
        "My Favourite",
        "Added to favourites!",
      ];
    }
    const productId = $(this).val();
    const $msg = $(".user-msg");
    try {
      const response = await editProduct(action, productId);
      if (response === "success") {
        $(this).html(newBtnTxt);
        $(this).addClass("disabled-btn");
        $msg.addClass("green");
        displayMsg($msg, userMsg);
      }
    } catch (err) {
      $msg.addClass("red");
      displayMsg($msg, "Sorry, there was a server error");
    }
  };

  // edit product post request to the server
  const editProduct = async function (action, productId) {
    try {
      return await $.post(`/api/listings/${productId}`, { action });
    } catch (err) {
      return err;
    }
  };
})();
