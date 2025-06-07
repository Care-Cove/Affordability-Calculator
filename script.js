const maxDTIRatio = 0.45;
const maxHousingDTIRatio = 0.35;
const propertyTaxAndInsurance = 0.015;
const interestRate = 0.07;
const PMITreshold = 0.20;
const rateBuydownCost = 0.01;
const rateBuydownReduction = 0.0025;
const CLTV = 0.03;
const loanTermInYears = 30;

function formatCurrency(value) {
    return `$${Math.round(value).toLocaleString()}`;
  }

function calculatePMIRate(ltv) {
    if (ltv > 0.95 && ltv <= 1) {
        return 0.01; // 1.00%
    } else if (ltv > 0.90 && ltv <= 0.95) {
        return 0.0085; // 0.85%
    } else if (ltv > 0.85 && ltv <= 0.90) {
        return 0.0075; // 0.75%
    } else if (ltv > 0.80 && ltv <= 0.85) {
        return 0.005; // 0.50%
    } else if (ltv >= 0 && ltv <= 0.80) {
        return 0; // 0.00%
    }
    return 0; // Default case
}

function calculateInterestRate(ltv) {
    if (ltv <= 0.75) {
        return 0.0663; // 6.63%
    } else if (ltv > 0.75 && ltv <= 0.80) {
        return 0.0688; // 6.88%
    } else if (ltv > 0.80 && ltv <= 0.85) {
        return 0.0700; // 7.00%
    } else if (ltv > 0.85 && ltv <= 0.90) {
        return 0.0713; // 7.13%
    } else if (ltv > 0.90 && ltv <= 0.95) {
        return 0.0725; // 7.25%
    } else if (ltv > 0.95 && ltv <= 0.97) {
        return 0.0738; // 7.38%
    }
    return 0.0738; // Default to highest rate for LTV > 97%
}

function calculateMonthlyMortgagePayment(principal, annualInterestRate) {
    // Convert annual interest rate to monthly rate
    const monthlyInterestRate = annualInterestRate / 12;
    // Convert years to months
    const numberOfPayments = loanTermInYears * 12;
    
    // Calculate monthly payment using the formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const monthlyPayment = principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) 
        / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    return monthlyPayment;
}

function calculateSPMIRate(ltv) {
    if (ltv <= 0.80) {
        return 0.00; // 0.00%
    } else if (ltv > 0.80 && ltv <= 0.90) {
        return 0.011; // 1.10%
    } else if (ltv > 0.90 && ltv <= 0.95) {
        return 0.0165; // 1.65%
    } else if (ltv > 0.95) {
        return 0.022; // 2.20%
    }
    return 0.00; // Default case
}

function calculateFirstScenerio( totalDownpayment, actualHousingBudget ){
    const maxRestrictedHomePrice = totalDownpayment/CLTV
    let maxHomePrice = Math.floor(maxRestrictedHomePrice);
    console.log('starting maxHomePrice is ', maxHomePrice);
    while(maxHomePrice >0){
        let totalMortgageAmount = maxHomePrice - totalDownpayment;
        let LTV = totalMortgageAmount/maxHomePrice;
        let PMIRate = calculatePMIRate(LTV);
        let interestRate = calculateInterestRate(LTV);
        let monthlyPayment = Math.floor((totalMortgageAmount * PMIRate) / 12);
        let monthlyPropertyTaxAndInsurance = (maxHomePrice * propertyTaxAndInsurance) / 12;
        let monthlyMortgagePayment = calculateMonthlyMortgagePayment(totalMortgageAmount, interestRate);

        let monthlyHousingCost = monthlyPayment + monthlyPropertyTaxAndInsurance + monthlyMortgagePayment
        if(Math.abs(monthlyHousingCost - actualHousingBudget) <= 1){
            console.log('monthlyHousingCost is ', monthlyHousingCost);
            console.log('actualHousingBudget is ', actualHousingBudget);
            console.log('matched monthlyHousingCost is ', monthlyHousingCost);
            console.log('totalMortgageAmount is ', totalMortgageAmount);
            console.log('monthlyPayment is ', monthlyPayment);
            console.log('monthlyPropertyTaxAndInsurance is ', monthlyPropertyTaxAndInsurance);
            console.log('monthlyMortgagePayment is ', monthlyMortgagePayment);
            console.log('monthlyHousingCost is ', monthlyHousingCost);

            return {
                totalMortgageAmount: formatCurrency(totalMortgageAmount),
                LTV,
                PMIRate,
                interestRate,
                monthlyPayment: formatCurrency(monthlyPayment),
                monthlyPropertyTaxAndInsurance: formatCurrency(monthlyPropertyTaxAndInsurance),
                monthlyMortgagePayment: formatCurrency(monthlyMortgagePayment),
                monthlyHousingCost: formatCurrency(monthlyHousingCost),
                maxHomePrice: formatCurrency(maxHomePrice),
                maxRestrictedHomePrice: formatCurrency(maxRestrictedHomePrice),
                actualHousingBudget: formatCurrency(actualHousingBudget),
            }
        }
        maxHomePrice -= 1;
    }    
}

