
const socket = io();

const commandDOM = document.getElementById("command");

function getCommand()
{
    const strCommand = commandDOM.innerHTML;
    if (strCommand[0] === '/')
        launchCommand(strCommand.substr(1))
}

/** @param {string} str */
function executeCommand(str)
{
    const command = (/(^.+?) /i).exec(str);
    console.log(command[0]);
    str = str.substr(command[0].length)
    console.log(srt);
}