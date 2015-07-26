/*
Author: Grzegorz Rozdzialik <voreny.gelio@gmail.com>
Configuration
TODO: add colors to big project, more achievements, balance upgrades, rewards, targets
 */
var autosaveTime = 60; // seconds between autosave
var Player = {
    clickPower: 1,
    idlePower: 0,
    level: 1,
    projectsCompleted: 0,
    bigProjectsCompleted: 0
};

var soundsEnabled = true;
var achievementsShown = true, upgradesShown = true;

var cash = 0;

function updateCash()
{
    $("#cash").text("$"+cash);
    Upgrades.updateAll();
}

function canAfford(price)
{
    if(cash >= price)
        return true;
    else
        return false;
}

function updatePower()
{
    $("#clickPower").text(Math.round(Player.clickPower*10)/10);
    $("#idlePower").text(Math.round(Player.idlePower*10)/10);
}

function saveGame()
{
    var saveInfo = {
        Player: Player,
        achievementsList: achievementsList,
        SmallProject: {
            title: SmallProject.title,
            currAmount: SmallProject.currAmount,
            totalAmount: SmallProject.totalAmount,
            reward: SmallProject.reward
        },
        BigProject: {
            title: BigProject.title,
            reward: BigProject.reward,
            goals: BigProject.goals
        },
        upgradesList: upgradesList,
        cash: cash
    };
    Cookies.set("progChallengeData", JSON.stringify(saveInfo), {expires: 365});
}

function loadGame()
{
    var data = Cookies.get("progChallengeData");
    if(data == undefined)
        return;

    var loadInfo = JSON.parse(data);

    Player = loadInfo.Player;
    updatePower();

    achievementsList = loadInfo.achievementsList;
    achievementsAmount = achievementsList.length;
    Achievements.updateAll();

    SmallProject.title = loadInfo.SmallProject.title;
    SmallProject.currAmount = loadInfo.SmallProject.currAmount;
    SmallProject.totalAmount = loadInfo.SmallProject.totalAmount;
    SmallProject.reward = loadInfo.SmallProject.reward;
    SmallProject.update();


    for(var i=0; i < BigProject.goals.length; ++i)
        BigProject.goals[i].destroyGoal();
    BigProject.goals = [];
    BigProject.title = loadInfo.BigProject.title;
    BigProject.reward = loadInfo.BigProject.reward;
    for(var i=0; i < loadInfo.BigProject.goals.length; ++i)
    {
        var newGoal = new BigProjectGoal();
        newGoal.id = loadInfo.BigProject.goals[i].id;
        newGoal.currAmount = loadInfo.BigProject.goals[i].currAmount;
        newGoal.totalAmount = loadInfo.BigProject.goals[i].totalAmount;
        newGoal.color = loadInfo.BigProject.goals[i].color;
        newGoal.completed = loadInfo.BigProject.goals[i].completed;
        newGoal.createGoal();
    }

    BigProject.updateAll();
    //window.setInterval(BigProject.idleGain, 1000);

    upgradesList = loadInfo.upgradesList;
    upgradesAmount = upgradesList.length;
    Upgrades.updateAll();

    cash = loadInfo.cash;
    updateCash();
}

function autosave()
{
    $("#autosaving").fadeIn();
    saveGame();
    window.setTimeout(function(){$("#autosaving").fadeOut()}, 3000);
}

function clickSoundButton()
{
    soundsEnabled = !soundsEnabled;

    updateSoundButton();
}

function updateSoundButton()
{
    //console.log(soundsEnabled);
    if(soundsEnabled)
    {
        $("#soundOn").show();
        $("#soundOff").hide();
    }
    else
    {
        $("#soundOff").show();
        $("#soundOn").hide();
    }
}

function randomInteger(min, max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function updatePanels(slide)
{
    if(window.innerWidth >= 800)
    {
        achievementsShown = true;
        upgradesShown = true;
    }

    var achievPanel = $("#achievements").find(".panelTitle");
    if(!achievementsShown)
    {
        var arrow = achievPanel.find(".arrow-down");
        arrow.removeClass("arrow-down");
        arrow.addClass("arrow-left");
        if(slide)
            $("#achievementTiles").slideUp();
        else
            $("#achievementTiles").hide();
    }
    else
    {
        var arrow = achievPanel.find(".arrow-left");
        arrow.removeClass("arrow-left");
        arrow.addClass("arrow-down");
        if(slide)
            $("#achievementTiles").slideDown();
        else
            $("#achievementTiles").show();
    }

    var upgradesPanel = $("#upgrades").find(".panelTitle");
    if(!upgradesShown)
    {
        var arrow = upgradesPanel.find(".arrow-down");
        arrow.removeClass("arrow-down");
        arrow.addClass("arrow-left");
        if(slide)
            $("#upgradesList").slideUp();
        else
            $("#upgradesList").hide();
    }
    else
    {
        var arrow = upgradesPanel.find(".arrow-left");
        arrow.removeClass("arrow-left");
        arrow.addClass("arrow-down");
        if(slide)
            $("#upgradesList").slideDown();
        else
            $("#upgradesList").show();
    }
}

function playCashSound()
{
    var cashSound = new Audio("sounds/cash_in.mp3");
    cashSound.play();
}

function init()
{
    Upgrades.build();

    var upgrades = $(".upgrade");
    upgrades.mouseover(function() { $(this).children(".name").addClass("bold");});
    upgrades.mouseout(function() { $(this).children(".name").removeClass("bold");});

    Achievements.build();

    $("#saveButton").click(saveGame);
    $("#loadButton").click(loadGame);

    $("#soundSetting").click(clickSoundButton);
    updateSoundButton();
    $.ajax({url: "sounds/cash_in.mp3"});

    $("#smallProjectReward").css("line-height", $("#smallProjectProgressBar").outerHeight()+"px");

    $("#smallProjectWorkButton").click(SmallProject.buttonClick);

    $("#achievements").find(".panelTitle").click(function (){
        achievementsShown = !achievementsShown;
        updatePanels(true);
    });
    $("#upgrades").find(".panelTitle").click(function (){
        upgradesShown = !upgradesShown;
        updatePanels(true);
    });
    if(window.innerWidth < 800)
    {
        achievementsShown = false;
        upgradesShown = false;
    }
    updatePanels(false);
    $(window).resize(function(){
        updatePanels(false);
    });

    updateCash();
    updatePower();
    SmallProject.shuffle();

    BigProject.shuffle();
    window.setInterval(BigProject.idleGain, 1000);
    window.setInterval(autosave, autosaveTime*1000);
}

window.onload = init;