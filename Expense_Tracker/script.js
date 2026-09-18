/* =================================
   EXPENSE TRACKER JAVASCRIPT
================================= */


/* =================================
   GET TRANSACTIONS
================================= */

let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];


/* =================================
   SAVE TRANSACTIONS
================================= */

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


/* =================================
   FORMAT MONEY
================================= */

function formatAmount(amount) {

    return new Intl.NumberFormat("en-IN", {

        style: "currency",

        currency: "INR",

        maximumFractionDigits: 2

    }).format(amount);

}


/* =================================
   CALCULATE TOTALS
================================= */

function calculateTotals() {

    let income = 0;

    let expense = 0;


    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {

            income += transaction.amount;

        } else {

            expense += transaction.amount;

        }

    });


    return {

        income: income,

        expense: expense,

        balance: income - expense

    };

}


/* =================================
   DASHBOARD
================================= */

function updateDashboard() {

    const incomeElement =
        document.getElementById("dashboardIncome");

    const expenseElement =
        document.getElementById("dashboardExpense");

    const balanceElement =
        document.getElementById("dashboardBalance");


    if (!incomeElement) {
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


/* =================================
   DASHBOARD RECENT TRANSACTIONS
================================= */

function displayDashboardTransactions() {

    const list =
        document.getElementById(
            "dashboardTransactions"
        );


    if (!list) {
        return;
    }


    list.innerHTML = "";


    if (transactions.length === 0) {

        list.innerHTML =
            '<p class="empty-message">' +
            'No transactions added yet.' +
            '</p>';

        return;

    }


    // Show latest 5 transactions

    const recentTransactions =
        transactions.slice(-5).reverse();


    recentTransactions.forEach(
        function(transaction) {

            const item =
                createTransactionElement(
                    transaction,
                    false
                );

            list.appendChild(item);

        }
    );

}


/* =================================
   CREATE TRANSACTION ELEMENT
================================= */

function createTransactionElement(
    transaction,
    showDelete
) {

    const item =
        document.createElement("div");

    item.className = "transaction";


    const info =
        document.createElement("div");

    info.className = "transaction-info";


    const name =
        document.createElement("h3");

    name.textContent =
        transaction.title;


    const details =
        document.createElement("p");

    details.textContent =
        transaction.category +
        " | " +
        transaction.date;


    info.appendChild(name);

    info.appendChild(details);


    const right =
        document.createElement("div");

    right.className =
        "transaction-right";


    const amount =
        document.createElement("span");

    amount.className =
        "transaction-amount";


    if (transaction.type === "income") {

        amount.classList.add(
            "income-text"
        );

        amount.textContent =
            "+ " +
            formatAmount(transaction.amount);

    } else {

        amount.classList.add(
            "expense-text"
        );

        amount.textContent =
            "- " +
            formatAmount(transaction.amount);

    }


    right.appendChild(amount);


    /* Delete Button */

    if (showDelete) {

        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-btn";

        deleteButton.textContent =
            "Delete";


        deleteButton.addEventListener(
            "click",
            function() {

                deleteTransaction(
                    transaction.id
                );

            }
        );


        right.appendChild(
            deleteButton
        );

    }


    item.appendChild(info);

    item.appendChild(right);


    return item;

}


/* =================================
   ADD TRANSACTION
================================= */

const expenseForm =
    document.getElementById(
        "expenseForm"
    );


if (expenseForm) {

    const dateInput =
        document.getElementById("date");


    /* Set today's date */

    if (dateInput) {

        dateInput.value =
            new Date()
            .toLocaleDateString("en-CA");

    }


    expenseForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const title =
                document
                .getElementById("title")
                .value
                .trim();


            const amount =
                Number(
                    document
                    .getElementById("amount")
                    .value
                );


            const type =
                document
                .getElementById("type")
                .value;


            const category =
                document
                .getElementById("category")
                .value;


            const date =
                document
                .getElementById("date")
                .value;


            /* Validation */

            if (
                title === "" ||
                !Number.isFinite(amount) ||
                amount <= 0 ||
                date === ""
            ) {

                alert(
                    "Please enter valid details."
                );

                return;

            }


            /* Create Transaction */

            const transaction = {

                id: Date.now(),

                title: title,

                amount: amount,

                type: type,

                category: category,

                date: date

            };


            /* Add to array */

            transactions.push(
                transaction
            );


            /* Save */

            saveTransactions();


            alert(
                "Transaction added successfully!"
            );


            /* Reset form */

            expenseForm.reset();


            /* Set date again */

            if (dateInput) {

                dateInput.value =
                    new Date()
                    .toLocaleDateString(
                        "en-CA"
                    );

            }

        }
    );

}


