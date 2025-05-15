// app/api/token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    // console.log("🔍 Search Params:", searchParams.toString());
    const roomName = searchParams.get('room');
    const identity = searchParams.get('identity');

    if (!roomName || !identity) {
      console.error("❌ Missing room or identity");
      return NextResponse.json({ error: 'Missing room or identity' }, { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error("❌ Missing LiveKit API credentials");
      return NextResponse.json({ error: 'LiveKit API credentials are missing' }, { status: 500 });
    }

    const token = new AccessToken(apiKey, apiSecret, {identity:identity});

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    // console.log('jwt from room =',token);
    const jwt = await token.toJwt();
    // console.log("✅ Generated Token:", jwt);

    return NextResponse.json({ token: jwt });
  } catch (error) {
    console.error("❌ Error generating token:", error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
