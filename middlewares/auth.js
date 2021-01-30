const jwt =require('jsonwebtoken');
const auth =(req,res,next)=>{
    try {
        const token =req.header('x-auth-header');
        if(!token)
            return res.status(401).json({msg:"unauthorised access "}); 
        const verified =jwt.verify(token,process.env.JWT_SECRET);
        if(!verified)
            return res.status(401).json({msg:"Token verification failed, user access denied !"}); 
        req.user=verified.id;
        next();
        
    } catch (error) {
        return res.status(500).json({err:error.message});
    }
}

module.exports=auth;