const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/write', upload.array('images'), require('./writePost'));
router.get('/read/:id', require('./readPostOne'));

router.get('/edit/:id', require('./readPostOne'));
router.put('/edit/:id', upload.array('images'), require('./editPost'));

router.delete('/delete/:id', require('./deletePost'));

router.get('/list/:subcategory', require('./readPostAll'));

module.exports = router;
