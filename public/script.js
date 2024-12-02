let vibrationEnabled = false;

document
  .getElementById("enableNotifications")
  .addEventListener("click", function () {
    vibrationEnabled = true;
    this.textContent = "Notifications Enabled";
    this.disabled = true;
  });

function checkDistance() {
  fetch("/latest-distance")
    .then((response) => response.json())
    .then((data) => {
      const alertElement = document.getElementById("alert");
      if (data.distance !== null) {
        if (data.distance <= 70) {
          alertElement.textContent = `Alert! Object detected at ${data.distance} cm`;
          alertElement.className = "danger";
          // Trigger vibration if supported and enabled
          if (vibrationEnabled && "vibrate" in navigator) {
            navigator.vibrate([200, 100, 200]);
          }
        } else {
          alertElement.textContent = `Safe. No object detected within 70 cm. Current distance: ${data.distance} cm`;
          alertElement.className = "safe";
        }
      } else {
        alertElement.textContent = "No data available";
        alertElement.className = "safe";
      }
    })
    .catch((error) => console.error("Error:", error));
}

// Check distance every 2 seconds
setInterval(checkDistance, 2000);
