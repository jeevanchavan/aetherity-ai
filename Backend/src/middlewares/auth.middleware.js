import jwt from 'jsonwebtoken'

export const authUser = async (req,res,next)=>{
    
    const token = req.cookies.token

    if(!token){
        return res.status(400).json({
            message:"Unauthorized",
            success:false,
            err:"Token not provided"
        })
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded

        next()
    } catch (error) {
        res.status(401).json({
            message:"Unauthorized",
            success:false,
            err:"Invalid token"
        })
    }
}