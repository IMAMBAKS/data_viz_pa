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

    name = df2.groupby('user_name')['user_name'].count().sort_values(ascending=True)[-10:]

    return name


def get_top_ten_workspaces(parameter, *args) -> pd.DataFrame:
    if args:
        df2 = df[parameter:args[0]]
    else:
        df2 = df[parameter]

    name = df2.groupby('workspace_name')['user_name'].nunique().sort_values(ascending=True)[-10:]

    return name


class UserActivity:
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

        resp.body = query


class WorkspaceResource:
    def on_get(self, req, resp):
        date1 = req.get_param('date1')

        if req.get_param('date2') is not None:
            date2 = req.get_param('date2')

            try:
                query = get_top_ten_workspaces(date1, date2).to_json()
            except:
                query = ''
        else:

            try:
                query = get_top_ten_workspaces(date1).to_json()
            except:
                query = ''

        resp.body = query


class UsersResource:
    def on_get(self, req, resp):
        date1 = req.get_param('date1')

        if req.get_param('date2') is not None:
            date2 = req.get_param('date2')

            try:
                query = get_top_ten_users(date1, date2).to_json()
            except:
                query = ''
        else:

            try:
                query = get_top_ten_users(date1).to_json()
            except:
                query = ''

        resp.body = query


api = falcon.API(middleware=[cors.middleware])
api.add_route('/activity', UserActivity())
api.add_route('/workspaces', WorkspaceResource())
api.add_route('/users', UsersResource())

serve(api, host='127.0.0.1', port=80)
