const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});


const createCartReminderEmail = (userEmail, userName, cartItems) => {
  const itemsList = cartItems
    .map(
      (item) =>
        `- ${item.productId?.title || 'Product'} (${item.quantity} x Rs.${item.price})`
    )
    .join('\n');

  return {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: '🛒 Your Cart Items Are Waiting!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; }
          .header { background: #a89160; padding: 20px; text-align: center; color: white; }
          .content { padding: 20px; }
          .cart-items { background: #f5f1e4; padding: 15px; margin: 15px 0; border-radius: 8px; }
          .button { display: inline-block; padding: 12px 24px; background: #a89160; 
                    color: white; text-decoration: none; border-radius: 6px; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Don't Forget Your Cart!</h2>
          </div>
          <div class="content">
            <p>Hi ${userName || 'there'},</p>
            <p>We noticed you still have some items waiting in your cart. They might sell out soon!</p>
            
            <div class="cart-items">
              <h3>Your Cart Items:</h3>
              <pre>${itemsList}</pre>
            </div>
            
            <p>Complete your purchase now before they're gone!</p>
            <a href="https://mofk.netlify.app/user-cart" class="button">Go to Your Cart</a>
            
            <p style="margin-top: 20px;">
              This is an automated reminder. If you've already completed your purchase, 
              please ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};


const createWishlistReminderEmail = (userEmail, userName, wishlistItems) => {
  const itemsList = wishlistItems
    .map(
      (item) =>
        `- ${item.productId?.title || 'Product'} (Rs.${item.productId?.offerPrice || 'N/A'})`
    )
    .join('\n');

  return {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: '💖 Your Wishlist Items Are Waiting!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; }
          .header { background: #a89160; padding: 20px; text-align: center; color: white; }
          .content { padding: 20px; }
          .wishlist-items { background: #f5f1e4; padding: 15px; margin: 15px 0; border-radius: 8px; }
          .button { display: inline-block; padding: 12px 24px; background: #a89160; 
                    color: white; text-decoration: none; border-radius: 6px; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Your Wishlist Awaits!</h2>
          </div>
          <div class="content">
            <p>Hi ${userName || 'there'},</p>
            <p>Some of your favorite items are still in your wishlist — they could sell out anytime!</p>
            
            <div class="wishlist-items">
              <h3>Your Wishlist Items:</h3>
              <pre>${itemsList}</pre>
            </div>
            
            <p>Grab them now while they’re still available!</p>
            <a href="https://mofk.netlify.app/favourite" class="button">View Wishlist</a>
            
            <p style="margin-top: 20px;">
              This is an automated reminder. If you've already purchased these items, 
              please ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

exports.sendCartReminderEmail = async (userEmail, userName, cartItems) => {
  try {
    const mailOptions = createCartReminderEmail(userEmail, userName, cartItems);
    await transporter.sendMail(mailOptions);
    console.log(`🛒 Cart reminder email sent to: ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending cart reminder email:', error);
    return false;
  }
};

exports.sendWishlistReminderEmail = async (userEmail, userName, wishlistItems) => {
  try {
    const mailOptions = createWishlistReminderEmail(userEmail, userName, wishlistItems);
    await transporter.sendMail(mailOptions);
    console.log(`💖 Wishlist reminder email sent to: ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending wishlist reminder email:', error);
    return false;
  }
};
