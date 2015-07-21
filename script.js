var basePower = 1;
var smallProjectTitles = ["Project 1", "Project 2", "Project 3"];
var soundsEnabled = true;



var cash = 0;


var smallProjectTitlesAmount = smallProjectTitles.length;
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
        this.totalAmount = Math.floor(Math.random()*8+2);
        this.reward = Math.floor(Math.random()*10+1);
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
    }
};

function updateCash()
{
    $("#cash").text("$"+cash);
}

function smallProjectButtonClick()
{
    SmallProject.addPoints(Player.power);
}

function init()
{

    var upgrades = $(".upgrade");
    upgrades.mouseover(function() { $(this).children(".name").addClass("bold");});
    upgrades.mouseout(function() { $(this).children(".name").removeClass("bold");});

    $("#smallProjectReward").css("line-height", $("#smallProjectProgressBar").outerHeight()+"px");

    $("#smallProjectWorkButton").click(smallProjectButtonClick);

    updateCash();
    SmallProject.shuffle();
}

window.onload = init;