export async function sendPushNotification(
  expoPushToken: string[],
  name: string
) {
  const messages = expoPushToken.map((expoPushToken) => {
    return {
      to: expoPushToken,
      sound: "default",
      title: `${name} has fallen`,
      body: "Click to see more info",
    };
  });

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
      Authorization: `Bearer EUW5vtLMfdJwhw21j8WD72TlLkyI-7Ht6YM5LZvi`, //personal access token
    },
    body: JSON.stringify(messages),
  });
}
