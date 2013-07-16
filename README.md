gittip-gdoc
===========

Extract records from a Google Doc spreadsheet and bulk set the results on [Gittip](https://www.gittip.com/).

This script was made to make it easy for devs at [Khan Academy](https://www.khanacademy.org/) to give an aggregate donation via the [Khan Academy Gittip account](https://www.gittip.com/khanacademy/). More information at:
http://ejohn.org/blog/gittip-at-khan-academy/

===Setting up the Spreadsheet===

In order to use this you'll need to clone the following Google Doc and configure it to work with your own use case.

https://docs.google.com/a/khanacademy.org/spreadsheet/ccc?key=0ApubWHv0aMirdEMyYzBFU1ljTzU2TzMwMS1fT2czRGc

You'll also need to make sure that the spreadsheet is set to be automatically published to the web. This can be enabled by going to "File > Publish to the web...".

===Configuration===

Once you've done this you'll need to copy `sample.config.json` to `config.json` and then complete the properties, specifically:

**The Google Doc spreadsheet key (gdoc_key).** For example given the above form the key would be: `0ApubWHv0aMirdEMyYzBFU1ljTzU2TzMwMS1fT2czRGc`.

**Your Gittip API Key (gittip_api_key).** This can be found by going to your profile page.

**You max per-user contribution (gittip_max_per_user).** This is the maximum amount (in dollars) that a user can contribute.

===Usage===

Finally you'll need to make sure that you have [Node](http://nodejs.org/) installed. You'll then need to run the following inside this directory to initialize the script's dependencies:

	npm install

Finally, to run the script you'll run:

	node pay.js
