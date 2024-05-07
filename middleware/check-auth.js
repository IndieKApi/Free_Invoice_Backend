const jsw = require("jsonwebtoken")

module.exports = (req,res,next) => {

    const authtoken = req.get('token');
    const authUserId = req.get('userId');
    //console.log(`${authtoken} and user id is ${authUserId}`);

    if(!authtoken || !authUserId)
    {   
        const error = new Error("Please Login");
        error.statusCode = 401;
        next(error);
    }


    else
    {   
        try{
            const verify = jsw.verify(authtoken,'invoice');
            req.userId = verify.userId;
            next();
        }
        catch(error)
        {   
            if (error.name === 'TokenExpiredError') {
                const expiredError = new Error('Token expired, Please Again Login!');
                expiredError.statusCode = 401;
                next(expiredError);
            } 
            
            else if (error.name === 'JsonWebTokenError') {
                const invalidTokenError = new Error('Invalid token');
                invalidTokenError.statusCode = 401;
                next(invalidTokenError);
            } 
            
            else {
                error.statusCode = 404;
                next(error);
            }
        }
        
    }

    
};