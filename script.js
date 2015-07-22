/*
Author: Grzegorz Rozdzialik <voreny.gelio@gmail.com>
Configuration
 */
var Player = {
    clickPower: 1,
    idlePower: 0,
    level: 1
};

var smallProjectTitles = ["Project 1", "Project 2", "Project 3"];
var upgradesList = [
    {
        id: "upgrade-training",
        name: "Training",
        cost: 5,
        costMultiplier: 1.3, // amount by which cost is multiplied with each upgrade
        clickGain: 1,
        idleGain: 0,
        level: 0,
        playerLevelIncrease: 1  // how much buying this upgrade increases player's level
    },
    {
        id: "upgrade-course",
        name: "Programming course",
        cost: 10,
        costMultiplier: 1.3,
        clickGain: 2,
        idleGain: 0,
        level: 0,
        playerLevelIncrease: 2
    },
    {
        id: "upgrade-coop",
        name: "Coop group",
        cost: 15,
        costMultiplier: 1.3,
        clickGain: 0,
        idleGain: 0.1,
        level: 0,
        playerLevelIncrease: 1
    }
];
var achievementsList = [
    {
        name: "First step",
        image: "first.png",
        type: "projectsCreated",
        goal: 1
    },
    {
        name: "5 projects",
        image: "five.png",
        type: "projectsCreated",
        goal: 5
    }
];
var soundsEnabled = true;



var cash = 0;


var smallProjectTitlesAmount = smallProjectTitles.length;
var upgradesAmount = upgradesList.length;
var achievementsAmount = achievementsList.length;

var Upgrades = {
    build: function() {
        for(var i=0; i < upgradesAmount; ++i)
        {
            var upgrade = document.createElement("div");
            $(upgrade).addClass("upgrade");
            $(upgrade).attr("id", upgradesList[i].id);

            var cost = document.createElement("div");
            $(cost).addClass("cost");
            $(cost).text("$"+upgradesList[i].cost);

            var name = document.createElement("div");
            $(name).addClass("name");
            $(name).text(upgradesList[i].name + " " + (upgradesList[i].level+1));

            var effect = document.createElement("div");
            $(effect).addClass("effect");
            if(upgradesList[i].clickGain > 0)
                $(effect).text("+" + upgradesList[i].clickGain + " pts/click");

            if(upgradesList[i].idleGain > 0)
                $(effect).text("+" + upgradesList[i].idleGain + " pts/sec");

            $(upgrade).append(cost);
            $(upgrade).append(name);
            $(upgrade).append(effect);
            $(upgrade).click(this.clickUpgrade);
            $("#upgradesList").append(upgrade);
        }
    },

    updateUpgrade: function(upgradeNumber) {
        var upgrade = document.getElementById(upgradesList[upgradeNumber].id), upgradeChildren = upgrade.childNodes;

        console.log(upgradesList[upgradeNumber].cost);
        // Cost
        $(upgradeChildren[0]).text("$" + upgradesList[upgradeNumber].cost);

        // Name
        $(upgradeChildren[1]).text(upgradesList[upgradeNumber].name + " " + (upgradesList[upgradeNumber].level+1));

        //Effect
        if(upgradesList[upgradeNumber].clickGain > 0)
            $(upgradeChildren[2]).text("+" + upgradesList[upgradeNumber].clickGain + " pts/click");

        if(upgradesList[upgradeNumber].idleGain > 0)
            $(upgradeChildren[2]).text("+" + upgradesList[upgradeNumber].idleGain + " pts/sec");
    },

    updateAll: function() {
        for(var i=0; i < upgradesAmount; ++i)
            this.updateUpgrade(upgradesList[i].id);
    },

    clickUpgrade: function() {
        var upgradeNumber = 0;
        for(var i=0; i < upgradesAmount; ++i)
        {
            if(upgradesList[i].id == $(this).attr("id"))
            {
                upgradeNumber = i;
                break;
            }
        }

        if(cash >= upgradesList[upgradeNumber].cost)
        {
            // Can afford
            Player.clickPower += upgradesList[upgradeNumber].clickGain;
            Player.idlePower += upgradesList[upgradeNumber].idleGain;
            updatePower();

            Player.level += upgradesList[upgradeNumber].playerLevelIncrease;

            cash -= upgradesList[upgradeNumber].cost;
            updateCash();

            upgradesList[upgradeNumber].cost = Math.round(upgradesList[upgradeNumber].cost * upgradesList[upgradeNumber].costMultiplier);
            ++upgradesList[upgradeNumber].level;

            Upgrades.updateUpgrade(upgradeNumber);
        }
        else
        {
            // Insufficient funds
        }
    }
};

