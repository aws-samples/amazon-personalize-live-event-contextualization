## Amazon Personalize Live Event Contextualization

**Introduction:**

This is a sample code base to illustrate the concept of personalization and contextualization for real-time streaming events, as  outlined in the blog https://aws.amazon.com/blogs/media/part-3-contextualized-viewer-engagement-and-monetization-for-live-ott-events/ . 

The section below provides step-by-step instructions to setup a demo site using React based micro-frontends, websockets and Amazon Personalize.

**STEP # 1: SETUP AMAZON PERSONALIZE**

This is the first prerequisite for this solution. An custom user-personalization style campaign needs to be set up on Amazon Personalize. Please refer to this link for choosing a custom user-personalization recipe https://docs.aws.amazon.com/personalize/latest/dg/native-recipe-new-item-USER_PERSONALIZATION.html. This link explains how to setup a custom user-personalization recipe on Amazon Personalize.

In order to setup the this custom user-personalization solution, the training data needs to be created. You can review the following link to understand how custom data sets and schemas work for Amazon Personalize. https://docs.aws.amazon.com/personalize/latest/dg/custom-datasets-and-schemas.html. As indicated on the previous document link, there are three dataset types namely interactions, users and items. The JSON structure below illustrates the scheme definition for each such data set. 

As outlined in the  blog https://aws.amazon.com/blogs/media/part-3-contextualized-viewer-engagement-and-monetization-for-live-ott-events, attached below are sample datasets to understand the dataset and their associated context better. For example, "items" over here refer to the micro-frontend components of the consumer application that is meant to deliver a personalized experience (refer to the blog).

***User Interaction Schema*** :


"user_interaction_schema": [
      {
          "name": "USER_ID",
          "type": "string"
      },
      {
          "name": "ITEM_ID",
          "type": "string"
      },
      {
          "name": "EVENT_TYPE",
          "type": "string"
      },
      {
          "name": "LOCATION",
          "type": "string"
      },
      {
          "name": "TIMESTAMP",
          "type": "string"
      },
      {
          "name": "IMPRESSION",
          "type": "integer"
      },
 ]


<img width="772" alt="image" src="https://github.com/aws-samples/amazon-personalize-live-event-contextualization/assets/122004204/f4547db3-a0a2-43a8-a26c-15587c529450">


***User Schema*** :

"user_schema": [
      {
          "name": "USER_ID",
          "type": "string"
      },
      {
          "name": "AGE",
          "type": "integer"
      },
      {
          "name": "gender",
          "type": "string"
      },
      {
          "name": "country",
          "type": "string"
      }
 ]
 
 
