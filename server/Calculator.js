const xlsx = require('xlsx')

let file = xlsx.readFile('./data.xlsx')

let firstSheet = file.SheetNames[0];
let sheet = file.Sheets[firstSheet];

const currentYear = 2022;

for (let j = 2; ; j++) {
    let kmSum = 0, percentForKM = 0, calculatedPriceForKM = 0;
    let yearDiff = 0, percentForYear = 0, calculatedPriceForYear = 0;
    let sumOfBoth = 0;

    const actualPrice = sheet['F' + j];
    const kms = sheet['E' + j];
    const year = sheet['D' + j];

    if (!year){
        break;
    }

    if (kms.v <= 100000) {
        for (let i = 1000; i <= kms.v; i += 1000) {
            kmSum = kmSum + 1;
        }
    } else {
        kmSum = 100;
    }

    percentForKM = kmSum * 0.003;
    calculatedPriceForKM = actualPrice.v * percentForKM;

    yearDiff = currentYear - year.v;
    percentForYear = yearDiff * 0.03;

    if (yearDiff < 10) {
        calculatedPriceForYear = actualPrice.v * percentForYear;
    } else {
        calculatedPriceForYear = actualPrice.v * 0.3;
    }

    sumOfBoth = actualPrice.v - (calculatedPriceForYear + calculatedPriceForKM);

    xlsx.utils.sheet_add_aoa(sheet, [[sumOfBoth]], { origin: 'G' + j })
}

xlsx.writeFile(file, 'test.xlsx')