var Achievements = {
    build: function() {
        var achievementTiles = document.getElementById("achievementTiles");

        for(var i=0; i < achievementsAmount; ++i)
        {
            var tile = document.createElement("div");
            $(tile).addClass("achievementTile");

            var description = document.createElement("div");
            $(description).addClass("achievementDescription");
            $(description).text("Placeholder");

            var cover = document.createElement("div");
            $(cover).addClass("achievementCover");
            $(cover).addClass("active");

            var achievementImg = document.createElement("img");
            achievementImg.src = "images/achievements/" + achievementsList[i].image;
            achievementImg.alt = achievementsList[i].name;


            $(tile).mouseover(Achievements.showDescription);
            $(tile).mouseout(Achievements.hideDescription);
            $(tile).mousemove(Achievements.adjustDescription);


            $(tile).append(description);
            $(tile).append(cover);
            $(tile).append(achievementImg);
            $(achievementTiles).append(tile);
        }
    },

    // update

    showDescription: function() {
        $(this).children("div.achievementDescription").show();
    },

    hideDescription: function() {
        $(this).children("div.achievementDescription").hide();
    },

    adjustDescription: function() {
        $(this).children("div.achievementDescription").css("left", event.pageX+15);
        $(this).children("div.achievementDescription").css("top", event.pageY);
    }
};

var SmallProject = {
    title: "Title",
    currAmount: 0,
    totalAmount: 0,
    reward: 0,

    updateTitle: function() {
        $("#smallProjectTitle").text(this.title);
    },

    updateAmounts: function() {
        var amounts = $("#smallProjectProgressAmount");
        amounts.children("span.currentAmount").html(this.currAmount);
        amounts.children("span.totalAmount").html(this.totalAmount);

        this.updateProgressBar();
    },

    updateProgressBar: function() {
        var percentage = 100;
        if(this.totalAmount != 0)
            percentage = Math.floor(this.currAmount/this.totalAmount*100);

        $("#smallProjectProgressBarBackground").css("width", percentage+"%");
        $("#smallProjectProgressBarLabel").text(percentage+"%");
    },

    updateReward: function() {
        $("#smallProjectRewardAmount").text(this.reward);
    },

    update: function() {
        this.updateTitle();
        this.updateAmounts();
        this.updateReward();
    },

    getRandomRequirements: function() {
        return randomInteger(Player.level*5, Player.level*10);
    },

    getRandomReward: function() {
        return randomInteger(Player.level*5, Player.level*10);
    },

    shuffle: function() {
        this.title = smallProjectTitles[Math.floor(Math.random()*smallProjectTitlesAmount)];
        this.currAmount = 0;
        this.totalAmount = this.getRandomRequirements();
        this.reward = this.getRandomReward();
        this.update();
    },

    addPoints: function(points) {
        this.currAmount += points;
        if(this.currAmount > this.totalAmount)
            this.currAmount = this.totalAmount;

        // Check if finished project
        if(this.currAmount == this.totalAmount)
        {
            // Project is finished
            cash += this.reward;
            updateCash();
            this.shuffle();

            if(soundsEnabled)
                document.getElementById("cash_in").play();
        }
        this.updateAmounts();
    },

    buttonClick: function() {
        SmallProject.addPoints(Player.clickPower);
    }
};

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
    return Math.floor(Math.random()*(max-min)+min);
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
}

window.onload = init;