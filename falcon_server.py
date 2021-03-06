# NOTE THIS FILE SHOULD BE REFACTORED!!!

# sample.py
import falcon
import pandas as pd
from falcon_cors import CORS
from waitress import serve

cors = CORS(allow_origins_list=['http://localhost:3000/', 'http://localhost:*', 'http://localhost:3000'])

df = pd.read_hdf('log_relatics.h5')




def inter_vs_extern_workspaces(parameter, *args, freq: str = 'W') -> pd.DataFrame:
    if args:
        df0 = df[parameter:args[0]]
    else:
        df0 = df[parameter]

    df0 = df0[['user_name', 'user_email']]
    df2 = df0.dropna(axis=0)
    df3 = df2.groupby('user_name')['user_email'].unique()  # type -> pd.Series
    df3 = df3.apply(lambda x: x[0])
    df0['user_email'] = df0['user_name'].map(df3)
    df0['scope'] = df0['user_email'].apply(lambda x: 'intern' if 'arcadis' in str(x).lower() else 'extern')
    name = df0.groupby([pd.Grouper(freq='M'), 'scope'])
    query = name.user_name.nunique()
    new = query.unstack().reset_index()

    return new


def workspace_activity_in_time(parameter, *args, freq: str = 'W') -> pd.DataFrame:
    if args:
        df2 = df[parameter:args[0]]
    else:
        df2 = df[parameter]

    # df2 = df2[df2.workspace_name != 'Zuidas_SEM']

    name = df2.groupby([pd.Grouper(freq=freq), 'workspace_name']).apply(
        lambda x: x.user_name.nunique() if x.user_name.nunique() > 0 else None).dropna(axis=0)

    name = name.rename("value")
    return name


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


class ExternalInternalUsers:
    def on_get(self, req, resp):

        date1 = req.get_param('date1')
        freq = req.get_param('freq')

        if req.get_param('date2') is not None:
            date2 = req.get_param('date2')

            try:
                query = inter_vs_extern_workspaces(date1, date2, freq=freq).to_json(date_format='epoch',
                                                                                    orient='records')
            except:
                query = ''
        else:

            try:
                query = inter_vs_extern_workspaces(date1, freq=freq).to_json(date_format='epoch',
                                                                             orient='records')
            except:
                query = ''

        print(query)
        resp.body = query


class WorkSpaceActivityResource:
    def on_get(self, req, resp):

        date1 = req.get_param('date1')
        freq = req.get_param('freq')

        if req.get_param('date2') is not None:
            date2 = req.get_param('date2')

            try:
                query = workspace_activity_in_time(date1, date2, freq=freq).reset_index().to_json(date_format='epoch',
                                                                                                  orient='records')
            except:
                query = ''
        else:

            try:
                query = workspace_activity_in_time(date1, freq=freq).reset_index().to_json(date_format='epoch',
                                                                                           orient='records')
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
api.add_route('/activity_workspaces', WorkSpaceActivityResource())
api.add_route('/users', UsersResource())
api.add_route('/intern_extern_users', ExternalInternalUsers())

serve(api, host='127.0.0.1', port=80)
