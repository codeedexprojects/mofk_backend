const cron = require("node-cron");
const Cart = require("../Models/User/CartModel");
const User = require("../Models/User/UserModel");
const { sendCartReminderEmail } = require("../config/emailService");

cron.schedule("0 0 * * *", async () => {
  console.log("Running daily cart reminder job...");

  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const carts = await Cart.find({
    updatedAt: { $lte: oneDayAgo },
    "items.0": { $exists: true },
  }).populate("items.productId", "title price");

  console.log(`🛒 Found ${carts.length} carts eligible for reminder`);

  for (const cart of carts) {
    const user = await User.findById(cart.userId);
    if (!user || !user.email) continue;

    const sent = await sendCartReminderEmail(user.email, user.name, cart.items);
    if (sent) {
      console.log(`✅ Reminder sent to ${user.email}`);
    } else {
      console.log(`❌ Failed to send reminder to ${user.email}`);
    }
  }
});
