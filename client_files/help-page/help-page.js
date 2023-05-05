let slideNum = 0;
const serverAddress = "https://teacherdle.agent-aa.repl.co";

$.get(`${serverAddress}/reboot-timestamp`, (timestamp) => { // retrieve the timestamp of the last reboot
    document.getElementById("footer").textContent = `Last update on ${timestamp}.`;
});

document.getElementById("submit-button").addEventListener("click", () => {
    const data = {
        name: document.getElementById("name-input").value,
        message: document.getElementById("feature-bug-input").value
    }

    $.post(`${serverAddress}/submit-feedback/${data.name}/${data.message}`, (res) => {
        if (res == 200) {
            alert("Your feedback has been received!");
        } else if (res == 500) {
            alert("The server is having a crisis. Please try again later.");
        }

        // clear the values
        document.getElementById("name-input").value = "";
        document.getElementById("feature-bug-input").value = "";
    });
});