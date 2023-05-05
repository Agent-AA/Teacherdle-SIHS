let slideNum = 0;
const serverAddress = "http://teacherdle.agent-aa.repl.co";

$.get(`${serverAddress}/reboot-timestamp`, (timestamp) => { // retrieve the timestamp of the last reboot
    document.getElementById("footer").textContent = `Last update on ${timestamp}.`;
});