## Amazon Personalize Live Event Contextualization

**Introduction:**

This is a sample code base to illustrate the concept of personalization and contextualization for real-time streaming events, as  outlined in the blog https://aws.amazon.com/blogs/media/part-3-contextualized-viewer-engagement-and-monetization-for-live-ott-events/ . 

The section below provides step-by-step instructions to setup a demo site using React based micro-frontends, websockets and Amazon Personalize.

**Step # 1: Setup  Amazon Personalize**

A user-item style campaign needs to be setup on Amazon Personalize. Please refer to the blog https://aws.amazon.com/blogs/media/part-3-contextualized-viewer-engagement-and-monetization-for-live-ott-events/ to understand the type of data schema required for user, item and user-item metadata. we will try to add some sample data in this repository itself for better reference. 

As outlined in the blog,  micro-frontend components are considered as "items" in the Amazon Personalize setup for this campaign. Here are some useful links for tutorials on how to setup a  campaign in Amazon Personalize, or automate the campaign creation process using scripts:

 1. https://docs.aws.amazon.com/personalize/latest/dg/getting-started.html
 2. https://github.com/aws-samples/amazon-personalize-samples

Once the campaign is setup successful, please note the ARN value. This value will be required in configuring the next steps. The Amazon Personalize campaign ARN would typically look like this:

    'arn:aws:personalize:<aws-region>:<aws-account>:campaign/soccer-ux' 

**Step # 2 : Setup backend websocket server**

The solution entails a backend websocket server which would push to all connected clients a set of personalization or contextualization instructions, every time a new event occurs during the live streaming. The core of the backend websocket server setup is a single step process, achieved by running the CloudFormation (CF) script as below:

`cloudFormationDeploymentScript/realtime_personalization_backend_deploy.yaml`

The Amazon Personalize campaign ARN which was created in Step # 1, will be an input to this CF script, along with the AWS region (example: us-east-1) in which the campaign is deployed.

This backend personalization server is based on the following tutorial which explains in detail how a serverless websocket server can be deployed on AWS:

 - https://docs.aws.amazon.com/apigateway/latest/developerguide/websocket-api-chat-app.html

Once the CF script is executed successfully,  note down the websocket end point which will be required as an input into the front-end application. The websocket endpoint is of the form - 'wss://<endpoint>/dev' 

**Step # 3 : Populate event manager table**

As a part of execution of the above mentioned CF script a Amazon DynamoDB table is created with the name of 'rt_personalize_event_manager'. This table will manage the state of live streaming events. This table has streaming enabled, such that all data changed is streamed and captured through an AWS Lambda function. This Lambda function will capture the change event, invoke Amazon Personalize campaign for every single consumer, and with a given context and push customization instructions to the connected client applications. At this stage populate the DynamoDB table with a sample record (as a primer):

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

