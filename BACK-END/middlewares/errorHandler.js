function errorHandler(err, req, res, next) {
    console.error(err.stack);
    
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
            success: false,
            error: "OAB já cadastrada no sistema"
        });
    }
    
    res.status(500).json({
        success: false,
        error: err.message || "Erro no servidor"
    });
}



module.exports = errorHandler;