function calculateSecondScenerio( totalDownpayment, actualHousingBudget ){
    const maxRestrictedHomePrice = totalDownpayment/CLTV
    let maxHomePrice = Math.floor(maxRestrictedHomePrice);
    console.log('starting maxHomePrice is ', maxHomePrice);
    while(maxHomePrice >0){
        let totalMortgageAmount = maxHomePrice - totalDownpayment;
        let LTV = totalMortgageAmount/maxHomePrice;
        let PMIRate = calculatePMIRate(LTV);
        let interestRate = calculateInterestRate(LTV);
        let monthlyPayment = Math.floor((totalMortgageAmount * PMIRate) / 12);
        let monthlyPropertyTaxAndInsurance = (maxHomePrice * propertyTaxAndInsurance) / 12;
        let monthlyMortgagePayment = calculateMonthlyMortgagePayment(totalMortgageAmount, interestRate);

        let monthlyHousingCost = monthlyPayment + monthlyPropertyTaxAndInsurance + monthlyMortgagePayment
        if(Math.abs(monthlyHousingCost - actualHousingBudget) <= 1){
            console.log('monthlyHousingCost is ', monthlyHousingCost);
            console.log('actualHousingBudget is ', actualHousingBudget);
            console.log('matched monthlyHousingCost is ', monthlyHousingCost);
            console.log('totalMortgageAmount is ', totalMortgageAmount);
            console.log('monthlyPayment is ', monthlyPayment);
            console.log('monthlyPropertyTaxAndInsurance is ', monthlyPropertyTaxAndInsurance);
            console.log('monthlyMortgagePayment is ', monthlyMortgagePayment);
            console.log('monthlyHousingCost is ', monthlyHousingCost);

            return {
                totalMortgageAmount: formatCurrency(totalMortgageAmount),
                LTV,
                PMIRate,
                interestRate,
                monthlyPayment: formatCurrency(monthlyPayment),
                monthlyPropertyTaxAndInsurance: formatCurrency(monthlyPropertyTaxAndInsurance),
                monthlyMortgagePayment: formatCurrency(monthlyMortgagePayment),
                monthlyHousingCost: formatCurrency(monthlyHousingCost),
                maxHomePrice: formatCurrency(maxHomePrice),
                maxRestrictedHomePrice: formatCurrency(maxRestrictedHomePrice),
                actualHousingBudget: formatCurrency(actualHousingBudget),
            }
        }
        maxHomePrice -= 1;
    }    
}
function calculateThirdScenerio( totalDownpayment, actualHousingBudget, familySupport ){
    const maxRestrictedHomePrice = totalDownpayment/CLTV
    let maxHomePrice = Math.floor(maxRestrictedHomePrice);
    console.log('starting maxHomePrice is ', maxHomePrice);
    while(maxHomePrice >0){
        let totalMortgageAmount = maxHomePrice - totalDownpayment;
        let LTV = totalMortgageAmount/maxHomePrice;
        let PMIRate = calculatePMIRate(LTV);
        let spmiRate = calculateSPMIRate(LTV);
        let spmiCost = Math.floor((totalMortgageAmount * spmiRate));
        let remainingFamilySupport = familySupport - spmiCost;
        let rateBydown = (remainingFamilySupport/ (totalMortgageAmount/100))*rateBuydownReduction
        let baseInterestRate = calculateInterestRate(LTV);
        let interestRate = baseInterestRate - rateBydown;
        let monthlyPayment =  spmiCost > 0 ?0: totalMortgageAmount*PMIRate //Math.floor((totalMortgageAmount * PMIRate) / 12);
        let monthlyPropertyTaxAndInsurance = (maxHomePrice * propertyTaxAndInsurance) / 12;
        let monthlyMortgagePayment = calculateMonthlyMortgagePayment(totalMortgageAmount, interestRate);

        let monthlyHousingCost = monthlyPayment + monthlyPropertyTaxAndInsurance + monthlyMortgagePayment
        if(Math.abs(monthlyHousingCost - actualHousingBudget) <= 1){
            console.log('monthlyHousingCost is ', monthlyHousingCost);
            console.log('actualHousingBudget is ', actualHousingBudget);
            console.log('matched monthlyHousingCost is ', monthlyHousingCost);
            console.log('totalMortgageAmount is ', totalMortgageAmount);
            console.log('monthlyPayment is ', monthlyPayment);
            console.log('monthlyPropertyTaxAndInsurance is ', monthlyPropertyTaxAndInsurance);
            console.log('monthlyMortgagePayment is ', monthlyMortgagePayment);
            console.log('monthlyHousingCost is ', monthlyHousingCost);

            return {
                totalMortgageAmount: formatCurrency(totalMortgageAmount),
                LTV,
                PMIRate,
                spmiRate,
                interestRate,
                monthlyPayment: formatCurrency(monthlyPayment),
                monthlyPropertyTaxAndInsurance: formatCurrency(monthlyPropertyTaxAndInsurance),
                monthlyMortgagePayment: formatCurrency(monthlyMortgagePayment),
                monthlyHousingCost: formatCurrency(monthlyHousingCost),
                maxHomePrice: formatCurrency(maxHomePrice),
                maxRestrictedHomePrice: formatCurrency(maxRestrictedHomePrice),
                actualHousingBudget: formatCurrency(actualHousingBudget),
            }
        }
        maxHomePrice -= 1;
    }    
}
function calculateFourthScenerio( totalDownpayment, actualHousingBudget, familySupport ){
    const maxRestrictedHomePrice = totalDownpayment/CLTV
    let maxHomePrice = Math.floor(maxRestrictedHomePrice);
    console.log('starting maxHomePrice is ', maxHomePrice);
    while(maxHomePrice >0){
        let totalMortgageAmount = maxHomePrice - totalDownpayment;
        let LTV = totalMortgageAmount/maxHomePrice;
        let PMIRate = calculatePMIRate(LTV);
      
        let rateBydown = (familySupport/ (totalMortgageAmount/100))*rateBuydownReduction
        let baseInterestRate = calculateInterestRate(LTV);
        let interestRate = baseInterestRate - rateBydown;
        let monthlyPayment = Math.floor((totalMortgageAmount * PMIRate) / 12);
        let monthlyPropertyTaxAndInsurance = (maxHomePrice * propertyTaxAndInsurance) / 12;
        let monthlyMortgagePayment = calculateMonthlyMortgagePayment(totalMortgageAmount, interestRate);

        let monthlyHousingCost = monthlyPayment + monthlyPropertyTaxAndInsurance + monthlyMortgagePayment
        if(Math.abs(monthlyHousingCost - actualHousingBudget) <= 1){
            console.log('monthlyHousingCost is ', monthlyHousingCost);
            console.log('actualHousingBudget is ', actualHousingBudget);
            console.log('matched monthlyHousingCost is ', monthlyHousingCost);
            console.log('totalMortgageAmount is ', totalMortgageAmount);
            console.log('monthlyPayment is ', monthlyPayment);
            console.log('monthlyPropertyTaxAndInsurance is ', monthlyPropertyTaxAndInsurance);
            console.log('monthlyMortgagePayment is ', monthlyMortgagePayment);
            console.log('monthlyHousingCost is ', monthlyHousingCost);

            return {
                totalMortgageAmount: formatCurrency(totalMortgageAmount),
                LTV,
                PMIRate,
                interestRate,
                monthlyPayment: formatCurrency(monthlyPayment),
                monthlyPropertyTaxAndInsurance: formatCurrency(monthlyPropertyTaxAndInsurance),
                monthlyMortgagePayment: formatCurrency(monthlyMortgagePayment),
                monthlyHousingCost: formatCurrency(monthlyHousingCost),
                maxHomePrice: formatCurrency(maxHomePrice),
                maxRestrictedHomePrice: formatCurrency(maxRestrictedHomePrice),
                actualHousingBudget: formatCurrency(actualHousingBudget),
            }
        }
        maxHomePrice -= 1;
    }    
}

