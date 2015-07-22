var possibleColors = ["red", "blue"];
var bigProjectTitles = ["Big project 1", "Big project 2", "Big project 3"];
var bigProjectTitlesAmount = bigProjectTitles.length;

var BigProject = {
    title: "Big project title",
    reward: 0,
    goals: [],

    getProgress: function() {
        var currAmount = 0, totalAmount = 0;
        for(var i=0; i < this.goals.length; ++i)
        {
            currAmount += this.goals[i].currAmount;
            totalAmount += this.goals[i].totalAmount;
        }
        return Math.round(currAmount/totalAmount*100);
    },

    updateTitle: function() {
        $("#bigProjectTitle").text(this.title);
    },

    updateReward: function() {
        $("#bigProjectReward").text("$"+this.reward);
    },

    updateProgress: function() {
        var percentage = this.getProgress();
        $("#bigProjectMainProgressBarBackground").css("width", percentage+"%");
        $("#bigProjectMainProgressBarLabel").text(percentage+"%");

        if(percentage == 100)
        {
            // Finished project
            cash += this.reward;
            Achievements.checkAchievementsType("totalCash");
            updateCash();

            ++Player.bigProjectsCompleted;
            Achievements.checkAchievementsType("bigProjectsCompleted");

            ++Player.projectsCompleted;
            Achievements.checkAchievementsType("projectsCompleted");

            for(var i=0; i < this.goals.length; ++i)
                this.goals[i].destroyGoal();
            this.goals = [];

            if(soundsEnabled)
                document.getElementById("cash_in").play();

            this.shuffle();
        }
    },

    updateAll: function() {
        this.updateTitle();
        this.updateReward();
        this.updateProgress();
    },

    getRandomReward: function() {
        return randomInteger(Player.level*5, Player.level*10);
    },

    shuffle: function() {
        this.reward = this.getRandomReward();
        var goals = randomInteger(2, 3);
        for(var i=0; i < goals; ++i)
        {
            var newGoal = new BigProjectGoal();
            newGoal.id = "goal-"+i;
            newGoal.totalAmount = 5;
            newGoal.color = possibleColors[randomInteger(0, possibleColors.length-1)];
            newGoal.createGoal();
        }

        this.updateAll();
    }
};

function BigProjectGoal() {
    this.id = "goal-1";
    this.currAmount = 0;
    this.totalAmount = 0;
    this.color = "red";
    this.completed = false;

    this.update = function() {
        var goal = $("#"+this.id);

        if(this.completed)
            return;

        var percentage = Math.round(this.currAmount/this.totalAmount*100);
        if(percentage == 100)
        {
            this.completed = true;
            $(goal).find(".goalButton").hide();
        }


        $(goal).find(".progressBarBackground").css("width", percentage+"%");
        $(goal).find(".progressBarLabel").text(percentage+"%");

        $(goal).find(".currentAmount").text(this.currAmount);
        $(goal).find(".totalAmount").text(this.totalAmount);
    };

    this.addProgress = function(amount) {
        if(this.completed)
            return;

        this.currAmount += amount;
        if(this.currAmount > this.totalAmount)
            this.currAmount = this.totalAmount;

        this.update();
    };

    this.destroyGoal = function() {
        console.log("destroy #"+this.id);
        $("#"+this.id).remove();
    };

    this.createGoal = function() {
        var goal = document.createElement("div");
        $(goal).addClass("projectGoal");
        $(goal).attr("id", this.id);

        var goalBarAndAmount = document.createElement("div");
        $(goalBarAndAmount).addClass("goalBarAndAmount");

            var goalBar = document.createElement("div");
            $(goalBar).addClass("projectGoalBar");
            $(goalBar).addClass(this.color);

            var progressBarBackground = document.createElement("div");
            $(progressBarBackground).addClass("progressBarBackground");
            var progressBarLabel = document.createElement("div");
            $(progressBarLabel).addClass("progressBarLabel");
            $(progressBarLabel).text("0%");

            var goalAmount = document.createElement("div");
            $(goalAmount).addClass("projectGoalAmount");
            $(goalAmount).html("<span class=\"currentAmount\">0</span>\
            /\
            <span class=\"totalAmount\">0</span>");

            $(goalBar).append(progressBarBackground);
            $(goalBar).append(progressBarLabel);
        $(goalBarAndAmount).append(goalBar);
        $(goalBarAndAmount).append(goalAmount);
        $(goal).append(goalBarAndAmount);


        var goalButton = document.createElement("div");
        $(goalButton).addClass("goalButton");

            var goalClickImg = document.createElement("img");
            goalClickImg.src = "images/keyboard.png";
            goalClickImg.alt = "Work";
            $(goalClickImg).attr("id", this.id + "button");
            $(goalClickImg).click(goalButtonClick);

            $(goalButton).append(goalClickImg);
        $(goal).append(goalButton);

        var clear = document.createElement("div");
        $(clear).addClass("clear");

        $(goal).append(clear);

        $("#bigProjectGoals").append(goal);

        BigProject.goals[BigProject.goals.length] = this;

        this.update();
    }
}


function goalButtonClick()
{
    var goalID = $(this).attr("id").substr(0, $(this).attr("id").indexOf("button"));

    for(var i=0; i < BigProject.goals.length; ++i)
    {
        if(BigProject.goals[i].id == goalID)
        {
            BigProject.goals[i].addProgress(Player.clickPower);

            BigProject.updateProgress();
            break;
        }
    }
}