module.exports = {

    /**
     *
     * Show Home Screen 
     */
    dashboard : (req, res) => {
        res.render('admin/dashboard', { title: 'Dashboard' })
    },


}

