var express = require('express');
var sign = require('./controller/sign');
var post = require('./controller/post');
var images = require('./controller/images');
var config = require('./config');
var store = require('./controller/store');
var auth = require('./middlewares/auth');
var compre = require('./controller/compre');

var router = express.Router();

router.get('/', post.index);

router.get('/images', images.showImages);
router.get('/iremove/:iid', auth.userRequired, images.removeImage);

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
router.get('/images/:imgid', images.showOneImage);

router.get('/edit/:pid', auth.userRequired, post.showUpdatePost);
router.post('/edit/:pid', auth.userRequired, post.updatePost);

router.get('/remove/:pid', auth.userRequired, post.removePost);

router.get('/archive', post.archive);

router.get('/tags', post.getTags);
router.get('/tags/:tag', post.getTagPosts);

router.get('/search', compre.search);

router.get('*', post.pageNotFound);
module.exports = router;