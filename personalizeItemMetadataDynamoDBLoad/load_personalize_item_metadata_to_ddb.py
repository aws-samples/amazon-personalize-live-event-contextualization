import boto3
from decimal import Decimal
import datetime
import csv


aws_region = '<choose-region>'
data_file = '<path to data file - ex: item_soccer-micro-frontend-personalize-2.csv>'


def save_item(item):
    try:
        dynamodb = boto3.resource('dynamodb', region_name=aws_region)
        table = dynamodb.Table('rt_personalize_soccer_ux_item')

        response = table.put_item(Item={'item_id': item['ITEM_ID'], 'item_label': item['ITEM_LABEL'], 'twitter_follower_count': Decimal(str(item['TWITTER_FOLLOWER_COUNT'])),
                                        'item_type': item['ITEM_TYPE'], 'insta_follower_count': Decimal(str(item['INSTA_FOLLOWER_COUNT'])),
                                        'fifa_ovr_rate': Decimal(str(item['FIFA_OVR_RATE'])), 'fifa_pot_rate': Decimal(str(item['FIFA_POT_RATE'])),
                                        'fifa_stats': Decimal(str(item['FIFA_STATS'])), 'is_celeb': item['IS_CELEB'],
                                        'country': item['COUNTRY'], 'is_monetize': item['IS_MONETIZE'],
                                        'is_engage': item['IS_ENGAGE'], 'time_stamp': str(datetime.datetime.now())})
    except Exception as e:
        print('an exception has occurred while saving to soccer_personalize_item ' + str(e))
        raise e

    return True


def format_blank_to_unknown(i):
    if i == '':
        i = 'UNKNOWN'
    return i


def format_blank_to_zero(i):
    if i == '':
        i = 0
    return i


with open(data_file) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
        if line_count > 0:
            item = dict()
            item['ITEM_ID'] = row[0]
            item['ITEM_LABEL'] = row[1]
            item['ITEM_TYPE'] = format_blank_to_unknown(row[2])
            item['TWITTER_FOLLOWER_COUNT'] = format_blank_to_zero(row[3])
            item['INSTA_FOLLOWER_COUNT'] = format_blank_to_zero(row[4])
            item['FIFA_OVR_RATE'] = format_blank_to_zero(row[5])
            item['FIFA_POT_RATE'] = format_blank_to_zero(row[6])
            item['FIFA_STATS'] = format_blank_to_zero(row[7])
            item['IS_CELEB'] = format_blank_to_unknown(row[8])
            item['COUNTRY'] = format_blank_to_unknown(row[9])
            item['IS_MONETIZE'] = format_blank_to_unknown(row[10])
            item['IS_ENGAGE'] = format_blank_to_unknown(row[11])
            save_item(item)

        line_count += 1

