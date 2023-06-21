import flask
from flask import jsonify, Flask, request
import model2

app = Flask(__name__)


blueprint = flask.Blueprint(
    'jobs_api',
    __name__,
)


@blueprint.route('/api/names', methods=['POST'])
def get_news():
    if not request.json:
        return jsonify({'error': 'Empty request'})
    res = model2.forecast(request.json['n1'], request.json['n2'])[0]
    res = str(res)
    return jsonify(
        {
            'res': res
        }
    )


if __name__ == '__main__':
    app.register_blueprint(blueprint)
    app.run(port=5000)
