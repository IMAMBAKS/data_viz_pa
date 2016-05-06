# sample.py
import falcon
import json
from waitress import serve
from falcon_cors import CORS
import numpy as np

cors = CORS(allow_origins_list=['http://localhost:3000/', 'http://localhost:*', 'http://localhost:3000'])


class QuoteResource:
    def on_get(self, req, resp):
        """Handles GET requests"""
        quote = {
            'quote': 'I\'ve always been more interested in the future than in the past.',
            'author': (np.random.randint(0,100,30)).tolist()
        }

        print(quote)

        resp.body = json.dumps(quote)


api = falcon.API(middleware=[cors.middleware])
api.add_route('/quote', QuoteResource())

serve(api, host='127.0.0.1', port=80)
