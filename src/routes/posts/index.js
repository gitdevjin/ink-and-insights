const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/write', upload.array('images'), require('./writePost'));
router.get('/list/:category', require('./readPostAll'));

module.exports = router;
