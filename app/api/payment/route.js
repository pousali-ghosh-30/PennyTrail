import db from '@/mysql/db';
import { getEmail } from '@/app/lib/getEmail';

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, plan, username } = body; // action: 'pay' or 'cancel'
    const email = await getEmail();

    if (!email) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'User not authenticated or email not found' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'pay') {
      console.log(`Mock payment for user: ${username}, plan: ${plan}, email: ${email}`);

      // Simulate payment success
      const paymentSuccess = true;

      if (paymentSuccess) {
        await db.execute(
          `INSERT INTO USER_UPGRADE (USERNAME, EMAIL, PLAN, UPGRADED_AT)
           VALUES (?, ?, ?, NOW())`,
          [username, email, plan]
        );

        return new Response(
          JSON.stringify({
            status: 'success',
            message: 'Payment successful and email saved!',
            unlockedFeatures: ['notifications'],
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } else {
        return new Response(
          JSON.stringify({
            status: 'failed',
            message: 'Payment failed',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    } else if (action === 'cancel') {
      // Delete user upgrade data for this email
      const [result] = await db.execute(
        `DELETE FROM USER_UPGRADE WHERE EMAIL = ?`,
        [email]
      );

      if (result.affectedRows > 0) {
        return new Response(
          JSON.stringify({ status: 'success', message: 'Subscription canceled successfully.' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        return new Response(
          JSON.stringify({ status: 'failed', message: 'No active subscription found to cancel.' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Invalid action' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Payment API error:', error);
    return new Response(
      JSON.stringify({ status: 'error', message: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
