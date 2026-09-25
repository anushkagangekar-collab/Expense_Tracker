/* =====================================
   Expense Tracker JavaScript
===================================== */


/* =====================================
   Get Transactions From Local Storage
===================================== */

function getTransactions() {

    const data = localStorage.getItem("transactions");

    if (data) {
        return JSON.parse(data);
    }

    return [];
}


/* =====================================
   Save Transactions
===================================== */

function saveTransactions(transactions) {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}


/* =====================================
   Format Amount
===================================== */

function formatAmount(amount) {

    return "₹" + Number(amount).toLocaleString("en-IN");
}


/* =====================================
   Calculate Totals
===================================== */

function calculateTotals() {

    const transactions = getTransactions();

    let income = 0;
    let expense = 0;

    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {

            income += Number(transaction.amount);

        } else {

            expense += Number(transaction.amount);

        }

    });

    const balance = income - expense;

    return {
        income: income,
        expense: expense,
        balance: balance
    };
}


/* =====================================
   Add Transaction
===================================== */

const expenseForm = document.getElementById("expenseForm");

if (expenseForm) {

    expenseForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const title =
            document.getElementById("title").value.trim();

        const amount =
            document.getElementById("amount").value;

        const type =
            document.getElementById("type").value;

        const category =
            document.getElementById("category").value;

        const date =
            document.getElementById("date").value;


        if (
            title === "" ||
            amount === "" ||
            type === "" ||
            category === "" ||
            date === ""
        ) {

            alert("Please fill all fields.");

            return;
        }


        const transactions = getTransactions();


        const newTransaction = {

            id: Date.now(),

            title: title,

            amount: Number(amount),

            type: type,

            category: category,

            date: date

        };


        transactions.push(newTransaction);


        saveTransactions(transactions);


        alert("Transaction added successfully!");


        expenseForm.reset();


        window.location.href = "history.html";

    });

}


/* =====================================
   Update Dashboard
===================================== */

function updateDashboard() {

    const incomeElement =
        document.getElementById("dashboardIncome");

    const expenseElement =
        document.getElementById("dashboardExpense");

    const balanceElement =
        document.getElementById("dashboardBalance");


    if (
        !incomeElement ||
        !expenseElement ||
        !balanceElement
    ) {

        return;
    }


    const totals = calculateTotals();


    incomeElement.textContent =
        formatAmount(totals.income);

    expenseElement.textContent =
        formatAmount(totals.expense);

    balanceElement.textContent =
        formatAmount(totals.balance);


    displayDashboardTransactions();

}


/* =====================================
   Dashboard Transactions
===================================== */

function displayDashboardTransactions() {

    const container =
        document.getElementById("dashboardTransactions");


    if (!container) {
        return;
    }


    const transactions = getTransactions();


    if (transactions.length === 0) {

        container.innerHTML = `
            <p class="empty-message">
                No transactions available.
            </p>
        `;

        return;
    }


    const recentTransactions =
        transactions.slice(-5).reverse();


    container.innerHTML = "";


    recentTransactions.forEach(function(transaction) {

        const amountClass =
            transaction.type === "income"
                ? "income-amount"
                : "expense-amount";


        const sign =
            transaction.type === "income"
                ? "+"
                : "-";


        const item =
            document.createElement("div");


        item.className =
            "transaction-item";


        item.innerHTML = `

            <div class="transaction-info">

                <h3>
                    ${transaction.title}
                </h3>

                <p>
                    ${transaction.category}
                    | ${transaction.date}
                </p>

            </div>

            <div class="transaction-amount ${amountClass}">
                ${sign}${formatAmount(transaction.amount)}
            </div>

        `;


        container.appendChild(item);

    });

}


/* =====================================
   Display History
===================================== */

function displayHistory() {

    const container =
        document.getElementById("historyList");


    if (!container) {
        return;
    }


    const transactions = getTransactions();


    if (transactions.length === 0) {

        container.innerHTML = `
            <p class="empty-message">
                No transactions available.
                <br><br>
                Add your first transaction.
            </p>
        `;

        return;
    }


    container.innerHTML = "";


    const sortedTransactions =
        [...transactions].reverse();


    sortedTransactions.forEach(function(transaction) {

        const amountClass =
            transaction.type === "income"
                ? "income-amount"
                : "expense-amount";


        const sign =
            transaction.type === "income"
                ? "+"
                : "-";


        const item =
            document.createElement("div");


        item.className =
            "transaction-item";


        item.innerHTML = `

            <div class="transaction-info">

                <h3>
                    ${transaction.title}
                </h3>

                <p>
                    Category: ${transaction.category}
                    <br>
                    Date: ${transaction.date}
                    <br>
                    Type: ${transaction.type}
                </p>

            </div>


            <div class="transaction-amount ${amountClass}">
                ${sign}${formatAmount(transaction.amount)}
            </div>


            <button
                class="delete-btn"
                onclick="deleteTransaction(${transaction.id})">

                Delete

            </button>

        `;


        container.appendChild(item);

    });

}


/* =====================================
   Delete Transaction
===================================== */

function deleteTransaction(id) {

    const confirmation =
        confirm("Are you sure you want to delete this transaction?");


    if (!confirmation) {
        return;
    }


    let transactions =
        getTransactions();


    transactions =
        transactions.filter(function(transaction) {

            return transaction.id !== id;

        });


    saveTransactions(transactions);


    displayHistory();

    updateDashboard();

    displayReports();

}


/* =====================================
   Display Reports
===================================== */

function displayReports() {

    const incomeElement =
        document.getElementById("reportIncome");

    const expenseElement =
        document.getElementById("reportExpense");

    const balanceElement =
        document.getElementById("reportBalance");

    const countElement =
        document.getElementById("reportCount");


    if (
        !incomeElement ||
        !expenseElement ||
        !balanceElement ||
        !countElement
    ) {

        return;
    }


    const transactions =
        getTransactions();


    const totals =
        calculateTotals();


    incomeElement.textContent =
        formatAmount(totals.income);


    expenseElement.textContent =
        formatAmount(totals.expense);


    balanceElement.textContent =
        formatAmount(totals.balance);


    countElement.textContent =
        transactions.length;


    displayCategoryReport();

}


/* =====================================
   Category Report
===================================== */

function displayCategoryReport() {

    const container =
        document.getElementById("categoryReport");


    if (!container) {
        return;
    }


    const transactions =
        getTransactions();


    const expenses =
        transactions.filter(function(transaction) {

            return transaction.type === "expense";

        });


    if (expenses.length === 0) {

        container.innerHTML = `
            <p class="empty-message">
                No expense data available.
            </p>
        `;

        return;
    }


    const categoryTotals = {};


    expenses.forEach(function(transaction) {

        const category =
            transaction.category;


        if (!categoryTotals[category]) {

            categoryTotals[category] = 0;

        }


        categoryTotals[category] +=
            Number(transaction.amount);

    });


    container.innerHTML = "";


    Object.keys(categoryTotals).forEach(function(category) {

        const item =
            document.createElement("div");


        item.className =
            "category-item";


        item.innerHTML = `

            <span class="category-name">
                ${category}
            </span>

            <span class="category-amount">
                ${formatAmount(categoryTotals[category])}
            </span>

        `;


        container.appendChild(item);

    });

}


/* =====================================
   Initialize
===================================== */

document.addEventListener("DOMContentLoaded", function() {

    displayHistory();

    updateDashboard();

    displayReports();

});