/* =================================
   HISTORY PAGE
================================= */

function displayHistory() {

    const historyList =
        document.getElementById(
            "historyList"
        );


    if (!historyList) {
        return;
    }


    historyList.innerHTML = "";


    if (transactions.length === 0) {

        historyList.innerHTML =
            '<p class="empty-message">' +
            'No transactions added yet.' +
            '</p>';

        return;

    }


    /* Latest transaction first */

    const sortedTransactions =
        [...transactions].reverse();


    sortedTransactions.forEach(
        function(transaction) {

            const item =
                createTransactionElement(
                    transaction,
                    true
                );

            historyList.appendChild(
                item
            );

        }
    );

}


/* =================================
   DELETE TRANSACTION
================================= */

function deleteTransaction(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmDelete) {
        return;
    }


    transactions =
        transactions.filter(
            function(transaction) {

                return transaction.id !== id;

            }
        );


    saveTransactions();


    /* Refresh page data */

    displayHistory();

    updateDashboard();

    displayReports();

}


/* =================================
   REPORTS
================================= */

function displayReports() {

    const incomeElement =
        document.getElementById(
            "reportIncome"
        );


    if (!incomeElement) {
        return;
    }


    const expenseElement =
        document.getElementById(
            "reportExpense"
        );


    const balanceElement =
        document.getElementById(
            "reportBalance"
        );


    const countElement =
        document.getElementById(
            "reportCount"
        );


    const totals =
        calculateTotals();


    incomeElement.textContent =
        formatAmount(
            totals.income
        );


    expenseElement.textContent =
        formatAmount(
            totals.expense
        );


    balanceElement.textContent =
        formatAmount(
            totals.balance
        );


    countElement.textContent =
        transactions.length;


    displayCategoryReport();

}


/* =================================
   CATEGORY REPORT
================================= */

function displayCategoryReport() {

    const categoryReport =
        document.getElementById(
            "categoryReport"
        );


    if (!categoryReport) {
        return;
    }


    categoryReport.innerHTML = "";


    /* Store category totals */

    const categories = {};


    transactions.forEach(
        function(transaction) {

            if (
                transaction.type ===
                "expense"
            ) {

                if (
                    !categories[
                        transaction.category
                    ]
                ) {

                    categories[
                        transaction.category
                    ] = 0;

                }


                categories[
                    transaction.category
                ] += transaction.amount;

            }

        }
    );


    const categoryNames =
        Object.keys(categories);


    if (categoryNames.length === 0) {

        categoryReport.innerHTML =
            '<p class="empty-message">' +
            'No expense data available.' +
            '</p>';

        return;

    }


    categoryNames.forEach(
        function(category) {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "category-item";


            const name =
                document.createElement(
                    "span"
                );

            name.className =
                "category-name";

            name.textContent =
                category;


            const amount =
                document.createElement(
                    "span"
                );

            amount.className =
                "category-amount";

            amount.textContent =
                formatAmount(
                    categories[category]
                );


            item.appendChild(name);

            item.appendChild(amount);


            categoryReport.appendChild(
                item
            );

        }
    );

}


/* =================================
   RUN FUNCTIONS
================================= */

displayHistory();

updateDashboard();

displayReports();