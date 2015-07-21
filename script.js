/*
Author: Grzegorz Rozdzialik <voreny.gelio@gmail.com>
Configuration
 */
var basePower = 1;
var smallProjectTitles = ["Project 1", "Project 2", "Project 3"];
var upgradesList = [
    {
        id: "upgrade-training",
        name: "Training",
        cost: 5,
        costMultiplier: 1.3, // amount by which cost is multiplied with each upgrade
        clickGain: 2,
        passiveGain: 0
    },
    {
        id: "upgrade-course",
        name: "Programming course",
        cost: 10,
        costMultiplier: 1.3,
        clickGain: 4,
        passiveGain: 0
    }
];
var soundsEnabled = true;



var cash = 0;


var smallProjectTitlesAmount = smallProjectTitles.length;
var upgradesAmount = upgradesList.length;

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
            $(name).text(upgradesList[i].name);

            var effect = document.createElement("div");
            $(effect).addClass("effect");
            if(upgradesList[i].clickGain > 0)
                $(effect).text("+" + upgradesList[i].clickGain + " pts/click");

            if(upgradesList[i].passiveGain > 0)
                $(effect).text("+" + upgradesList[i].passiveGain + " pts/sec");

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
        $(upgradeChildren[1]).text(upgradesList[upgradeNumber].name);

        //Effect
        if(upgradesList[upgradeNumber].clickGain > 0)
            $(upgradeChildren[2]).text("+" + upgradesList[upgradeNumber].clickGain + " pts/click");

        if(upgradesList[upgradeNumber].passiveGain > 0)
            $(upgradeChildren[2]).text("+" + upgradesList[upgradeNumber].passiveGain + " pts/sec");
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
            Player.power += upgradesList[upgradeNumber].clickGain;

            cash -= upgradesList[upgradeNumber].cost;
            updateCash();

            upgradesList[upgradeNumber].cost = Math.round(upgradesList[upgradeNumber].cost * upgradesList[upgradeNumber].costMultiplier);
            Upgrades.updateUpgrade(upgradeNumber);
        }
        else
        {
            // Insufficient funds
        }
    }
};

var Player = {
    power: basePower
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

    shuffle: function() {
        this.title = smallProjectTitles[Math.floor(Math.random()*smallProjectTitlesAmount)];
        this.currAmount = 0;
        this.totalAmount = randomInteger(5,15);
        this.reward = randomInteger(5, 15);
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
        SmallProject.addPoints(Player.power);
    }
};

function updateCash()
{
    $("#cash").text("$"+cash);
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

    $("#smallProjectReward").css("line-height", $("#smallProjectProgressBar").outerHeight()+"px");

    $("#smallProjectWorkButton").click(SmallProject.buttonClick);

    updateCash();
    SmallProject.shuffle();
}

window.onload = init;