const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing, normalizeListings } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing)
    );

// New route (/new will not be compared with /id of other route)
router.get(
    "/new",
    isLoggedIn,
    wrapAsync(listingController.renderNewForm),
);

//search destination route
router.get(
    "/search",
    wrapAsync(listingController.renderSearchPage)
);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListings))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );

// Edit route
router.get(
    "/:id/edit",
    isLoggedIn,
    wrapAsync(listingController.renderEditForm)
);

//categories route
router.get("/filter/:filterId", wrapAsync(listingController.renderFilterPage));

module.exports = router;
