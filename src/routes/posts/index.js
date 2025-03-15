const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/write', upload.array('images'), require('./writePost'));
router.get('/read/:id', require('./readPostOne'));

router.get('/edit/:id', require('./readPostOne'));
router.post('/edit/:id', require('./editPost'));

router.get('/list/:category', require('./readPostAll'));

module.exports = router;
