var express = require('express');
var sign = require('./controller/sign');
var post = require('./controller/post');
var config = require('./config');
var store = require('./controller/store');
var auth = require('./middlewares/auth');

var router = express.Router();

router.get('/', post.index);
router.get('/reg', sign.showRegister);
router.post('/reg', sign.register);
router.get('/login', sign.showLogin);
router.post('/login', sign.login);

router.get('/logout', sign.logout);

router.get('/post', auth.userRequired, post.showPost);
router.post('/post', auth.userRequired, post.post);


router.get('/upload', auth.userRequired, store.showUpload);
router.post('/upload', auth.userRequired, store.upload);

router.get('/u/:author', post.searchUserPost);
router.get('/post/:pid', post.showOnePost);
router.post('/post/:pid', post.saveComments);

router.get('/edit/:pid', auth.userRequired, post.showUpdatePost);
router.post('/edit/:pid', auth.userRequired, post.updatePost);

router.get('/remove/:pid', auth.userRequired, post.removePost);

router.get('/archive', post.archive);

router.get('/tags', post.getTags);
router.get('/tags/:tag', post.getTagPosts);

router.get('/search', post.search);

router.get('*', post.pageNotFound);
module.exports = router;