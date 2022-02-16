(function () {
  $(() => {
    $("#markSold").on("click", onSold);
    $("#addFavourite").on("click", onFavourite);
  });

  // Callback function for handling the sorting buttons
  const onSold = function () {
    console.log("onSold");
  };
  const onFavourite = function () {
    console.log("onFavourite");
  };
})();
