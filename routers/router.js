const Router = require('express');
const router = new Router();
const Controller = require('../controllers/controller');

router.post('/search', Controller.addArticles);
router.get('/search', Controller.getArticles);
router.put('/search/:id', Controller.updateArticle);
router.delete('/search/:id', Controller.deleteArticle);

module.exports = router;
