document.getElementById('calculate').addEventListener('submit', (e) => {
    e.preventDefault();

    let fo = document.getElementById('fo').value;
    let st = document.getElementById('st').value;

    fo = '5x + 2y';

    const foCoeficients = fo.replaceAll(' ', '').match(/[-+]?\d+/g).map(value => parseInt(value));
    const foIncognits = fo.replaceAll(' ', '').match(/[a-zA-Z]/g);

    if (foCoeficients.length !== foIncognits.length) {
        console.error('fo errada');
    }

    st = '2x + 2y <= 8\n4x - 4y <= 12';

    const model = {};

    model['fo'] = foCoeficients;

    const stRestrictions = st.split("\n");

    stRestrictions.forEach((restriction, i) => {
        const symbol = restriction.match(/(<=)/g);

        if (!symbol) {
            console.error('Restrição deve ser <=');
            return;
        }

        const restrictionCoeficients = restriction.replaceAll(' ', '').match(/[-+]?\d[a-zA-Z]+/g).map(value => parseInt(value));
        const restrictionIncognits = restriction.replaceAll(' ', '').match(/[a-zA-Z]/g);

        if (restrictionCoeficients.length !== restrictionIncognits.length) {
            console.error('restriction errada');
        }

        model['r'+i] = restrictionCoeficients;
    });

    console.log({model})
});