(function() {
    var example = document.querySelector(".docs-DialogExample-lgHeader");
    var button = example.querySelector(".docs-DialogExample-button");
    var dialog = example.querySelector(".ms-Dialog");
    var label = example.querySelector(".docs-DialogExample-label")
    var actionButtonElements = example.querySelectorAll(".ms-Dialog-action");
    var actionButtonComponents = [];
    // Wire up the dialog
    var dialogComponent = new fabric['Dialog'](dialog);
    // Wire up the buttons
    for (var i = 0; i < actionButtonElements.length; i++) {
      actionButtonComponents[i] = new fabric['Button'](actionButtonElements[i], actionHandler);
    }
    // When clicking the button, open the dialog
    button.onclick = function() {
      openDialog(dialog);
    };
    function actionHandler(event) {
      label.innerText = this.innerText.trim() + " clicked";
    }
    function openDialog(dialog) {
      // Open the dialog
      dialogComponent.open();
    }
  }());