function calculate() {
    const income = parseFloat(document.getElementById('income').value);
    const debt = parseFloat(document.getElementById('debt').value);
    const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    const familySupport = parseFloat(document.getElementById('familySupport').value) || 0;
    const totalDownpayment = downPayment + familySupport;

    const monthlyIncome = income / 12;
    const maxHousingExpense = monthlyIncome * maxHousingDTIRatio;
    const maxDebtExpense = monthlyIncome * maxDTIRatio;
    const actualHousingBudget =  Math.floor(Math.min( maxHousingExpense , maxDebtExpense - debt));

    let firstScenerio = calculateFirstScenerio(downPayment, actualHousingBudget);
    let secondScenerio = calculateSecondScenerio(totalDownpayment, actualHousingBudget);
    let thirdScenerio = calculateThirdScenerio(downPayment, actualHousingBudget, familySupport);
    let fourthScenerio = calculateFourthScenerio(downPayment, actualHousingBudget, familySupport);
   


  
    document.getElementById('result1').innerHTML = `
    <h2>First Scenerio</h2>
    <h3 style="color: green;">Max Home Price: ${firstScenerio.maxHomePrice}</h3>
    <p>Personal Down Payment: <b>${downPayment ? formatCurrency(downPayment) : '$0'}</b></p>
    <p>Family Down Payment: <b>${familySupport ? formatCurrency(familySupport) : '$0'}</b></p>
    <p>Down Payment: <b>${downPayment ? formatCurrency(downPayment) : '$0'}</b></p>
    <p>Mortgage Amount: <b>${firstScenerio.totalMortgageAmount}</b></p>
    <p>LTV: <b>${firstScenerio.LTV}</b></p>
    <p>PMI Rate: <b>${firstScenerio.PMIRate}</b></p>
    <p>Int Rate: <b>${firstScenerio.interestRate}%</b></p>
    <p>Monthly PMI: <b>${firstScenerio.monthlyPayment}</b></p>
    <p>Monthly Tax & Insurance: <b>${firstScenerio.monthlyPropertyTaxAndInsurance}</b></p>
    <p>Monthly Mortgage PMT: <b>${firstScenerio.monthlyMortgagePayment}</b></p>
    <p>Monthly Housing Costs: <b>${firstScenerio.monthlyHousingCost}</b></p>
    <p>Max Home Price Restric: <b>${firstScenerio.maxRestrictedHomePrice}</b></p>
    <p>Actual Housing Budget: <b>${firstScenerio.actualHousingBudget}</b></p>
    `;
    document.getElementById('result2').innerHTML = `
    <h2>Second Scenerio</h2>
    <h3 style="color: green;">Max Home Price: ${secondScenerio.maxHomePrice}</h3>
    <p>Personal Down Payment: <b>${downPayment ? formatCurrency(downPayment) : '$0'}</b></p>
    <p>Family Down Payment: <b>${familySupport ? formatCurrency(familySupport) : '$0'}</b></p>
    <p>Down Payment: <b>${totalDownpayment ? formatCurrency(totalDownpayment) : '$0'}</b></p>
    <p>Mortgage Amount: <b>${secondScenerio.totalMortgageAmount}</b></p>
    <p>LTV: <b>${secondScenerio.LTV}</b></p>
    <p>PMI Rate: <b>${secondScenerio.PMIRate}</b></p>
    <p>Int Rate: <b>${secondScenerio.interestRate}%</b></p>
    <p>Monthly PMI: <b>${secondScenerio.monthlyPayment}</b></p>
    <p>Monthly Tax & Insurance: <b>${secondScenerio.monthlyPropertyTaxAndInsurance}</b></p>
    <p>Monthly Mortgage PMT: <b>${secondScenerio.monthlyMortgagePayment}</b></p>
    <p>Monthly Housing Costs: <b>${secondScenerio.monthlyHousingCost}</b></p>
    <p>Max Home Price Restric: <b>${secondScenerio.maxRestrictedHomePrice}</b></p>
    <p>Actual Housing Budget: <b>${secondScenerio.actualHousingBudget}</b></p>
    `;
    document.getElementById('result3').innerHTML = `
    <h2>Third Scenerio</h2>
    <h3 style="color: green;">Max Home Price: ${thirdScenerio.maxHomePrice}</h3>
    <p>Personal Down Payment: <b>${downPayment ? formatCurrency(downPayment) : '$0'}</b></p>
    <p>Family Down Payment: <b>${familySupport ? formatCurrency(familySupport) : '$0'}</b></p>
    <p>Down Payment: <b>${downPayment ? formatCurrency(downPayment) : '$0'}</b></p>
    <p>Mortgage Amount: <b>${thirdScenerio.totalMortgageAmount}</b></p>
    <p>LTV: <b>${thirdScenerio.LTV}</b></p>
    <p>PMI Rate: <b>${thirdScenerio.PMIRate}</b></p>
    <p>SPMI Rate: <b>${thirdScenerio.spmiRate}%</b></p>
    <p>SPMI Cost (min support req'd): <b>${thirdScenerio.spmiCost ? formatCurrency(thirdScenerio.spmiCost) : '$0'}</b></p>
    <p>Remaining Family Support: <b>${thirdScenerio.remainingFamilySupport ? formatCurrency(thirdScenerio.remainingFamilySupport) : '$0'}</b></p>
    <p>Rate BuyDown: <b>${thirdScenerio.rateBydown ? thirdScenerio.rateBydown : '0'}</b></p>
    <p>Int Rate: <b>${thirdScenerio.interestRate}%</b></p>
    <p>Monthly PMI: <b>${thirdScenerio.monthlyPayment}</b></p>
    <p>Monthly Tax & Insurance: <b>${thirdScenerio.monthlyPropertyTaxAndInsurance}</b></p>
    <p>Monthly Mortgage PMT: <b>${thirdScenerio.monthlyMortgagePayment}</b></p>
    <p>Monthly Housing Costs: <b>${thirdScenerio.monthlyHousingCost}</b></p>
    <p>Max Home Price Restric: <b>${thirdScenerio.maxRestrictedHomePrice}</b></p>
    <p>Actual Housing Budget: <b>${thirdScenerio.actualHousingBudget}</b></p>
    `;
    document.getElementById('result4').innerHTML = `
    <h2>Fourth Scenerio</h2>
    <h3 style="color: green;">Max Home Price: ${fourthScenerio.maxHomePrice}</h3>
    <p>Personal Down Payment: <b>${downPayment ? formatCurrency(downPayment) : '$0'}</b></p>
    <p>Family Down Payment: <b>${familySupport ? formatCurrency(familySupport) : '$0'}</b></p>
    <p>Down Payment: <b>${downPayment ? formatCurrency(downPayment) : '$0'}</b></p>
    <p>Mortgage Amount: <b>${fourthScenerio.totalMortgageAmount}</b></p>
    <p>LTV: <b>${fourthScenerio.LTV}</b></p>
    <p>PMI Rate: <b>${fourthScenerio.PMIRate}</b></p>
    <p>Int Rate: <b>${fourthScenerio.interestRate}%</b></p>
    <p>Monthly PMI: <b>${fourthScenerio.monthlyPayment}</b></p>
    <p>Monthly Tax & Insurance: <b>${fourthScenerio.monthlyPropertyTaxAndInsurance}</b></p>
    <p>Monthly Mortgage PMT: <b>${fourthScenerio.monthlyMortgagePayment}</b></p>
    <p>Monthly Housing Costs: <b>${fourthScenerio.monthlyHousingCost}</b></p>
    <p>Max Home Price Restric: <b>${fourthScenerio.maxRestrictedHomePrice}</b></p>
    <p>Actual Housing Budget: <b>${fourthScenerio.actualHousingBudget}</b></p>
    `;

  }
  