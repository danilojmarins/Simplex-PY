document.getElementById('calculate').addEventListener('submit', (e) => {
    e.preventDefault();

    const fo = document.getElementById('fo').value;
    const st = document.getElementById('st').value;

    const foCoeficients = fo.replaceAll(' ', '').match(/[-+]?\d+/g).map(value => parseInt(value) * -1);
    const foIncognits = fo.replaceAll(' ', '').match(/[a-zA-Z]/g);

    if (foCoeficients.length !== foIncognits.length) {
        console.error('fo errada');
    }

    const incognitIndexMap = {};
    foIncognits.forEach((incognit, i) => {
        incognitIndexMap[incognit] = i + 1;
    });

    const model = {};

    const stRestrictions = st.split("\n");

    // z | x | y | f1 | f1 | b
    const rowLength = 1 + foIncognits.length + stRestrictions.length + 1;

    const foRow = [];
    foRow.push(1);
    foCoeficients.forEach(coeficient => {
        foRow.push(coeficient);
    });

    stRestrictions.forEach((restriction, i) => {
        const symbol = restriction.match(/(<=)/g);

        if (!symbol) {
            console.error('Restrição deve ser <=');
            return;
        }

        const restrictionCoeficients = restriction.replaceAll(' ', '').match(/[-+]?\d[a-zA-Z]+/g).map(value => parseInt(value));
        const restrictionIncognits = restriction.replaceAll(' ', '').match(/[a-zA-Z]/g);
        const restrictionValue = restriction.replaceAll(' ', '').match(/[-+]?\d+$/g);

        if (restrictionCoeficients.length !== restrictionIncognits.length) {
            console.error('restriction errada');
        }

        foRow.push(0);

        const stRow = [];
        stRow.length = rowLength;
        for (let i = 0; i < rowLength; i++) {
            stRow[i] = 0;
        }
        restrictionIncognits.forEach((incognit, i) => {
            stRow[incognitIndexMap[incognit]] = restrictionCoeficients[i];
        });
        stRow[stRow.length - 1] = parseInt(restrictionValue[0]);
        stRow[1 + foIncognits.length + i] = 1; // Variáveis de Folga
    
        model['r'+i] = stRow;
    });

    foRow.push(0);
    model['fo'] = foRow;

    console.log({model});
});