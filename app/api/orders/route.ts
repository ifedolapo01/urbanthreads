// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/supabase/db';
import { sendOrderEmail } from '@/lib/email'; // Import your email service

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const order = await createOrder(body);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Send confirmation email to customer
    try {
      const customerEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for shopping with UrbanThreads</p>
          </div>
          <div class="content">
            <p>Dear ${body.customer_name},</p>
            <p>Your order <strong>#${body.order_number}</strong> has been received and is being processed.</p>
            
            <div class="order-details">
              <h3>📦 Order Summary</h3>
              <p><strong>Order Number:</strong> ${body.order_number}</p>
              <p><strong>Total Amount:</strong> ₦${body.total_amount.toLocaleString()}</p>
              <p><strong>Delivery Method:</strong> ${body.delivery_option === 'pickup' ? 'Store Pickup' : 'Delivery'}</p>
              
              ${body.delivery_option === 'delivery' ? 
                `<p><strong>Delivery Address:</strong> ${body.delivery_address}, ${body.city}</p>` : 
                `<p><strong>Pickup Address:</strong> Suite 5, XYZ Plaza, Central Business District, Abuja</p>`
              }
              
              <p><strong>Status:</strong> Pending (Payment verification in progress)</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-NG', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            
            <h3>🛍️ Order Items</h3>
            <ul>
              ${body.items.map((item: any) => `
                <li>${item.product_name} - ₦${item.price.toLocaleString()} × ${item.quantity}</li>
              `).join('')}
            </ul>
            
            <p><strong>📝 Next Steps:</strong></p>
            <ol>
              <li>Our team will verify your payment receipt</li>
              <li>You'll receive another email when your order is confirmed</li>
              <li>${body.delivery_option === 'pickup' ? 'We\'ll notify you when your order is ready for pickup' : 'We\'ll notify you when your order is shipped'}</li>
            </ol>
            
            <p>If you have any questions, reply to this email or contact us at:</p>
            <p>📞 0800-URBAN-THREADS<br>
            ✉️ support@urbanthreads.com</p>
            
            <p>Best regards,<br>
            <strong>The UrbanThreads Team</strong></p>
          </div>
          <div class="footer">
            <p>UrbanThreads Clothing Store<br>
            Abuja, Nigeria</p>
          </div>
        </body>
        </html>
      `;

      // Send email to customer
      await sendOrderEmail(
        body.customer_email,
        `Order Confirmation - #${body.order_number}`,
        customerEmailHtml
      );
      
      console.log(`✅ Confirmation email sent to customer: ${body.customer_email}`);
    } catch (emailError) {
      console.error('❌ Failed to send customer email (order still saved):', emailError);
      // Don't fail the order if email fails
    }

    // Send notification email to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'your-admin-email@example.com';
      
      const adminEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #DC2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .alert { background: #fef2f2; padding: 20px; margin: 20px 0; border-left: 4px solid #DC2626; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background: #f3f4f6; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📦 New Order Received!</h1>
          </div>
          
          <div class="alert">
            <h2>Order #${body.order_number}</h2>
            <p><strong>Customer:</strong> ${body.customer_name}</p>
            <p><strong>Email:</strong> ${body.customer_email}</p>
            <p><strong>Phone:</strong> ${body.customer_phone}</p>
            <p><strong>Total Amount:</strong> ₦${body.total_amount.toLocaleString()}</p>
            <p><strong>Payment:</strong> Pending verification</p>
            <p><strong>Receipt:</strong> <a href="${body.receipt_url}">View Receipt</a></p>
          </div>
          
          <h3>Order Details:</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Size</th>
                <th>Color</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${body.items.map((item: any) => `
                <tr>
                  <td>${item.product_name}</td>
                  <td>₦${item.price.toLocaleString()}</td>
                  <td>${item.quantity}</td>
                  <td>${item.size || '-'}</td>
                  <td>${item.color || '-'}</td>
                  <td>₦${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
              <tr style="font-weight: bold;">
                <td colspan="5" style="text-align: right;">Total:</td>
                <td>₦${body.total_amount.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          
          <h3>Delivery Information:</h3>
          <p><strong>Method:</strong> ${body.delivery_option === 'pickup' ? 'Store Pickup' : 'Delivery'}</p>
          ${body.delivery_option === 'delivery' ? `
            <p><strong>Address:</strong> ${body.delivery_address}, ${body.city}</p>
            <p><strong>State:</strong> ${body.selected_state}</p>
          ` : `
            <p><strong>Pickup Location:</strong> Store pickup</p>
          `}
          
          <p><strong>Order Time:</strong> ${new Date().toLocaleString('en-NG')}</p>
          
          <p style="margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/orders" 
               style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View in Admin Panel
            </a>
          </p>
          
          <hr style="margin: 30px 0;">
          <p><small>This is an automated notification from UrbanThreads Store System</small></p>
        </body>
        </html>
      `;

      // Send email to admin
      await sendOrderEmail(
        adminEmail,
        `🆕 New Order #${body.order_number} - ₦${body.total_amount.toLocaleString()}`,
        adminEmailHtml
      );
      
      console.log(`✅ Notification email sent to admin: ${adminEmail}`);
    } catch (adminEmailError) {
      console.error('❌ Failed to send admin email:', adminEmailError);
    }

    return NextResponse.json({
      success: true,
      order,
      message: 'Order created successfully'
    });

  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}