document.getElementById('calculate').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fo = document.getElementById('fo').value;
    const st = document.getElementById('st').value;
    const errors = document.getElementById('errors');

    const foCoeficients = fo.replaceAll(' ', '').match(/[-+]?\d+[a-zA-Z]/g).map(value => parseInt(value) * -1);
    const foIncognits = fo.replaceAll(' ', '').match(/[a-zA-Z]/g);

    if (foCoeficients.length !== foIncognits.length) {
        errors.innerHTML = `<p class="error">N° de coeficientes e incógnitas da FO não batem</p>`;
    }

    const incognitIndexMap = {};
    foIncognits.forEach((incognit, i) => {
        incognitIndexMap[incognit] = i + 1;
    });

    const model = {};

    model['incognitas'] = foIncognits;

    const stRestrictions = st.split("\n");

    // z | x | y | f1 | f1 | b
    const rowLength = 1 + foIncognits.length + stRestrictions.length + 1;

    const foRow = [];
    foRow.push(1);
    foCoeficients.forEach(coeficient => {
        foRow.push(coeficient);
    });

    model['restrictions'] = [];

    stRestrictions.forEach((restriction, i) => {
        const symbol = restriction.match(/(<=)/g);

        if (!symbol) {
            errors.innerHTML = `<p class="error">Restrições devem ser <= apenas</p>`;
            return;
        }

        const notImplicitIngonit = restriction.replaceAll(' ', '').match(/[-+]?\d+[a-zA-Z]/g).map(value => value[value.length - 1]);

        const restrictionCoeficients = restriction.replaceAll(' ', '').match(/[-+]?\d+[a-zA-Z]/g).map(value => parseInt(value));
        const restrictionIncognits = restriction.replaceAll(' ', '').match(/[a-zA-Z]/g);
        const restrictionValue = restriction.replaceAll(' ', '').match(/[-+]?\d+$/g);

        const implicitValues = [];

        restrictionIncognits.forEach((incognit) => {
            if (notImplicitIngonit.includes(incognit)) {
                implicitValues.push(restrictionCoeficients[notImplicitIngonit.indexOf(incognit)]);
            }
            else {
                implicitValues.push(1);
            }
        })

        if (implicitValues.length !== restrictionIncognits.length) {
            errors.innerHTML = `<p class="error">N° de coeficientes e incógnitas da restrição não batem</p>`;
        }

        foRow.push(0);

        const stRow = [];
        stRow.length = rowLength;
        for (let i = 0; i < rowLength; i++) {
            stRow[i] = 0;
        }
        restrictionIncognits.forEach((incognit, i) => {
            stRow[incognitIndexMap[incognit]] = implicitValues[i];
        });
        stRow[stRow.length - 1] = parseInt(restrictionValue[0]);
        stRow[1 + foIncognits.length + i] = 1; // Variáveis de Folga
    
        model['restrictions'].push(stRow);
    });

    foRow.push(0);
    model['fo'] = foRow;

    await fetch('http://127.0.0.1:5000/simplex', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(model)
    })
    .then(async (response) => {
        const result = await response.json();

        document.getElementById('result').innerHTML = `
            Solução Ótima: <span class="solution">${result.result}</span>
        `;
        
        errors.innerHTML = '';

        document.getElementById('incognitas').innerHTML = '';

        Object.keys(result.incognitas).forEach(incognita => {
            document.getElementById('incognitas').innerHTML += `
                <p>${incognita} = <span class="solution">${result.incognitas[incognita]}</span></p>
            `;
        });
    })
    .catch(err => {
        console.error(err);
    });
});