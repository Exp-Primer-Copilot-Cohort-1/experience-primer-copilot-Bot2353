// Create web server
// 1. Create web server
// 2. Create route for comments
// 3. Create route for comment
// 4. Create route for comment edit
// 5. Create route for comment delete
// 6. Create route for comment create
// 7. Create route for comment update

const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// 2. Create route for comments
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // Find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong.");
            res.redirect("/campgrounds");
        } else {
            // Render new comment form
            res.render("comments/new", {campground: campground});
        }
    });
});

// 6. Create route for comment create
router.post("/", middleware.isLoggedIn, function(req, res) {
    // Lookup campground using id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong.");
            res.redirect("/campgrounds");
        } else {
            // Create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                    req.flash("error", "Something went wrong.");
                    res.redirect("/campgrounds");
                } else {
                    // Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save comment
                    comment.save();
                    // Connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    // Redirect to campground show page
                    req.flash("success", "Comment added.");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// 4. Create route for comment edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    // Find campground by id
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err || !foundCampground) {
            console.log