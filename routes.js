const express = require('express');
const router = express.Router();
const models = require("./models");

router.get("/", function (req, res) {
    res.redirect("/links");
})

router.get("/links", function (req, res) {
    models.Link.findAll().then(function (links) {
        res.render("index", {
            links: links
        });
    });
});

router.get("/links/create", function (req, res) {
    res.render("links_create");
})

router.post("/links", function (req, res) {
    req.checkBody("title", "You must include a title.").notEmpty();
    req.checkBody("url", "Your URL is invalid.").isURL();

    const linkData = {
        title: req.body.title,
        url: req.body.url,
        descr: req.body.descr
    };

    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            models.Link.create(linkData).then(function (link) {
                res.redirect("/");
            });
        } else {
            const link = models.Link.build(linkData);
            const errors = result.mapped();
            res.render("links_create", {errors: errors, link: link})
        }
    })
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
