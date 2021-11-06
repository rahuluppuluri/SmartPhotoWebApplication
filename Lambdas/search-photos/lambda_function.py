# get the required imports
import json
import boto3
import time
import requests
from requests_aws4auth import AWS4Auth


credentials = boto3.Session().get_credentials()
authent = AWS4Auth(credentials.access_key, credentials.secret_key, 'us-west-2', 'es', session_token=credentials.token)

# function to handle the lambda function
def lambda_handler(event, context):
    print(event)

    # get the qeury from the intent
    queryInput = event['queryStringParameters']['q']

    # connect to the lex bot and get the slots from the query
    lex = boto3.client('lex-runtime')
    response = lex.post_text(
        botName = 'smartPhotoBot',
        botAlias = 'smartphotobot',
        userId = 'User0',
        inputText = queryInput
    )
    # print(response.json())
    slots = response['slots']
    list_of_keywords = []

    # get each keyword from the slots
    list_of_keywords = [keyword for _, keyword in slots.items() if keyword]

    # get the image urls from elastic search using keywords
    image_urls = getImageUrls(list_of_keywords)

    # return the urls
    return {
        'statusCode': 200,
        'headers':{
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Credentials':True
        },
        'body': json.dumps({"results":image_urls})
    }

#function to get the image Urls from the keywords list    
def getImageUrls(list_of_keywords):
    print(list_of_keywords)
    # connect to elastic search endpoint
    endpoint = 'https://search-photos-album-pypi63xmrxee3oxnpftvvc73da.us-west-2.es.amazonaws.com/photoalbum/_search?q='
    headers = {'Content-Type': 'application/json'}
    elasticSearchResponses = []
    image_locations = []

    # for each keyword, add to url and search, add responses to array
    for keyword in list_of_keywords:
        if (keyword is not None) and keyword != '':
            url = endpoint+'labels:'+keyword
            elasticSearchResponses.append(requests.get(url, auth = authent).json())
    
    # for each response object from the search, get the urls
    for response in elasticSearchResponses:
        if 'hits' in response:
             for item in response['hits']['hits']:
                print(item)
                image_key = item['_source']['objectKey']
                bucket = item['_source']['bucket']
                image_url = "https://" + bucket + ".s3.amazonaws.com/" + image_key
                if image_url not in image_locations:
                    image_locations.append(image_url)
    print(image_locations)
    return image_locations