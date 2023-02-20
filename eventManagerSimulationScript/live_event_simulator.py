## the purpose of this script is to simulate changes within a live event. In particular, this assumes a live
## soccer match and how potential events can be generated during the course of the match. It is meant only to 
## test the rest of the system through this randomized event change trigger. In reality, data needs to be streamed
## and analyzed to emit the actual events of interest.

import boto3
import time
import random


# application constants
# these are placeholders for the purpose of a prototype. please update as necessary
TIME_TO_SLEEP = 10
AWS_REGION = 'us-west-1'
EVENT_ID = '1'


## random match events for a soccer game. this is only for testing and should be changed as per business context
match_event = ['INJURY', 'GOAL', 'PENALTY', 'FREE-KICK', 'YELLOW-CARD', 'THROW']
score_difference = ['0', '1', '2']
match_venue = ['France', 'Amsterdam', 'Argentina']
match_type = ['FINAL', 'LEAGUE', 'SEMI-FINAL']
match_timing = ['SECOND-HALF-2', 'SECOND-HALF-1', 'SECOND-HALF-2', 'FIRST-HALF-1', 'FIRST-HALF-2', 'FIRST-HALF-3', 'INTERVAL', 'OVER-TIME', 'POST_MATCH', 'PRE-MATCH']


# a randomizer function to generate random events required for simulation purpose
# for real events, this should be replaced with the actual context feed coming
# refer to blog: https://aws.amazon.com/blogs/media/part-3-contextualized-viewer-engagement-and-monetization-for-live-ott-events/
def get_live_match_context():
    game_context = dict()

    game_context['MATCH_EVENT'] = random.choice(match_event)
    game_context['MATCH_TIMING'] = random.choice(match_timing)
    game_context['SCORE_DIFFERENCE'] = random.choice(score_difference)
    game_context['MATCH_TYPE'] = random.choice(match_type)
    game_context['MATCH_VENUE'] = random.choice(match_venue)

    return game_context



# function to update the event state of the match, based on randomly generated events
def refresh_event(item):
	
	try:
		dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
		table = dynamodb.Table('rt_personalize_event_manager')

		update = table.update_item (Key = {'event_id': EVENT_ID}, 
			UpdateExpression='SET match_event = :val1, match_timing = :val2, match_type = :val3, match_venue = :val4, score_difference = :val5', 
			ExpressionAttributeValues = {':val1': item['MATCH_EVENT'],':val2': item['MATCH_TIMING'],':val3': item['MATCH_TYPE'],':val4': item['MATCH_VENUE'],':val5': item['SCORE_DIFFERENCE']})
	
	except Exception as e:
		print('an exception has occurred while saving to soccer_personalize_item ' + str(e))
		raise e

	return True

## the main while loop to emit random events during the course of simulation test
while True:
	context = get_live_match_context()
	refresh_event(context)
	print('updated event in database, waiting till next refresh...')
	time.sleep(TIME_TO_SLEEP)
