(function () {
  $(() => {
    $("#markSold").on("click", onBtnClick);
    $("#addFavourite").on("click", onBtnClick);
    $("#deleteListing").on("click", onBtnClick);
    $("#msgBreeder").on("click", onMsgClick);
    $("#msgForm").on("submit", submitForm);
  });

  const displayMsg = ($msg, text) => {
    $msg.html(text);
    $msg.slideDown("fast");
    setTimeout(() => $msg.slideUp("fast"), 2000);
  };

  const submitForm = function (event) {
    event.preventDefault();

    const $form = $(this);
    const $msg = $(".user-msg");

    $.post("/message", $form.serialize())
      .then(() => {
        $msg.addClass("green");
        displayMsg($msg, "Message sent!");
        $form.remove();
      })
      .catch(() => {
        $msg.addClass("red");
        displayMsg(
          $msg,
          "Sorry there was an error submitting your messsage, please try later."
        );
        return;
      });
  };

  const onMsgClick = function () {
    $("#msgForm").slideDown("fast");
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
        "Favourite",
        "Added to favourites!",
      ];
    }
    if (elemId === "deleteListing") {
      [action, newBtnTxt, userMsg] = [
        "delete",
        "Delete Listing",
        "Listing Deleted!",
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
        // Chain successful listing delete to redirect to main listings page
        if (elemId === "deleteListing") {
          setTimeout("window.location.href = '../'", 3000)
        }
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
