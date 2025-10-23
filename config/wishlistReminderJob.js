const cron = require("node-cron");
const Wishlist = require("../Models/User/WishlistModel");
const User = require("../Models/User/UserModel");
const { sendWishlistReminderEmail } = require("../config/emailService");

cron.schedule("0 0 * * *", async () => {
  console.log("Running daily wishlist reminder job...");

  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const wishlists = await Wishlist.find({
    updatedAt: { $lte: oneDayAgo },
    "items.0": { $exists: true },
  }).populate("items.productId", "title offerPrice");

  console.log(`💖 Found ${wishlists.length} wishlists for reminder`);

  for (const wishlist of wishlists) {
    const user = await User.findById(wishlist.userId);
    if (!user || !user.email) continue;

    try {
      await sendWishlistReminderEmail(user.email, user.name, wishlist.items);
    } catch (err) {
      console.error(`Failed to send wishlist email to ${user.email}:`, err);
    }
  }
});
