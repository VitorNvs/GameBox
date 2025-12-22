const adminMiddleware = (req, res, next) => {
    try {
        const role = req.user.role;
        if(role === "admin"){
            next();
        }else{
            return res.status(401).json({message: 'Usuário sem permissão.'});
        }
    } catch (error) {
        return res.status(401).json({message: 'Usuário sem permissão.'});
    }
    
}

export default adminMiddleware;
