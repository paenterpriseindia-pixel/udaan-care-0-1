export async function getZoomAccessToken(): Promise<string | null> {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) {
    console.warn("Zoom credentials missing in environment variables.");
    return null;
  }

  const token = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const res = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Zoom OAuth error:", errorText);
      return null;
    }

    const data = await res.json();
    return data.access_token;
  } catch (err) {
    console.error("Failed to fetch Zoom access token", err);
    return null;
  }
}

export async function createZoomMeeting(
  topic: string,
  startTime: string, // ISO format e.g. "2023-08-30T10:00:00Z"
  durationMinutes: number
): Promise<string | null> {
  const token = await getZoomAccessToken();
  if (!token) return null;

  try {
    const res = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        type: 2, // Scheduled meeting
        start_time: startTime,
        duration: durationMinutes,
        timezone: "Asia/Kolkata",
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true,
          waiting_room: true,
        },
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Zoom Create Meeting error:", errorText);
      return null;
    }

    const data = await res.json();
    return data.join_url;
  } catch (err) {
    console.error("Failed to create Zoom meeting", err);
    return null;
  }
}
