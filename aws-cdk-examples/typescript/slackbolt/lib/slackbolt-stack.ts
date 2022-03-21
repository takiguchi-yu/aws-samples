import { Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from 'constructs';

export class SlackboltStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Lambda
    const handler = new NodejsFunction(this, "SlackApp", {
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: "src/app.ts",
      handler: "handler",
      environment: {
        SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN || "",
        SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET || "",
      },
    });

    // API Gateway
    new apigateway.LambdaRestApi(this, "slackApi", {
      handler: handler,
    });
  }
}
