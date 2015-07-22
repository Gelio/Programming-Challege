var achievementsList = [
    {
        id: "achievementFirstStep",
        name: "First step",
        image: "first.png",
        type: "projectsCompleted",
        goal: 1,
        completed: false
    },
    {
        id: "achievementFive",
        name: "5 projects",
        image: "five.png",
        type: "projectsCompleted",
        goal: 5,
        completed: false
    }
];

var achievementsAmount = achievementsList.length;

// TODO: types: bigProjectsCompleted, pts/click, pts/sec
var achievementsTypes = {
    projectsCompleted: [],
    totalCash: []
};

var Achievements = {
    build: function() {
        this.parse();

        var achievementTiles = document.getElementById("achievementTiles");

        for(var i=0; i < achievementsAmount; ++i)
        {
            var tile = document.createElement("div");
            $(tile).addClass("achievementTile");
            $(tile).attr("id", achievementsList[i].id);

            var description = document.createElement("div");
            $(description).addClass("achievementDescription");
            //$(description).text("Placeholder");

            var cover = document.createElement("div");
            $(cover).addClass("achievementCover");
            if(!achievementsList[i].completed)
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
        this.updateAll();
    },

    parse: function() {
        for(var i=0; i < achievementsAmount; ++i)
        {
            switch(achievementsList[i].type)
            {
                case "projectsCompleted":
                    achievementsTypes.projectsCompleted[achievementsTypes.projectsCompleted.length] = achievementsList[i].id;
                    break;

                case "totalCash":
                    achievementsTypes.totalCash[achievementsTypes.totalCash.length] = achievementsList[i].id;
                    break;

                default:
                    // Unknown type
                    console.log("achievement number " + (i+1) + "(" + achievementsList[i].name + ") does not have an appropriate type, fix it");
                    break;
            }
        }
    },

    updateAchievementById: function(achievementId) {
        var i = 0;
        for(i=0; i < achievementsAmount; ++i)
        {
            if(achievementsList[i].id == achievementId)
                break;
        }

        var achievementTile = document.getElementById(achievementId);
        var valueToInsert = achievementsList[i].goal;

        // Description
        switch(achievementsList[i].type)
        {
            case "projectsCompleted":
                if(!achievementsList[i].completed)
                    valueToInsert = Player.projectsCompleted;

                $(achievementTile).children("div.achievementDescription").html("<span class=\"achievementTitle\">" + achievementsList[i].name + "</span>" + valueToInsert + " / " + achievementsList[i].goal + " projects completed");
                break;

            case "totalCash":
                if(!achievementsList[i].completed)
                    valueToInsert = cash;

                $(achievementTile).children("div.achievementDescription").html("<span class=\"achievementTitle\">" + achievementsList[i].name + "</span>" + valueToInsert + " / " + achievementsList[i].goal + " cash");
                break;

            default:
                // Unknown type
                break;
        }

        // Cover
        if(achievementsList[i].completed)
            $(achievementTile).children("div.achievementCover").removeClass("active");
        else
            $(achievementTile).children("div.achievementCover").addClass("active");
    },

    updateAll: function() {
        for(var i=0; i < achievementsAmount; ++i)
            this.updateAchievementById(achievementsList[i].id);
    },

    checkAchievementsType: function(achievementType) {
        switch(achievementType) {
            case "projectsCompleted":
                for(var i=0; i < achievementsTypes.projectsCompleted.length; ++i)
                {
                    var achievementNumber = 0;
                    for( ; achievementNumber < achievementsAmount; ++achievementNumber)
                    {
                        if(achievementsList[achievementNumber].id == achievementsTypes.projectsCompleted[i])
                            break;
                    }

                    if(!achievementsList[achievementNumber].completed)
                    {
                        if(Player.projectsCompleted >= achievementsList[achievementNumber].goal)
                            achievementsList[achievementNumber].completed = true;
                    }
                    this.updateAchievementById(achievementsList[achievementNumber].id);
                }
                break;

            case "totalCash":
                for(var i=0; i < achievementsTypes.totalCash.length; ++i)
                {
                    var achievementNumber = 0;
                    for( ; achievementNumber < achievementsAmount; ++achievementNumber)
                    {
                        if(achievementsList[achievementNumber].id == achievementsTypes.totalCash[i])
                            break;
                    }

                    if(!achievementsList[achievementNumber].completed)
                    {
                        if(cash >= achievementsList[achievementNumber].goal)
                            achievementsList[achievementNumber].completed = true;
                    }
                    this.updateAchievementById(achievementsList[achievementNumber].id);
                }
                break;

            default:
                console.log("uknown achievement type to be checked: "+ achievementType);
                break;
        }
    },

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