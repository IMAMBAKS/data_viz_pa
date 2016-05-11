# sample.py
import json

import falcon
import pandas as pd
from falcon_cors import CORS
from waitress import serve

cors = CORS(allow_origins_list=['http://localhost:3000/', 'http://localhost:*', 'http://localhost:3000'])

df = pd.read_hdf('log_relatics.h5')


def get_year(parameter, *args, freq: str = 'W') -> pd.DataFrame:
    if args:
        df2 = df[parameter:args[0]]
    else:
        df2 = df[parameter]

    name = df2.groupby(pd.Grouper(freq=freq))['user_name'].unique()
    return name

def get_top_ten_users(parameter, *args) -> pd.DataFrame:
    if args:
        df2 = df[parameter:args[0]]
    else:
        df2 = df[parameter]

    name = df2.groupby('user_name')['user_name'].count().sort_values(ascending=False)[:10]

    return name


names = (get_top_ten_users('2015').to_json())

print(names)

class QuoteResource:
    def on_get(self, req, resp):

        date1 = req.get_param('date1')
        freq = req.get_param('freq')

        if req.get_param('date2') is not None:
            date2 = req.get_param('date2')

            try:
                query = get_year(date1, date2, freq=freq).to_json(date_format='epoch')
            except:
                query = ''
        else:

            try:
                query = get_year(date1, freq=freq).to_json(date_format='epoch')
            except:
                query = ''

        """Handles GET requests"""
        quote = {
            'quote': 'I\'ve always been more interested in the future than in the past.',
            'author': query
        }

        print(quote)

        resp.body = json.dumps(quote)


#
# class QuoteResourceSpecific:
#     def on_get(self, req, resp, date1, date2):
#         """Handles GET requests"""
#         print(date2)
#
#         names2 = (get_year(date1, date2, freq='D').to_json(date_format='epoch'))
#         quote = {
#             'quote': 'I\'ve always been more interested in the future than in the past.',
#             'author': names2
#         }
#
#         print(quote)
#
#         resp.body = json.dumps(quote)


api = falcon.API(middleware=[cors.middleware])
api.add_route('/quote', QuoteResource())
# api.add_route('/quote/{date1}/{date2}', QuoteResourceSpecific())

serve(api, host='127.0.0.1', port=80)
