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

It will be useful to insert a single sample record into the DynamoDB table at this stage. This primer record will help to test the websocket API, even before the event manager gets populated through real or simulated events. You can refer to this [link](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/getting-started-step-2.html) to learn how to insert a record into a DynamoDB table. A sample JSON based item (a single row in a DynamoDB table) has been provided for reference. As of now, this is a manual step and needs to be performed as a part of deployment  for interim testing.

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

**STEP # 4 : POPULATE METADATA TABLE**

While the CloudFormation [script](https://github.com/aws-samples/amazon-personalize-live-event-contextualization/blob/main/cloudFormationDeploymentScript/realtime_personalization_backend_deploy.yaml) was executed in the earlier step, it created a table in Amazon DynamoDB by the name of "rt_personalize_soccer_ux_item". This table holds metadata for the different "items" (as nomenclatured in Amazon Personalize) or types of UX components that can be used to decorate the user experience (web page). Please refer to a [sample file](https://github.com/aws-samples/amazon-personalize-live-event-contextualization/blob/main/data/soccer-ux-sample-item.csv) in this repository that details how the "items" records should look like. This data file is good enough to run this demo application, but would need to be customized and extended based on distinct business needs. 

A sample Python script is made available at this [location](https://github.com/aws-samples/amazon-personalize-live-event-contextualization/blob/main/personalizeItemMetadataDynamoDBLoad/load_personalize_item_metadata_to_ddb.py). This python script can be used to populate the DynamoDB table "rt_personalize_soccer_ux_item" with the sample data as referred to above. Please feel free to modify the script for any variations in the python data. 

Following are some key instructions to run this python script:

1. Download the python script on your local environment
2. Install Python 3.8 or above to be able to run this script
3. Install the python libray "boto3", by using the command "pip install boto3". You may need to install "pip" first, if not already there on your system.
4. Follow this [link](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html) to set up AWS CLI. This will ensure that sufficient permissions are available to invoke AWS CLI and resource access.
5. In the above step, ensure the permission includes policies to write to a DynamoDB database. This may be passed on through the secret key (not advised on production), or the assigned role, if running out of an EC2 terminal. It may be noted that such persmissions can be granted through IAM Roles (if running on EC2), or access keys (not recommended for production), or environment variables.
6. open the python script to update the AWS region (example: us-east-1) and the correct path of the datafile.
7. Run the script from the command line (terminal) as "python3 load_personalize_item_metadata_to_ddb.py"
8. Once the execution completes gracefully, visit the Amazon DyanmoDB console to verify that the data is indeed loaded. Refer to this [link](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/getting-started-step-5.html) for guidance.


** STEP # 5 : SETUP THE EVENT SIMULATION SCRIPT **

A sample simulation script is provided at the following [location](https://github.com/aws-samples/amazon-personalize-live-event-contextualization/blob/main/eventManagerSimulationScript/live_event_simulator.py). The purpose of this script is to generate random events and simulating "real-match-like" events. This script is only useful for testing purposes. In real world this data stream will be originating from social media or live match scores, or similar other applications. 

1. Download the python script on your local environment
2. Install Python 3.8 or above to be able to run this script
3. Install the python libray "boto3", by using the command "pip install boto3". You may need to install "pip" first, if not already there on your system.
4. Follow this [link](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html) to set up AWS CLI. This will ensure that sufficient permissions are available to invoke AWS CLI and resource access.
5. In the above step, ensure the permission includes policies to write to a DynamoDB database. This may be passed on through the secret key (not advised on production), or the assigned role, if running out of an EC2 terminal. It may be noted that such persmissions can be granted through IAM Roles (if running on EC2), or access keys (not recommended for production), or environment variables.
6. open the python script to update the AWS region (example: us-east-1) and the "TIME_TO_SLEEP" variable. This second variable controls the time it takes between two random events. Feel free to modify the response of the events, in case this simulation is going to be integrated and deployed with other systems and contexts.
7. Run the script from the command line (terminal) as "python3 live_event_simulator.py"

This script is designed to run in an infinite loop and as such should be kept running while testing the solution.


**STEP # 6 : TEST THE BASIC SETUP OF WEBSOCKET SERVER**

At this stage, it should be possible to test the basic setup of the websocket server, provided all the previous steps have completed successfully. The test is through a command line (terminal window of windows, Linux or Mac). Please follow the following steps.

1. Ensure that NPM (node package manager) is installed on your machine. Refer to this [link](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) for additional help.
2. Ensure that "wscat" utility is installed on your machine. Refer to this [link](https://www.npmjs.com/package/wscat) for installation of "wscat" on your machine.
3. On the command line of your terminal type the following command "wscat -c  'wss://<API_GATEWAY_URL>/dev' ". The websocket URL is the same obtained in the earlier step.
4. Once the connection is established, run the second command as ' { "action": "sendmessage", "consumer_id": "1", "device_id": "d1", "content_id": "c1"} '
5. You should see a success message in response to both the CLI inputs
6. Ensure that the simulation script is running gracefully (runs in an infinite loop, as explained above)
7. If everything is running fine, you should be able to see a set of contextual recommendation (simulated) on the console.


**STEP # 7 : DEPLOY REACT MICRO-FRONTEND COMPONENTS**

Three sample micro-frontend applications are made available to enable end-to-end testing. These micro-frontend applications are demo / skeletal version for a betting module, player profile module, and a video player module. This section explains how these micro-frontend components can be deployed. All these applications are build using ReactJS and hosted on EC2 servers running on different ports. There is one single application load balancer (ALB) provisioned to reach out to these three micro-frontend applications. The micro-frontends is to be deployed using the following [CloudFormation script](https://github.com/aws-samples/amazon-personalize-live-event-contextualization/blob/main/cloudFormationDeploymentScript/ux-microfrontend-deploy-component.yml). Run this CloudFormation script from the console or AWS CLI, as done in the previous steps. 

Once the CloudFormation execution is completed successfully it should create an application load balancer (ALB). Please refer to this [link](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html) to familiarize yourself on ALB is required. If the CloudFormation script was run from the AWS console, you can navigate to CloudFormation > Stacks > (Selcted Stack). Click on the "Outputs" tab of the selected stack and look for the Application Load Balancer (ALB) that was created as a part of execution. Please note that CloudFormation stacks are region specific and you stick to the same region. Alternatively, you can extract the ALB output using [AWS CLI commands](https://aws.amazon.com/cli/).

Once the ALB is located within the CloudFormation outputs, note down its URL (A record). Amazon ALB has some other sub-components that are created as part of this script. While this [link](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html) has the details, an ALB will have a listeners. Listeners point to target groups and the target group frontends the EC2 instance that hosts the React application. The target group runs "health checks" to ensure that the EC2 is healthy by pinging a pre-configured port on the EC2 instance. You can refer to this [link](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html) on how the health check of the target groups of application load balancer works. Verify that the target group health check passed.

At this stage, you can contruct three URLs, one for each of the micro-frontends. Please note that each of these applications are standalone in nature with static images and text. each of these applications should work out-of-the-box once the URL is hit on the browser. The three sets of URL are as follow

1. Demo betting module - "http://<application-load-balancer-url-obtained-from-cloudformation-output>:3001"
2. Demo player module - "http://<application-load-balancer-url-obtained-from-cloudformation-output>:3002"
3. Demo video player module - "http://<application-load-balancer-url-obtained-from-cloudformation-output>:3003"

Please visit each of the URLs to see a static application comes up for each of micro-frontend component. Please ensure that your corporate firewall, browser, or network setting does not block requests to HTTP endpoints or non-standard URLS.
	

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

