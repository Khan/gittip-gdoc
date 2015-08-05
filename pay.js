var fs = require("fs"),
    request = require("request"),
    csv = require("csv"),
    conf = require("./config.json");

if (!conf.gdoc_key || !conf.gittip_api_key) {
    console.error("Please provide a Google Doc spreadsheet key and a Gittip API key.");
    process.exit(1);
}

var sourceData = "https://docs.google.com/spreadsheet/pub?&output=csv&key=" +
    conf.gdoc_key;

var API_KEY = conf.gittip_api_key;
var API_USER = conf.gittip_username;

var MAX_PER_USER = conf.gittip_max_per_user;

var users;
var amounts;

request.get(sourceData, function(e, r, csvData) {
    csv().from(csvData).on("record", function(row, i) {
        if (i === 3) {
            users = row.slice(2).map(function(user) {
                return user.replace(/\s*\(.*$/, "");
            });

        } else if (i === 4) {
            amounts = row.slice(2).map(function(amount) {
                return amount - 0;
            });

        } else if (i >= 5) {
            var dev = row[0];
            var total = row[1] - 0;

            if (total > MAX_PER_USER) {
                console.error("%s is giving too much! (%s)", dev, total);
            }
        }
    })
    .on("end", function() {
        var total = 0;
        var payload = users.map(function(user, i) {
            var amount = amounts[i];
            var fixedUser = user.replace(/^(\w+):/, "");

            var platform = fixedUser !== user ? ({
                gh: "github",
                tw: "twitter"
            })[RegExp.$1] : "gittip";

            if (platform === "gittip") {
                return {
                    username: fixedUser,
                    platform: platform,
                    amount: amount.toString()
                };

            } else {
                console.log( fixedUser + " (" + platform + ") is not on Gittip!" );
            }
        }).filter(function(user) {
            if (user && user.amount) {
                total += parseFloat(user.amount);
            }
            return !!user;
        });

        var options = {
            url: "https://www.gittip.com/" + API_USER + "/tips.json",
            json: payload,
            auth: {
                user: API_KEY,
                pass: ""
            }
        };

        request.post(options, function(err, res, body) {
            if (res.statusCode === 200) {
                console.log("DONE: " + total + " given to " + payload.length + " user(s).");
            } else {
               console.error("There was a problem sending to the Gittip API. It returned a " + res.statusCode + ".");
            }
        });
    });
});
