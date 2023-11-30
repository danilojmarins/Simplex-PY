from flask import Flask, render_template, request, jsonify
from simplex import Simplex

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.post("/simplex")
def simplex_calculate():
    simplex = Simplex(request.json['incognitas'])
    simplex.set_objective_function(request.json['fo'])

    for restriction in request.json['restrictions']:
        simplex.add_restrictions(restriction)
    
    simplex.solve()
    results = simplex.get_results()

    print(f"{results}")

    return results