const express = require('express');
const router = express.Router();
const models = require("./models");

router.get("/", function (req, res) {
    res.redirect("/links");
})

// index of all links
router.get("/links", function (req, res) {
    models.Link.findAll().then(function (links) {
        res.render("index", {
            links: links
        });
    });
});

// create form for link
router.get("/links/create", function (req, res) {
    res.render("form");
})

// create action for link
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
            res.render("form", {
                errors: errors,
                link: link
            })
        }
    })
});

const getLink = function (req, res, next) {
    models.Link.findById(req.params.linkId).then(function (link) {
        if (link) {
            req.link = link;
            next();
        } else {
            res.status(404).send('Not found.');
        }
    })
}

// view link
router.get("/links/:linkId", getLink, function (req, res) {
    req.link.clicks += 1;
    req.link.save().then(function () {
        res.redirect(req.link.url);
    });
});

// edit form for link
router.get("/links/:linkId/edit", getLink, function (req, res) {
    res.render("form", {
        link: req.link,
        action: "/links/" + req.link.id,
        buttonText: "Update link"
    });
})

// edit action for link
router.post("/links/:linkId", getLink, function (req, res) {
    req.checkBody("title", "You must include a title.").notEmpty();
    req.checkBody("url", "Your URL is invalid.").isURL();

    const linkData = {
        title: req.body.title,
        url: req.body.url,
        descr: req.body.descr
    };

    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            req.link.update(linkData).then(function (newLink) {
                res.redirect("/");
            });
        } else {
            const errors = result.mapped();
            res.render("form", {
                link: linkData,
                errors: errors,
                action: "/links/" + req.link.id,
                buttonText: "Update link"
            });
        }
    });
});

// delete action for link
router.post("/links/:linkId/delete", getLink, function (req, res) {
    req.link.destroy().then(function () {
        res.redirect("/");
    });
});

module.exports = router;
