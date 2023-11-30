from flask import Flask, render_template, request
from simplex import Simplex

app = Flask(__name__)

@app.route("/")
def hello_world():
    return render_template('index.html')

@app.post("/simplex")
def simplex_calculate():
    simplex = Simplex()
    simplex.set_objective_function(request.json['fo'])

    for restriction in request.json['restrictions']:
        simplex.add_restrictions(restriction)
    
    simplex.solve()

    return 'a'