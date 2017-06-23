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

// view link
router.get("/links/:linkId", function (req, res) {
    models.Link.findById(req.params.linkId).then(function (link) {
        if (link) {
            link.clicks += 1;
            link.save().then(function () {
                res.redirect(link.url);
            });
        } else {
            res.status(404).send('Not found.');
        }
    });
});

// edit form for link
router.get("/links/:linkId/edit", function (req, res) {
    models.Link.findById(req.params.linkId).then(function (link) {
        if (link) {
            res.render("form", {
                link: link,
                action: "/links/" + link.id,
                buttonText: "Update link"
            });
        } else {
            res.status(404).send('Not found.');
        }
    })
})

// edit action for link
router.post("/links/:linkId", function (req, res) {
    req.checkBody("title", "You must include a title.").notEmpty();
    req.checkBody("url", "Your URL is invalid.").isURL();

    const linkData = {
        title: req.body.title,
        url: req.body.url,
        descr: req.body.descr
    };

    models.Link.findById(req.params.linkId).then(function (link) {
        if (link) {
            req.getValidationResult().then(function (result) {
                if (result.isEmpty()) {
                    link.update(linkData).then(function (newLink) {
                        res.redirect("/");
                    });
                } else {
                    const errors = result.mapped();
                    res.render("form", {
                        link: linkData,
                        errors: errors,
                        action: "/links/" + link.id,
                        buttonText: "Update link"
                    });
                }
            });
        } else {
            res.status(404).send('Not found.');
        }
    })
});

// delete action for link
router.post("/links/:linkId/delete", function (req, res) {
    models.Link.findById(req.params.linkId).then(function (link) {
        if (link) {
            link.destroy().then(function () {
                res.redirect("/");
            })
        } else {
            res.status(404).send('Not found.');
        }
    })
});

module.exports = router;