![image](https://github.com/aws-samples/amazon-personalize-live-event-contextualization/assets/122004204/0cb5727e-bf0b-448b-b673-b22cd637ebdd)

***Item Schema*** :

"item_schema": [
      {
          "name": "USER_ID",
          "type": "string"
      },
      {
          "name": "ITEM_LABEL",
          "type": "integer"
      },
      {
          "name": "ITEM_TYPE",
          "type": "string"
      },
      {
          "name": "TWITTER_FOLLOWER_COUNT",
          "type": "string"
      },
      {
          "name": "INSTA_FOLLOWER_COUNT",
          "type": "string"
      },
      {
          "name": "FIFA_OVR_RATE",
          "type": "string"
      },
      {
          "name": "FIFA_POT_RATE",
          "type": "string"
      },
      {
          "name": "FIFA_STATS",
          "type": "string"
      },
      {
          "name": "FIFA_STATS",
          "type": "string"
      },
      {
          "name": "COUNTRY",
          "type": "string"
      },
      {
          "name": "IS_MONETIZE",
          "type": "string"
      },
      {
          "name": "IS_ENGAGE",
          "type": "string"
      }
 ]
 
 
 ![image](https://github.com/aws-samples/amazon-personalize-live-event-contextualization/assets/122004204/3cd20478-05e5-462a-971a-023adaeae679)

NOTE: It may be noted that the users of this solution are required to ingest similar data from their enterprise systems or synthetize the same programmatically, if only being run to test & validate the concept.  

Here are some additional useful links on how to setup a campaign in Amazon Personalize, or automate the campaign creation process using scripts:

 1. https://docs.aws.amazon.com/personalize/latest/dg/getting-started.html
 2. https://github.com/aws-samples/amazon-personalize-samples

Once the campaign is setup successful, please note the ARN value. This value will be required in configuring the next steps. The Amazon Personalize campaign ARN string would look similar to the following string, assuming the campaign name is set to "soccer-ux"

    'arn:aws:personalize:<aws-region>:<aws-account>:campaign/soccer-ux' 
    

**STEP # 2 : SETUP BACKEND WEBSOCKET SERVER**

At the core of this solution is a websocket server that would push to all its connected clients a set of personalized or contextual, everytime a new event of interest occurs during a live streaming. Please refer to the blog at https://aws.amazon.com/blogs/media/part-3-contextualized-viewer-engagement-and-monetization-for-live-ott-events/ for more conceptual details and relevance of this websocket server.

<<<<<<<<<< TALK ABOUT THE ROLE & POLICY REQUIRED TO RUN A CF SCRIPT>>>>>>>>>>>>>>>>>

The websocket server setup is a single-step process achieved by running this Amazon CloudFormation(CF) script at https://github.com/aws-samples/amazon-personalize-live-event-contextualization/blob/main/cloudFormationDeploymentScript/realtime_personalization_backend_deploy.yaml. You may refer to this link to get familiarized with Amazon CloudFormation and how a CloudFormation template can be run from the AWS console, cli or SDK. 

While running this CloudFormation template, the following inputs are mandatory. These are 1/ Amazon Personalize campaign ARN which was created in Step # 1 of this instruction. 2/ AWS region (example: us-east-1) . The other two inputs such as the number of results per recommendation request and the stage variables may be left as it is. There is no additional source code that needs to be pulled for this deployment. The necessary code is embedded in the CloudFormation script itself. It may be noted, that this backend websocket server is based on the following AWS tutorial at https://docs.aws.amazon.com/apigateway/latest/developerguide/websocket-api-chat-app.html. Please refer to this for additional context.

Wait for the CloudFormation script to complete successfully. Once the execution is completed, you can get the websocket endpoint from the output of the CloudFormation. It is essentially the Amazon APIGateway endpoint that was created as a part of this CloudFront execution. The websocket endpoint would look like the following:

wss://<API_GATEWAY_URL>/dev

**STEP # 3 : POPULATE EVENT MANAGER TABLE**

While the CloudFormation [script](https://github.com/aws-samples/amazon-personalize-live-event-contextualization/blob/main/cloudFormationDeploymentScript/realtime_personalization_backend_deploy.yaml) was executed in the previous step, it created a table in Amazon DynamoDB by the name of "rt_personalize_event_manager". You can read more about Amazon DynamoDB by referring to the link [here](https://aws.amazon.com/dynamodb/). The purpose of this table is to capture events during a live match. The CloudFormation script referred to above, will create this DynamoDB table, with stream enabled. This enablement will have all the change data (think CDC) to be streamed and captured througha AWS Lambda function. You can refer to this [link](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.Lambda.html) to learn how DynamoDB streams can trigger AWS Lambda functions. This target AWS Lambda function will involve Amazon Personalize campaign end point for every single consumer, and with the given context and push UX (user experience) customization instructions to the connected consumer applications. 

It will be useful to insert a single sample record into the DynamoDB table at this stage. This primer record will help to test the websocket API, even before the event manager gets populated through real or simulated events. You can refer to this [link](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/getting-started-step-2.html) to learn how to insert a record into a DynamoDB table. A sample JSON based item (a single row in a DynamoDB table) has been provided for reference.

    {
      "event_id": {
        "S": "1"
      },
      "match_event": {
        "S": "GOAL"
      },
      "match_timing": {
        "S": "INTERVAL"
      },
      "match_type": {
        "S": "LEAGUE"
      },
      "match_venue": {
        "S": "France"
      },
      "score_difference": {
        "S": "0"
      }
    }

**Step # 4 : Populate item metadata table**

For the personalization service to look up the item metadata, the DynamoDB  table 'rt_personalize_soccer_ux_item' is created. This table needs to be pre-populated with the same item data which was used to train the Amazon Personalize campaign. Use the following script to load item data into this table:

    'personalizeItemMetadataDynamoDBLoad/load_personalize_item_metadata_to_ddb.py'


**Step # 5 : Setup the event simulation script**

Set up the script at `'eventManagerSimulationScript/live_event_simulator.py'` to run from command line. This script will run within a loop, simulating live event scenario by updating the event table at preset intervals. This script is meant only for demo. In real world, a data streaming system needs to be developed and integrated to analyze and capture events of interest. Keep the script running to ensure that events are emitted which can be further picked up by the websocket server.

**Step # 6 : Test basic setup of the websocket server**

Test the basic connectivity and setup by running the following commands:

	1. CLI input: wscat -c 'wss://<endpoint>/dev' 
	2. CLI input: { "action": "sendmessage", "consumer_id": "1", "device_id": "d1", "content_id": "c1"} 

If the setup is done correctly, you should get a success message in response to both these CLI requests. Moreover, keep the simulation script running on step # 4, to see push updates to the websocket client with a set of item recommendations. 


**Step # 7 : deploy react micro-frontend components**
	
There are three micro-frontend components bet, player, and video which are used for this demo. Run the following CloudFormation script to install these three react micro-frontend components on an EC2 server:

    'cloudFormationDeploymentScript/ux-microfrontend-deploy-component.yml' 

When the CF execution is complete, review the created application load balancer (ALB) and note down the URL (A record).  Verify that the target-group health checks have passed. It may take few seconds to minutes after deployment completion for all the health checks to pass. 

There are thus a set of 3 URLs, one each for the above-mentioned micro-frontend component. Test these URLs independently to verify that a successful response is obtained (the page loads successfully)

	1. http://<load-balancer-url>:3001 [this is for the bet module]
	2. http://<load-balancer-url>:3002 [this is for the player module]
	3. http://<load-balancer-url>:3003 [this is for the video module]
	

**Step # 8 : Deploy react home / container app **
	
Deployment of the home or the container, would need a couple of configuration changes on the source code of the app, based on the inputs from the deployments done in the previous steps. These inputs are 

	1. URI for the websocket server
	2. URIs for the micro-frontends for bet, player and video 

Here are the following changes:

 - In the `'react-ux/home/webpack.config.js'` file, look for the key `plugins -> remotes`. For each of the remote component entries update with the application load balancer URI as was obtained in Step # 6. Save and close the file.

 - In the `'react-ux/home/src/App.js'` file, update the entry for `'websocket_server_url'` based on the websocket endpoint obtained in Step # 2.
	
Once both the files are saved, push the updated files back to the git repository (git add, commit, push, etc.)
	
Now run the deployment script `'cloudFormationDeploymentScript/ux-microfrontend-deploy-home-container.yml'.` Once the script execution completes, navigate to review if the newly created application load balancer and if the target-group health checks have passed. If everything looks good, hit the URL of this load balancer on port 3000, to load the container application. The video micro-frontend should load directly. Verify the browser console log to ensure that the websocket connection is successful and personalization recommendations are pushed at preset intervals

**Additional Notes **

 - Ensure that the principal executing the CF scripts has sufficient privileges (configured by IAM roles and policies) to create the resources necessary for this project.
 - 
* Change the title in this README
* Edit your repository description on GitHub

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

