const jwt = require("jsonwebtoken");

// Verify Token
function verifyToken(req,res,next){
    const authToken = req.headers.authorization;
    if(authToken){
       const token = authToken.split(" ")[1];
       try{
             const decodePayload = jwt.verify(token,process.env.JWT_SECRET);
             req.user = decodePayload;
             next();
       }catch(error){
            return res.status(401).json({message: "invalid token,access denied"})
       }
    }else {
        return res.status(401).json({message: "invalid token,access denied"});
    }
}



//verify Token & Admin 
function verifyTokenAndAdmin(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }else{
     return res.status(403).json({message: "not allowed only Admin"})

        }
    });
}




//verify Token & Only User Himself
function verifyTokenAndOnlyUser(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id){
            next();
        }else{
     return res.status(403).json({message: "not allowed only Admin"})

        }
    });
}


//verify Token & Authorization
function verifyTokenAndAuthorization(req, res, next){
    verifyToken(req, res, () =>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
     return res.status(403).json({message: "not allowed,only user himself or Admin"})

        }
    });
}


module.exports = {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndOnlyUser,
    verifyTokenAndAuthorization
}