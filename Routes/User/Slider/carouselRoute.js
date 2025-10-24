const express = require('express');
const router = express.Router();
const SliderController = require('../../../Controllers/User/Slider/carouselController')


router.get('/view-carousels', SliderController.getAllSliders)


module.exports = router;