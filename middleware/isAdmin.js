module.exports = function isAdmin(req, res, next) {
    if (!req.user) {
        return res.status(404).render('404', {
            title: '404 - Not Found',
            user: null,
            message: 'The page you are looking for does not exist.'
        });
    }

    if (!['admin', 'owner'].includes(req.user.role)) {
        return res.status(404).render('404', {
            title: '404 - Not Found',
            user: req.user,
            message: 'The page you are looking for does not exist.'
        });
    }

    next();
};