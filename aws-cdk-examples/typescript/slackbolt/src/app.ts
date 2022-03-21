import { App, AwsLambdaReceiver } from "@slack/bolt";
import { APIGatewayProxyEvent, Context, Callback } from "aws-lambda";

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET ?? "",
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  // receiver: expressReceiver,
  receiver: awsLambdaReceiver,
});

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback,
) => {
  // awsServerlessExpress.proxy(server, event, context);
  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
};

app.message("hello", async ({ message, say }) => {
  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hey there <@${message.user}>!`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Click Me",
          },
          action_id: "button_click",
        },
      },
    ],
    text: `Hey there <@${message.user}>!`,
  });
});

app.action("button_click", async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(`<@${body.user.id}> clicked the button`);
});

if (process.env.IS_LOCAL === "true") {
  (async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log("⚡️ Bolt app is running!");
  })();
}
