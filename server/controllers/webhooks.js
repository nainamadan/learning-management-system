// import { Webhook } from "svix";
// import User from "../models/User.js"
// import Course from "../models/Course.js"

// import Stripe from "stripe";
// import { Purchase } from "../models/Purchase.js";
                                      
// // api controller fn to manage cler user with db
//  export const clerkWebhooks=async(req,resp)=>{
// try {
//   // get sceret key
//   const whook=new Webhook(process.env.CLERK_WEBHOOK_SECRET)

//   // verify
//   await whook.verify(JSON.stringify(req.body),{
//     "svix-id":req.headers["svix-id"],
//     "svix-timestamp":req.headers["svix-timestamp"],
//   "svix-signature":req.headers["svix-signature"]
//   })
//   const {data,type}=req.body
//   // differnct cases user created dlted or any other case
//   switch (type) {
//     case 'user.created':
//       {
//         // create data to be stored in db
//         const userData={
//           _id:data.id,
//           email:data.email_address[0].email_address,
//           name:data.first_name+" "+data.last_name,
//           imageUrl:data.image_url,
//         }
//         await User.create(userData)
//         resp.json({})
//         break;
//       }
//        case 'user.updated':{
//           const userData={
//           email:data.email_addresses[0].email_address,
//           name:data.first_name+" "+data.last_name,
//           imageUrl:data.image_url,
//         }
//         await User.findByIdAndUpdate(data.id,userData)
//         resp.json({})
//         break;
//        }
//        case 'user.deleted':
//         {
//           await User.findByIdAndDelete(data.id);
//           resp.json({})
//         break;
//         }
  
//     default:
//       break;
//   }
// } catch (error) {
//   resp.json({success:false,message:error.message})
// }
// }


// // const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const stripeWebHooks = async (req, resp) => {
//   const sig = req.headers["stripe-signature"];

//   let event;

//   try {
//     // Verify webhook signature
//     event = stripeInstance.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );

  
//     console.log("Stripe webhook triggered");
//     console.log("Event Type:", event.type);

//     switch (event.type) {

//       case "payment_intent.succeeded": {
//         const paymentIntent = event.data.object;
//         const paymentIntentId = paymentIntent.id;

//         const session = await stripeInstance.checkout.sessions.list({
//           payment_intent: paymentIntentId,
//         });

//         const { purchaseId } = session.data[0].metadata;

//         const purchaseData = await Purchase.findById(purchaseId);
//         const userData = await User.findById(purchaseData.userId);
//         const courseData = await Course.findById(
//           purchaseData.courseId.toString()
//         );

//         courseData.enrolledStudents.push(userData._id);
//         await courseData.save();

//         userData.enrolledCourses.push(courseData._id);
//         await userData.save();

//         purchaseData.status = "completed";
//         await purchaseData.save();

//         break;
//       }

//       case "payment_intent.payment_failed": {
//         const paymentIntent = event.data.object;
//         const paymentIntentId = paymentIntent.id;

//         const session = await stripeInstance.checkout.sessions.list({
//           payment_intent: paymentIntentId,
//         });

//         const { purchaseId } = session.data[0].metadata;

//         const purchaseData = await Purchase.findById(purchaseId);
//         purchaseData.status = "failed";
//         await purchaseData.save();

//         break;
//       }

//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }

//     resp.json({ received: true });

//   } catch (err) {
//     console.log("Webhook signature verification failed:", err.message);
//     return resp.status(400).send(`Webhook Error: ${err.message}`);
//   }
// };

import { Webhook } from "svix";
import User from "../models/User.js";
import Course from "../models/Course.js";
// import Stripe from "stripe"; ❌ not needed now
import { Purchase } from "../models/Purchase.js";

// ================= CLERK WEBHOOK =================
export const clerkWebhooks = async (req, resp) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.create(userData);
        resp.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        resp.json({});
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        resp.json({});
        break;
      }

      default:
        break;
    }
  } catch (error) {
    resp.json({ success: false, message: error.message });
  }
};

// ================= STRIPE (BYPASSED) =================
export const stripeWebHooks = async (req, resp) => {
  console.log("Stripe is disabled for now");
  return resp.json({
    success: true,
    message: "Stripe webhook bypassed",
  });
};