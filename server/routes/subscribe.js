const express = require("express");
const router = express.Router();

const { Subscriber } = require("../models/Subscriber");

const { auth } = require("../middleware/auth");

//=================================
//             Subscribe
//=================================

/**find out how many people subscribe to this user */
router.post("/subscribeNumber", (req, res) => {
  Subscriber.find({ userTo: req.body.userTo }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);

    res.status(200).json({ success: true, subscribeNumber: subscribe.length });
  });
});

/**to check if i am subscribed to this user */
router.post("/subscribed", (req, res) => {
  Subscriber.find({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);

    let result = false;
    if (subscribe.length !== 0) {
      result = true;
    }
    res.status(200).json({ success: true, subcribed: result });
  });
});

/**subscribe to a user channel */
router.post("/subscribe", async (req, res) => {
  try {
    const subscribe = new Subscriber(req.body);
    await subscribe.save();
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.json({ success: false, err });
  }
});

/**unsubscribe from user channel */
router.post("/unSubscribe", async (req, res) => {
  try {
    const subscription = await Subscriber.findOne({
      userTo: req.body.userTo,
      userFrom: req.body.userFrom,
    });
    await subscription.delete();
    res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
});

module.exports = router;
