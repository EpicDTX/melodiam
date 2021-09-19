var express = require('express');
var router = express.Router();
const axios = require('axios');
const client_id = 'MjM0MDA2Mjl8MTYzMjAyODM5OS44OTc4NTYy';


/* GET home page. */
router.get('/:performer/:performer_id', async function(req, res, next) {
    const query = req.params.performer;
    const performer_id = req.params.performer_id;

    try{
        url = `https://api.seatgeek.com/2/performers?q=${query}&client_id=${client_id}`;
        const performer = await axios.get(url).then(function (data) {
            if(data.data.performers.length > 0) {
                var i = 0;
                for (const performer of data.data.performers) {
                    if(performer.name === query.replace("-", " ")){
                        return data.data.performers[i];
                    }
                    i++;
                }
                return "None";
            }
            return "None";
        }, function(err) {
            res.render('error', { error: err });
        });

        if(performer === "None") {
            has_events = false;
            performer_name = query.replace("-", " ");
            res.render('show-event', {performer, performer_name, performer_id, has_events})
        }else{

            has_events = performer.has_upcoming_events;

            if(has_events) {
                url = `https://api.seatgeek.com/2/events?q=${query}&client_id=${client_id}`;
                const response = await axios.get(url).then(function (data) {
                    // res.json(data.data.events)
                    return data.data.events;
                }, function(err) {
                    res.render('error', { error: err });
                });

                var events = [];
                for (const event of response) {
                    for (const event_performer of event.performers) {
                        if(event_performer.name === performer.name){
                            events.push(event);
                        }
                    }
                }

                const num_events = events.length;

                res.render('show-event', {performer, performer_id, has_events, num_events, events})
            }else{
                res.render('show-event', {performer, performer_id, has_events})
            }
        }
    }
    catch(err){
        res.render('error', { error: err });
    }

    
});

module.exports = router;