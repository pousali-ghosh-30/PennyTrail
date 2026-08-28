import db from '@/mysql/db';
import { getEmail } from '@/app/lib/getEmail';


const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

export async function POST(req) {
  try {
    const email = await getEmail();
    const { name, amount, icon } = await req.json();
    

    if (
      typeof name !== 'string' ||
      name.trim().length === 0 ||
      emojiRegex.test(name) || 
      typeof amount !== 'number' ||
      isNaN(amount) ||
      amount <= 0 ||
      typeof icon !== 'string' ||
      icon.trim().length === 0 ||
      icon.length > 2 
    ) {
      return new Response(
        JSON.stringify({
          status: 'error',
          message: 'Invalid input: Ensure name has no emoji and icon is valid',
        }),
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const trimmedIcon = icon.trim();

    const [result] = await db.execute(
      `INSERT INTO BUDGETS (BNAME, AMOUNT, ICON, CREATEDBY, CREATEDAT)
       VALUES (?, ?, ?, ?, NOW())`,
      [trimmedName, amount, trimmedIcon, email]
    );

    return new Response(
      JSON.stringify({
        status: 'success',
        data: {
          id: result.insertId,
          name: trimmedName,
          amount,
          icon: trimmedIcon,
        },
      }),
      { status: 200 }
    ); 
  } catch (err) {
    console.error('Create Budget Error:', err);
    return new Response(
      JSON.stringify({ status: 'error', message: 'Server error' }),
      { status: 500 }
    );
  }
}