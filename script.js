/*
Author: Grzegorz Rozdzialik <voreny.gelio@gmail.com>
Configuration
 */
var Player = {
    clickPower: 1,
    idlePower: 0,
    level: 1,
    projectsCompleted: 0,
    bigProjectsCompleted: 0
};

var soundsEnabled = true;

var cash = 0;


function updateCash()
{
    $("#cash").text("$"+cash);
}

function updatePower()
{
    $("#clickPower").text(Math.round(Player.clickPower*10)/10);
    $("#idlePower").text(Math.round(Player.idlePower*10)/10);
}

function randomInteger(min, max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function init()
{
    Upgrades.build();

    var upgrades = $(".upgrade");
    upgrades.mouseover(function() { $(this).children(".name").addClass("bold");});
    upgrades.mouseout(function() { $(this).children(".name").removeClass("bold");});

    Achievements.build();

    $("#smallProjectReward").css("line-height", $("#smallProjectProgressBar").outerHeight()+"px");

    $("#smallProjectWorkButton").click(SmallProject.buttonClick);

    updateCash();
    updatePower();
    SmallProject.shuffle();

    BigProject.shuffle();
}

window.onload = init;