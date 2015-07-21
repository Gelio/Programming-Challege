var progress = 0;
var progressBarBG = 0;
var progressBarLabel = 0;

function fillProgressBar()
{
    if(progress >= 100)
        return;

    ++progress;
    progressBarBG.css("width", progress+"%");

    progressBarLabel.text(progress+"%");

    window.setTimeout(fillProgressBar, 10);
}

function init()
{
    progressBarBG = $("#progressBarBackground");
    progressBarLabel = $("#progressBarLabel");

    $("#workButton").click(fillProgressBar);
}

window.onload = init;