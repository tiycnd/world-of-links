const express = require('express');
const router = express.Router();
const models = require("./models");

router.get("/", function (req, res) {
    res.redirect("/links");
})

router.get("/links", function (req, res) {
    models.Link.findAll().then(function (links) {
        res.render("index", {links: links});
    });
});

router.get("/links/create", function (req, res) {
   res.render("links_create");
})

router.post("/links", function (req, res) {
    models.Link.create(req.body).then(function (link) {
        res.redirect("/");
    });
});

router.get("/links/:linkId", function (req, res) {
    res.send("go to a link");
});

router.post("/links/:linkId", function (req, res) {
    res.send("edit a link");
});

router.delete("/links/:linkId", function (req, res) {
    res.send("delete a link");
});

module.exports = router;