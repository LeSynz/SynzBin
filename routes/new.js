const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('new', { title: 'New SynzBin' });
});

module.exports = router;