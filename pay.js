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
        var payload = users.map(function(user, i) {
            var platform = /(gh:)/.test(user) ? "github" : "gittip";
            var amount = amounts[i];
            user = user.replace(/(gh:)/, "");

            if (platform === "gittip") {
                return {
                    username: user,
                    platform: platform,
                    amount: amount.toString()
                };
            }
        }).filter(function(user) {
            return !!user;
        });

        var options = {
            url: "https://www.gittip.com/khanacademy/tips.json",
            json: payload,
            auth: {
                user: API_KEY,
                pass: ""
            }
        };

        request.post(options, function(err, res, body) {
            // TODO(john): DONE!
        });
    });
});
