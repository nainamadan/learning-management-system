// // only educator can add courses
// import { clerkClient } from "@clerk/express";

// const protectEducator=async(req,resp,next)=>{
// try {
//   const userId=req.auth.userId
//   // getuser
//   const response=await clerkClient.users.getUser(userId)
//   // check public meta data if it is educator can add course if not return false
//   if(response.publicMetadata.role!=='educator'){
//     return resp.json({success:false,message:'unauthorized acccess'})
//   }
//   next()

// } catch (error) {
//   resp.json({success:false,message:error.message})
// }
// }



import { clerkClient } from "@clerk/express";

// only educator can add courses
const protectEducator = async (req, res, next) => {
  try {
    // ✅ NEW Clerk syntax
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // get user from Clerk
    const user = await clerkClient.users.getUser(userId);

    // check role from public metadata
    if (user.publicMetadata?.role !== "educator") {
      return res.status(403).json({
        success: false,
        message: "Only educators can add courses"
      });
    }

    // optional: attach user to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default protectEducator;
