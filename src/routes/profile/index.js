const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/read/:id', require('./readProfile'));
router.put('/edit/:id', require('./editProfile'));
router.get('/get/imageUrl/:id', require('./getProfileImageUrl'));
router.put('/edit/image/:id', upload.single('image'), require('./editProfileImage'));

module.exports = router;
